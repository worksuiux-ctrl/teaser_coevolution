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
    const { nombre, telefono, correo, cargo, organizacion, confirmado } = await req.json();
    if (!nombre || !telefono || !correo) {
      return new Response(JSON.stringify({ error: 'Faltan nombre, teléfono o correo' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const headers = { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };

    const resp = await fetch(`${supabaseUrl}/rest/v1/invitados?correo=eq.${encodeURIComponent(correo)}&select=nombre,uid`, { headers });
    const rows = await resp.json();

    if (Array.isArray(rows) && rows.length > 0) {
      const { nombre: nombreExistente, uid } = rows[0];
      return new Response(JSON.stringify({ registered: true, uid, nombre: nombreExistente }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uid = crypto.randomUUID();
    const insertResp = await fetch(`${supabaseUrl}/rest/v1/invitados`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ uid, nombre, telefono, correo, cargo, organizacion, confirmado }),
    });

    if (!insertResp.ok) {
      const errBody = await insertResp.json();
      throw new Error(errBody.message || 'Error al insertar');
    }

    return new Response(JSON.stringify({ registered: false, uid, nombre }), {
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
