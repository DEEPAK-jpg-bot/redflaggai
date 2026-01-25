import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Product to plan mapping
const PRODUCT_TO_PLAN: Record<string, { plan: string; scansPerMonth: number }> = {
  "prod_TqfvkBS9gynTsl": { plan: "hunter", scansPerMonth: 1 },
  "prod_TqfvqmpRhH6Tkr": { plan: "firm", scansPerMonth: 10 },
};

serve(async (req) => {
  // Only allow POST requests for webhooks
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Create untyped Supabase client for edge function
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey, { 
      auth: { persistSession: false } 
    });

    const body = await req.text();
    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        logStep("Missing signature header");
        return new Response("Missing signature", { status: 400 });
      }

      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        console.error("[STRIPE-WEBHOOK] Signature verification failed:", err);
        return new Response("Invalid signature", { status: 400 });
      }
    } else {
      // Parse event without verification (not recommended for production)
      event = JSON.parse(body);
      logStep("Webhook received without signature verification (STRIPE_WEBHOOK_SECRET not set)");
    }

    logStep("Processing event", { type: event.type, id: event.id });

    // Check for duplicate events
    const { data: existingEvent } = await supabase
      .from("subscription_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();

    if (existingEvent) {
      logStep("Duplicate event, skipping", { eventId: event.id });
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(supabase, stripe, subscription, event);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(supabase, stripe, subscription, event);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(supabase, stripe, invoice, event);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, stripe, invoice, event);
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("[STRIPE-WEBHOOK] ERROR:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionChange(
  supabase: any,
  stripe: Stripe,
  subscription: Stripe.Subscription,
  event: Stripe.Event
) {
  logStep("Handling subscription change", { 
    subscriptionId: subscription.id, 
    status: subscription.status 
  });

  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer.deleted || !('email' in customer) || !customer.email) {
    logStep("Customer not found or deleted");
    return;
  }

  // Find user by email
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("email", customer.email)
    .maybeSingle();

  if (!profile) {
    logStep("No profile found for customer", { email: customer.email });
    return;
  }

  // Get plan info from product
  const productId = subscription.items.data[0]?.price?.product as string;
  const planInfo = PRODUCT_TO_PLAN[productId] || { plan: "free", scansPerMonth: 1 };
  
  const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      subscription_plan: planInfo.plan,
      subscription_ends_at: subscriptionEnd,
      subscription_started_at: new Date(subscription.start_date * 1000).toISOString(),
      monthly_scan_limit: planInfo.scansPerMonth,
      stripe_customer_id: customerId,
    })
    .eq("user_id", profile.user_id);

  if (updateError) {
    console.error("[STRIPE-WEBHOOK] Profile update failed:", updateError);
  }

  // Log event
  await supabase.from("subscription_events").insert({
    user_id: profile.user_id,
    event_type: event.type,
    stripe_event_id: event.id,
    plan: planInfo.plan,
  });

  logStep("Subscription updated", { userId: profile.user_id, plan: planInfo.plan });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionCancelled(
  supabase: any,
  stripe: Stripe,
  subscription: Stripe.Subscription,
  event: Stripe.Event
) {
  logStep("Handling subscription cancellation", { subscriptionId: subscription.id });

  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer.deleted || !('email' in customer) || !customer.email) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("email", customer.email)
    .maybeSingle();

  if (!profile) return;

  // Reset to free plan
  await supabase
    .from("profiles")
    .update({
      subscription_plan: "free",
      subscription_ends_at: null,
      monthly_scan_limit: 1,
    })
    .eq("user_id", profile.user_id);

  // Log event
  await supabase.from("subscription_events").insert({
    user_id: profile.user_id,
    event_type: event.type,
    stripe_event_id: event.id,
    plan: "free",
  });

  logStep("Subscription cancelled", { userId: profile.user_id });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePaymentSucceeded(
  supabase: any,
  stripe: Stripe,
  invoice: Stripe.Invoice,
  event: Stripe.Event
) {
  logStep("Handling payment succeeded", { invoiceId: invoice.id });

  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer.deleted || !('email' in customer) || !customer.email) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("email", customer.email)
    .maybeSingle();

  if (!profile) return;

  // Log payment event
  await supabase.from("subscription_events").insert({
    user_id: profile.user_id,
    event_type: event.type,
    stripe_event_id: event.id,
    amount_cents: invoice.amount_paid,
  });

  logStep("Payment recorded", { userId: profile.user_id, amount: invoice.amount_paid });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePaymentFailed(
  supabase: any,
  stripe: Stripe,
  invoice: Stripe.Invoice,
  event: Stripe.Event
) {
  logStep("Handling payment failed", { invoiceId: invoice.id });

  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer.deleted || !('email' in customer) || !customer.email) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("email", customer.email)
    .maybeSingle();

  if (!profile) return;

  // Log failed payment event
  await supabase.from("subscription_events").insert({
    user_id: profile.user_id,
    event_type: event.type,
    stripe_event_id: event.id,
    amount_cents: invoice.amount_due,
  });

  logStep("Payment failure recorded", { userId: profile.user_id });
}
