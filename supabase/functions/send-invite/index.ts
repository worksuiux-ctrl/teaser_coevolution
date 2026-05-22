import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import nodemailer from 'https://esm.sh/nodemailer@6.9.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

function htmlEmail(nombre: string): string {
  const details = [
    ['📍', 'Lugar', 'Hotel Londres, El Rosal, Chacao'],
    ['🔗', 'Referencia', 'Frente al C.C. Lido'],
    ['🏛', 'Salón', 'Crystal'],
    ['🕐', 'Hora', '8:00 am'],
    ['📅', 'Fecha', '02 de Junio del 2026'],
  ];
  const schedule = [
    ['8:00', 'Recepción', false],
    ['8:30', 'Presentación Innovation', true],
    ['9:15', 'Desayuno (45 min)', false],
    ['10:15', 'Presentación Evolution', true],
    ['11:15', 'Cierre', false],
  ];

  const detailsRows = details.map(([icon, label, value], i) =>
    `<tr><td style="padding:${i === 0 ? '0' : '8'}px 0;font-size:14px;border-top:${i === 0 ? '0' : '1'}px solid rgba(255,255,255,0.04)">
      <span style="margin-right:10px;font-size:15px">${icon}</span>
      <span style="color:rgba(245,245,247,0.35);margin-right:8px;font-size:13px">${label}</span>
      <span style="color:#f5f5f7;font-weight:500">${value}</span>
    </td></tr>`
  ).join('');

  const scheduleRows = schedule.map(([time, activity, highlight]) =>
    `<tr><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.03)">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="56" style="vertical-align:middle;padding:2px 0">
            <span style="display:inline-block;background:${highlight ? '#88C63A' : 'rgba(255,255,255,0.06)'};color:${highlight ? '#0c0c0e' : 'rgba(245,245,247,0.5)'};font-size:12px;font-weight:700;padding:3px 8px;border-radius:6px;letter-spacing:0.02em">${time}</span>
          </td>
          <td style="vertical-align:middle;padding:2px 0 2px 8px">
            <span style="color:${highlight ? '#9BCE6A' : '#f5f5f7'};font-size:14px;font-weight:${highlight ? '600' : '400'}">${activity}</span>
          </td>
        </tr>
      </table>
    </td></tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="es" style="background:#0c0c0e;margin:0;padding:0">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0c0c0e;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Inter',system-ui,sans-serif;color:#f5f5f7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0e;padding:32px 16px">
<tr><td align="center">

<table role="presentation" width="100%" style="max-width:560px;background:#18181b;border-radius:24px;padding:0;border:1px solid rgba(255,255,255,0.06)">

  <!-- HERO -->
  <tr><td style="padding:48px 32px 32px;text-align:center;background:linear-gradient(180deg,rgba(136,198,58,0.06) 0%,transparent 100%);border-radius:24px 24px 0 0">
    <div style="font-size:32px;font-weight:800;letter-spacing:-0.02em;color:#88C63A;line-height:1.1;text-shadow:0 0 60px rgba(136,198,58,0.12)">COE EVOLUTION</div>
    <div style="font-size:13px;color:rgba(245,245,247,0.25);letter-spacing:0.35em;margin-top:6px;font-weight:400">2026</div>
    <div style="width:48px;height:2px;background:linear-gradient(90deg,transparent,#88C63A,transparent);margin:20px auto 0;border-radius:1px"></div>
  </td></tr>

  <!-- BODY -->
  <tr><td style="padding:0 32px 32px">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding-bottom:4px;font-size:14px;color:rgba(245,245,247,0.45);font-weight:400">Hola,</td></tr>
      <tr><td style="padding-bottom:16px;font-size:22px;font-weight:700;color:#f5f5f7;letter-spacing:-0.01em">${nombre}</td></tr>
      <tr><td style="padding-bottom:28px;font-size:15px;line-height:1.6;color:rgba(245,245,247,0.65)">
        Gracias por confirmar tu asistencia.
        Adjunto encontrar&aacute;s tu c&oacute;digo QR personal e intransferible
        para ingresar al evento.
      </td></tr>
    </table>

    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin-bottom:28px"></div>

    <!-- EVENT DETAILS -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1f1f23;border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.06);margin-bottom:20px">
      <tr><td style="padding-bottom:16px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(245,245,247,0.3);font-weight:500">Detalles del Evento</td></tr>
      ${detailsRows}
    </table>

    <!-- SCHEDULE -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1f1f23;border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.06);margin-bottom:28px">
      <tr><td style="padding-bottom:16px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(245,245,247,0.3);font-weight:500">Cronograma</td></tr>
      ${scheduleRows}
    </table>

    <!-- QR NOTE -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(136,198,58,0.04);border-radius:12px;padding:16px 20px;border:1px solid rgba(136,198,58,0.1)">
      <tr><td style="font-size:13px;line-height:1.5;color:rgba(245,245,247,0.55)">
        <span style="color:#9BCE6A;font-weight:600">C&oacute;digo QR adjunto</span><br>
        El PDF con tu c&oacute;digo de acceso est&aacute; adjunto a este correo.
        Pres&eacute;ntalo en la entrada del evento. Es personal e intransferible.
      </td></tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:24px 32px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.04)">
    <div style="font-size:11px;color:rgba(245,245,247,0.2);letter-spacing:0.1em;font-weight:500">COE EVOLUTION · 2026</div>
    <div style="font-size:10px;color:rgba(245,245,247,0.12);margin-top:6px;letter-spacing:0.05em">Hotel Londres, El Rosal · Chacao</div>
  </td></tr>

</table>

</td></tr>
</table>
</body></html>`;
}

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

📅 Fecha: 02 de Junio del 2026
🕐 Hora: 8:00 am
📍 Lugar: Hotel Londres, El Rosal, Chacao
🏛 Salón: Crystal

Cronograma:
8:00  — Recepción
8:30  — Presentación Innovation
9:15  — Desayuno
10:15 — Presentación Evolution
11:15 — Cierre

COE Evolution · 2026`,
      html: htmlEmail(nombre),
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
