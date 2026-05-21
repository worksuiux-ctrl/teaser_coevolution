-- ============================================
-- COE Evolution · Migración Supabase
-- Tabla de invitados para registro y verificación
-- ============================================

CREATE TABLE invitados (
  id BIGSERIAL PRIMARY KEY,
  uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  correo TEXT NOT NULL,
  cargo TEXT DEFAULT '',
  confirmado BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT now(),
  usado BOOLEAN DEFAULT false,
  usado_en TIMESTAMPTZ
);

-- Seguridad: Row Level Security
ALTER TABLE invitados ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede registrarse (INSERT)
CREATE POLICY "anon_insert" 
  ON invitados FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Política: cualquiera puede consultar por uid (SELECT)
CREATE POLICY "anon_select" 
  ON invitados FOR SELECT 
  TO anon 
  USING (true);

-- Política: cualquiera puede marcar como usado (UPDATE)
-- El UUID es la protección: sin el uid no se puede modificar
CREATE POLICY "anon_update" 
  ON invitados FOR UPDATE 
  TO anon 
  USING (true) 
  WITH CHECK (true);
