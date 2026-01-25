import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://id-preview--073c7065-33c9-4060-b7ea-e49a4ba1ab66.lovable.app",
  "https://073c7065-33c9-4060-b7ea-e49a4ba1ab66.lovable.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Whitelist of allowed Stripe price IDs
const ALLOWED_PRICE_IDS = [
  "price_1SsyZSGVnyAmg0cgJZb1dqcX", // Hunter Plan
  "price_1SsyZzGVnyAmg0cgqCsILqSL", // Firm Plan
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Validate priceId format and whitelist
const isValidPriceId = (priceId: unknown): priceId is string => {
  if (typeof priceId !== "string") return false;
  // Check format: must start with "price_" and be alphanumeric
  if (!/^price_[a-zA-Z0-9]+$/.test(priceId)) return false;
  // Check against whitelist
  return ALLOWED_PRICE_IDS.includes(priceId);
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      throw new Error("Invalid request body");
    }

    const { priceId } = requestBody;
    
    // Validate priceId format and against whitelist
    if (!isValidPriceId(priceId)) {
      logStep("Invalid price ID rejected", { priceId });
      return new Response(JSON.stringify({ error: "Invalid subscription plan selected." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    logStep("Price ID validated", { priceId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    }

    // Validate origin for success/cancel URLs
    const requestOrigin = req.headers.get("origin");
    const safeOrigin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) 
      ? requestOrigin 
      : ALLOWED_ORIGINS[0];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${safeOrigin}/dashboard?subscription=success`,
      cancel_url: `${safeOrigin}/pricing?subscription=cancelled`,
      metadata: {
        user_id: user.id,
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Log detailed error server-side only
    console.error("[CREATE-CHECKOUT] ERROR:", error);
    // Return generic error message to client
    return new Response(JSON.stringify({ 
      error: "An error occurred while creating checkout. Please try again." 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
