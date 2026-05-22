# CHANGELOG — Sesión 22 mayo 2026

## Problema: Bug GPU A17 Pro (iPhone 15 Pro)
Elementos duplicados y superpuestos en teaser al usar animaciones CSS en Safari iOS. Solo afecta GPU A17 Pro.

### Causa raíz
Compositing de múltiples capas GPU simultáneas:
- `translateZ(0)` / `translate3d(0,0,0)` forzados vía `@supports (-webkit-touch-callout: none)`
- `backface-visibility: hidden`
- `will-change` (removido antes)
- `transform` + `opacity` animándose juntos en ~40 elementos distintos
- El logo con `transform: rotate()` compitiendo contra todas las demás capas

### Solución aplicada

#### 1. Estrategia iOS: solo opacity, nada de transform
En iOS (clase `.ios`, detectado por user agent), todas las transiciones combinadas `opacity + transform` se redujeron a **solo opacity** con `linear` easing. Los elementos hacen fade en vez de slide/scale, manteniendo los staggers.

Se overridearon ~40 selectores incluyendo:
- Profile scene (logo-mark, hero-title, hero-year, headline, subhead, profile-options)
- Beat eyebrow, words, body
- Stages, frame-logo
- kpi-cell, net-card, system-cell, notif, item-row, log-line, metric-cell, service-row
- Final scene (final-mark, headline, sub, hint, CTA, replay)
- Pause hint
- Profile buttons (sin scale en active)

#### 2. Eliminado @supports con translateZ/backface-visibility
El bloque `@supports (-webkit-touch-callout: none)` creaba capas de composición artificiales con `translateZ(0)` y `backface-visibility: hidden` en scenes, beats, mock-frames y logos. **Esto empeoraba el bug.** Se eliminó por completo.

#### 3. iOS keyframes opacity-only
- `ping` → `iosPing` (solo opacity)
- `pingPulse` → `iosPingPulse` (solo opacity)
- `livePing` → `iosLivePing` (solo opacity)
- `.dim` → `animation: none` forzado en iOS
- `fillProgress` (scaleX) se conserva como la única animación con transform en iOS

#### 4. Logo rotate reactivado en iOS
Inicialmente desactivado (`animation: none`). Al ser ahora la única capa compuesta (sin otras animaciones transform compitiendo), se reactivó con `logoStep` 6s cubic-bezier.

#### 5. Fix a botones finales ocultos en iOS
Faltaban las reglas `.ios #scene-final.active .primary-cta` y `.ios #scene-final.active .replay-btn` con `opacity: 1 !important`, por lo que los botones quedaban invisible en iOS.

#### 6. hero-year sin animación
`.hero-year` no tenía `opacity: 0` ni `transition` en su CSS base, por lo que el stagger con `transition-delay` no funcionaba. Se agregaron.
