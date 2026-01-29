import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://id-preview--073c7065-33c9-4060-b7ea-e49a4ba1ab66.lovable.app",
  "https://073c7065-33c9-4060-b7ea-e49a4ba1ab66.lovable.app",
  "http://localhost:5173",
  "http://localhost:3000",
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
  console.log(`[VALIDATE-SCAN-LIMIT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({
        canCreate: false,
        error: "Authentication required"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(JSON.stringify({
        canCreate: false,
        error: "Invalid authentication"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    // Fetch user's profile with scan limits including rollover
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("scans_used_this_month, monthly_scan_limit, subscription_plan, rollover_scans")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      logStep("Profile not found", { error: profileError?.message });
      return new Response(JSON.stringify({
        canCreate: false,
        error: "User profile not found"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    let { scans_used_this_month, monthly_scan_limit, subscription_plan, rollover_scans } = profile;

    // Check if it's the tester account
    if (user.email === "tester@redflag.ai") {
      logStep("Tester account detected, overriding limits");
      monthly_scan_limit = 20;
      subscription_plan = "tester" as any;
    }

    // Can create if: has rollover scans OR hasn't hit monthly limit
    const hasRolloverAvailable = (rollover_scans || 0) > 0;
    const hasMonthlyAvailable = scans_used_this_month < monthly_scan_limit;
    const canCreate = hasRolloverAvailable || hasMonthlyAvailable;

    const totalAvailable = (rollover_scans || 0) + Math.max(0, monthly_scan_limit - scans_used_this_month);

    logStep("Scan limit check", {
      scans_used: scans_used_this_month,
      limit: monthly_scan_limit,
      rollover: rollover_scans || 0,
      canCreate,
      plan: subscription_plan
    });

    return new Response(JSON.stringify({
      canCreate,
      scansUsed: scans_used_this_month,
      monthlyLimit: monthly_scan_limit,
      remainingScans: totalAvailable,
      rolloverScans: rollover_scans || 0,
      plan: subscription_plan,
      message: canCreate
        ? `You have ${totalAvailable} scan${totalAvailable !== 1 ? 's' : ''} remaining (${rollover_scans || 0} rollover).`
        : "You've reached your monthly scan limit. Please upgrade your plan for more scans."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: canCreate ? 200 : 403,
    });

  } catch (error) {
    console.error("[VALIDATE-SCAN-LIMIT] ERROR:", error);
    return new Response(JSON.stringify({
      canCreate: false,
      error: "An error occurred while validating scan limit. Please try again."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
