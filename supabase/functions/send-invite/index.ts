import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import nodemailer from 'https://esm.sh/nodemailer@6.9.7';

serve(async (req) => {
  try {
    const { email, nombre, pdfBase64 } = await req.json();
    if (!email || !nombre || !pdfBase64) {
      return new Response(JSON.stringify({ error: 'Faltan campos' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: Deno.env.get('SMTP_HOST'),
      port: Number(Deno.env.get('SMTP_PORT')),
      secure: true,
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASS'),
      },
    });

    await transporter.sendMail({
      from: Deno.env.get('SMTP_FROM') || 'noreply@coe-evolution.com',
      to: email,
      subject: 'COE Evolution — Tu código de acceso',
      text: `Hola ${nombre},\n\nGracias por confirmar tu asistencia a COE Evolution 2026.\n\nAdjunto encontrarás tu código QR personal e intransferible.\n\nPreséntalo en la entrada del evento.\n\nCOE Evolution · 2026`,
      attachments: [{
        filename: 'COE_Evolution_QR.pdf',
        content: pdfBase64,
        encoding: 'base64',
      }],
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Email error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
