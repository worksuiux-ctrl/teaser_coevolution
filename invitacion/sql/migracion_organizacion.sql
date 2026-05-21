-- ============================================
-- COE Evolution · Migración: columna organizacion
-- ============================================

ALTER TABLE invitados 
  ADD COLUMN IF NOT EXISTS organizacion TEXT DEFAULT '';
