# Email Marketing — Guía de uso

## Envío manual

Con Node.js instalado:

```bash
node -e "
const nm=require('nodemailer');
const fs=require('fs');
const html=fs.readFileSync('email-marketing.html','utf-8');
const t=nm.createTransport({
  host:'mail.bitconsultingusa.net',port:465,secure:true,
  auth:{user:'coe-evolution@bitconsultingusa.net',pass:'Coevolution*'},
  tls:{rejectUnauthorized:false}
});
t.sendMail({
  from:'\"COE Evolution\" <coe-evolution@bitconsultingusa.net>',
  to:'correo@destino.com',
  subject:'COE Evolution 2026 — Invitacion',
  html
}).then(i=>console.log('OK:',i.messageId)).catch(e=>console.error('ERR:',e.message));
"
```

## Cómo modificar

Editar `email-marketing.html` y cambiar lo necesario:

- **Título / HERO**: línea 17 (`COE EVOLUTION`)
- **Texto del cuerpo**: líneas 26-30
- **Evento**: Lugar (39), Salon (44), Hora (49), Fecha (54)
- **Agenda**: líneas 65-101 (horas y actividades)
- **Link del botón**: línea 117 (`href="..."`)
- **Footer**: líneas 138-139

Luego ejecutar el comando de envío de arriba cambiando `to:` por el destinatario.

## Edge Function (correo automático)

El Edge Function `send-invite` envía el correo automático con QR cuando alguien se registra.

Para modificarlo: editar `supabase/functions/send-invite/index.ts`

Para desplegar:

```bash
supabase functions deploy send-invite --no-verify-jwt
```
