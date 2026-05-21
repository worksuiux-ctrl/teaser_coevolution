import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import nodemailer from 'https://esm.sh/nodemailer@6.9.7';

serve(async (req) => {
  try {
    const { email, nombre, pdfBase64 } = await req.json();
    if (!email || !nombre || !pdfBase64) {
      return new Response(JSON.stringify({ error: 'Faltan campos' }), { status: 400 });
    }

    const host = Deno.env.get('SMTP_HOST')!;
    const port = Number(Deno.env.get('SMTP_PORT'));

    // Intentar primero con SSL (puerto 465), fallback a STARTTLS (587)
    const configs = [
      { host, port, secure: true, tls: { rejectUnauthorized: false } },
      { host, port: 587, secure: false, tls: { rejectUnauthorized: false } },
    ];

    let sent = false;
    let lastError = null;

    for (const cfg of configs) {
      try {
        const transporter = nodemailer.createTransport({
          ...cfg,
          auth: {
            user: Deno.env.get('SMTP_USER'),
            pass: Deno.env.get('SMTP_PASS'),
          },
        });
        await transporter.sendMail({
          from: Deno.env.get('SMTP_FROM') || 'coe-evolution@bitconsultingusa.net',
          to: email,
          subject: 'COE Evolution — Tu código de acceso',
          text: `Hola ${nombre},\n\nGracias por confirmar tu asistencia a COE Evolution 2026.\n\nAdjunto encontrarás tu código QR personal e intransferible.\n\nPreséntalo en la entrada del evento.\n\nCOE Evolution · 2026`,
          attachments: [{
            filename: 'COE_Evolution_QR.pdf',
            content: pdfBase64,
            encoding: 'base64',
          }],
        });
        sent = true;
        break;
      } catch (e) {
        lastError = e.message;
      }
    }

    if (!sent) {
      throw new Error(lastError || 'No se pudo enviar el correo');
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Email error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
