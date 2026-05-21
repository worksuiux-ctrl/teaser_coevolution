// ============================================
// Servidor local de desarrollo (OPCIONAL)
// ============================================
// Las páginas funcionan directamente con Supabase.
// Este servidor solo sirve archivos estáticos
// para pruebas locales.
// En producción: despliega los archivos de /public
// en Vercel, Netlify, o cualquier hosting estático.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

app.listen(PORT, () => {
  console.log(`Servidor local en http://localhost:${PORT}`);
});
