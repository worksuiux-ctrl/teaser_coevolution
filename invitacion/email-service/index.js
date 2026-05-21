// ============================================
// COE Evolution · Email Service
// ============================================
// Envía el PDF con el QR a los invitados registrados.
// Uso: node index.js
// 
// Requiere: npm install
// Config: .env (ver .env.example)
// ============================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL;

const FROM_NAME = process.env.FROM_NAME || 'COE Evolution';
const FROM_EMAIL = process.env.FROM_EMAIL;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---- Configurar transporter ----
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ---- Generar PDF con QR ----
async function generateQRPdf(nombre, uid) {
  const qrUrl = `${SITE_URL}/verificar.html?uid=${uid}`;
  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    width: 800,
    margin: 0,
    color: { dark: '#0c0c0e', light: '#ffffff' },
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [280, 420], // aprox. tarjeta
      margin: 0,
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Fondo oscuro
    doc.rect(0, 0, 280, 420).fill('#0c0c0e');

    // Título
    doc.fontSize(20).fillColor('#88C63A').text('COE', 140, 50, { align: 'center' });
    doc.fontSize(13).fillColor('#f5f5f7').text('Evolution', 140, 78, { align: 'center' });

    // Nombre del invitado
    doc.fontSize(11).fillColor('#ffffff').text(nombre, 140, 110, { align: 'center' });

    // Recuadro blanco + QR (centrado, 160x160)
    const qrSize = 160;
    const qrX = (280 - qrSize) / 2;
    const qrY = 135;
    doc.roundedRect(qrX, qrY, qrSize, qrSize, 12).fill('#ffffff');
    doc.image(qrBuffer, qrX + 8, qrY + 8, { width: qrSize - 16, height: qrSize - 16 });

    // Texto inferior
    doc.fontSize(8).fillColor('rgba(245,245,247,0.55)')
      .text('Código de acceso personal e intransferible', 140, 370, { align: 'center' });

    doc.fontSize(7).fillColor('#88C63A')
      .text('COE Evolution · 2026', 140, 395, { align: 'center' });

    doc.end();
  });
}

// ---- Enviar email ----
async function sendEmail(transporter, guest, pdfBuffer) {
  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background: #0c0c0e; color: #f5f5f7; padding: 32px; text-align: center;">
      <h1 style="color: #88C63A; font-size: 28px; margin-bottom: 4px;">COE Evolution</h1>
      <p style="color: #f5f5f7; font-size: 18px; margin-bottom: 24px;">Hola, <strong>${guest.nombre}</strong></p>
      <p style="color: rgba(245,245,247,0.7); font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Tu registro para <strong>COE Evolution</strong> está confirmado.<br>
        Adjuntamos tu código de acceso personal e intransferible.
      </p>
      <p style="color: rgba(245,245,247,0.5); font-size: 12px; margin-top: 32px;">
        Preséntalo en la entrada del evento.<br>
        — COE Evolution · 2026
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: guest.correo,
    subject: 'COE Evolution · Tu código de acceso',
    html,
    attachments: [{
      filename: `COE_Evolution_QR_${guest.uid}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }],
  });
}

// ---- Marcar email como enviado ----
async function markEmailSent(uid) {
  await supabase
    .from('invitados')
    .update({ email_enviado: true, email_enviado_en: new Date().toISOString() })
    .eq('uid', uid);
}

// ---- Procesar invitados pendientes ----
async function processPending() {
  const transporter = createTransporter();

  const { data: guests, error } = await supabase
    .from('invitados')
    .select('*')
    .eq('email_enviado', false)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error al consultar invitados:', error.message);
    return;
  }

  if (!guests || guests.length === 0) {
    console.log('No hay invitados pendientes de email.');
    return;
  }

  console.log(`Procesando ${guests.length} invitado(s)...`);

  for (const guest of guests) {
    try {
      console.log(`  → ${guest.nombre} (${guest.correo})`);
      const pdf = await generateQRPdf(guest.nombre, guest.uid);
      await sendEmail(transporter, guest, pdf);
      await markEmailSent(guest.uid);
      console.log(`  ✅ Email enviado`);
    } catch (err) {
      console.error(`  ❌ Error con ${guest.nombre}:`, err.message);
    }
  }
}

// ---- Ejecutar ----
processPending().then(() => {
  console.log('Proceso completado.');
});
