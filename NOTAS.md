# COE Evolution 2026 — Notas del proyecto

## Estado actual (22 mayo 2026)

### ✅ Funcional
- **Invitación:** `invitacion/public/index.html` — formulario → QR (gris #444) → PDF descargable → envío por correo
- **Verificación:** `invitacion/public/verificar.html` — scanner + entrada manual de uid
- **Teaser:** `index.html` (raíz) — experiencia interactiva con selección de perfil y escenas animadas
- **SMTP:** Puerto 465 SSL, correos llegan (probado con Gmail)
- **CORS:** Edge Function responde OPTIONS + headers permitidos
- **QR:** Todos los módulos en gris (#444), escaneable

### 📧 Email (send-invite)
- Archivo: `supabase/functions/send-invite/index.ts`
- Estado: texto plano, falta agregar HTML con cronograma del evento
- Pendiente: Diseño de marketing para el email + cronograma Innovation / Evolution

### 📅 Evento
- **Tipo:** Presentación
- **Cronograma tentativo:**
  | Hora | Actividad |
  |------|-----------|
  | 8:00 | Recepción |
  | 8:30 | Presentación **Innovation** |
  | 9:30 | Desayuno (45 min) |
  | 10:15 | Presentación **Evolution** |
  | 11:15 | Cierre |
- **Datos exactos (fecha, lugar):** PENDIENTE de marketing

### 📄 Página de invitación
- Archivo: `invitacion/public/index.html`
- Pendiente: Agregar tarjeta con fecha/lugar/hora del evento

### 🎬 Teaser (index.html)
- 3 perfiles: manager, operator, tech
- Escenas animadas con beats, mockups, data-viz
- Videos: logo_idle.mp4, logo_neg.mp4, logo_pos.mp4
- Perfil técnico con sparklines, servicios, logs, métricas

### 🔧 Assets multimedia
- `assets/logo_idle.mp4` — logo animado reposo
- `assets/logo_neg.mp4` — logo "antes" (negativo)
- `assets/logo_pos.mp4` — logo "después" (positivo)
- `assets/Icono coe.png` — icono para invitación
- `assets/coe logo nuevo.png` — pendiente de uso

### 📁 Estructura
```
/
├── index.html                    # Teaser (landing)
├── assets/                       # Videos e imágenes
├── invitacion/
│   ├── public/
│   │   ├── index.html            # Formulario de invitación
│   │   └── verificar.html        # Escáner QR
│   └── email-service/            # Servicio de email (backup)
├── supabase/
│   ├── functions/
│   │   └── send-invite/index.ts  # Edge Function SMTP
│   └── config.toml
└── NOTAS.md
```

### 🚧 Pendientes
- [ ] Datos reales del evento (fecha, lugar)
- [ ] Tarjeta de evento en página de invitación
- [ ] Email HTML con diseño marketing + cronograma
- [ ] Ajustes finales al teaser
