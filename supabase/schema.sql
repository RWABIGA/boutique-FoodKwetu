-- ============================================================
-- FOOD KWETU — Schéma Supabase
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  customer_firstname  TEXT NOT NULL,
  customer_lastname   TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  customer_address    TEXT NOT NULL,
  items           JSONB NOT NULL DEFAULT '[]'::jsonb,
  total           NUMERIC(10, 2) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  notes           TEXT
);

-- ── Row Level Security (RLS) ──
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Permet à tout le monde d'insérer une commande (acheteurs publics)
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Permet à tout le monde de lire les commandes
-- (la page admin est protégée par mot de passe au niveau applicatif)
CREATE POLICY "Anon can read orders"
  ON orders FOR SELECT
  USING (true);

-- Permet les mises à jour de statut (admin)
CREATE POLICY "Anon can update order status"
  ON orders FOR UPDATE
  USING (true);

-- ── Realtime ──
-- Active les mises à jour temps réel pour le dashboard admin
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ── Index pour performance ──
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);