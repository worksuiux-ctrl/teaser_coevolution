import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { correo } = await req.json();
    if (!correo) {
      return new Response(JSON.stringify({ error: 'Falta el correo' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const resp = await fetch(
      `${supabaseUrl}/rest/v1/invitados?correo=eq.${encodeURIComponent(correo)}&select=nombre,uid`,
      { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` } }
    );

    const rows = await resp.json();
    const registered = Array.isArray(rows) && rows.length > 0;

    return new Response(JSON.stringify({ registered }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
