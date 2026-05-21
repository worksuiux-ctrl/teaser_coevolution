import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import nodemailer from 'https://esm.sh/nodemailer@6.9.7';

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
    const { email, nombre, pdfBase64 } = await req.json();
    if (!email || !nombre || !pdfBase64) {
      return new Response(JSON.stringify({ error: 'Faltan campos' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const host = Deno.env.get('SMTP_HOST')!;
    const user = Deno.env.get('SMTP_USER')!;
    const pass = Deno.env.get('SMTP_PASS')!;

    const transporter = nodemailer.createTransport({
      host,
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"COE Evolution" <${user}>`,
      to: email,
      subject: 'COE Evolution — Tu código de acceso',
      text: `Hola ${nombre},

Gracias por confirmar tu asistencia a COE Evolution 2026.

Adjunto encontrarás tu código QR personal e intransferible.

Preséntalo en la entrada del evento.

COE Evolution · 2026`,
      attachments: [{
        filename: 'COE_Evolution_QR.pdf',
        content: pdfBase64,
        encoding: 'base64',
      }],
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
