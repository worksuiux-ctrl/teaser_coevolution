-- ============================================
-- COE Evolution · Migración: columnas de email
-- ============================================

ALTER TABLE invitados 
  ADD COLUMN IF NOT EXISTS email_enviado BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_enviado_en TIMESTAMPTZ;
