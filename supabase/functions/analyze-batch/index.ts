
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { LedgerEntry } from "../../src/types/index.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 1. Initialize Gemini with Google API
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. JWT Verification
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error("Missing Authorization header");
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401
            });
        }

        const { batchId, transactions, contextSummary } = await req.json();

        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        // 2. Construct the Prompt
        const prompt = `
      Analyze this batch of ${transactions.length} transactions from a company ledger. 
      Context so far: ${contextSummary || "None."}
      
      Look for:
      1. Personal expenses hidden as business (e.g. "Disney", "Spa", "Jewelry").
      2. Kickbacks or Conflicts (Round number payments to consulting firms).
      3. Payroll anomalies.
      
      Transactions:
      ${JSON.stringify(transactions.map((t: LedgerEntry) => `${t.date} | ${t.description} | $${t.amount}`))}
      
      Return ONLY a JSON object with this structure:
      {
        "suspicious_items": [
          { "description": "...", "amount": 0, "reason": "..." }
        ],
        "new_context_summary": "Updated brief summary of findings so far..."
      }
    `;

        // 3. Call Gemini
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 4. Parse Gemini Response
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Clean markdown code blocks if present
        const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '');
        const result = JSON.parse(cleanJson);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
