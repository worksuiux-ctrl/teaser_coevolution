import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: existente } = await supabase
      .from('invitados')
      .select('nombre, uid')
      .eq('correo', correo)
      .maybeSingle();

    if (existente) {
      return new Response(JSON.stringify({
        registered: true,
        uid: existente.uid,
        nombre: existente.nombre,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uid = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from('invitados')
      .insert({ uid, nombre, telefono, correo, cargo, organizacion, confirmado });

    if (insertError) throw new Error(insertError.message);

    return new Response(JSON.stringify({
      registered: false,
      uid,
      nombre,
    }), {
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
