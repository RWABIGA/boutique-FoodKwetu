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

-- ============================================================
-- Table des produits (gestion admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  price         NUMERIC(10, 2) NOT NULL,
  price_label   TEXT NOT NULL,
  unit          TEXT NOT NULL,
  unit_label    TEXT NOT NULL,
  origin        TEXT NOT NULL,
  emoji         TEXT NOT NULL,
  min_qty       NUMERIC NOT NULL DEFAULT 1,
  step          NUMERIC NOT NULL DEFAULT 1,
  description   TEXT,
  available     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Anon can update products"
  ON products FOR UPDATE USING (true);

CREATE POLICY "Anon can insert products"
  ON products FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can delete products"
  ON products FOR DELETE USING (true);

-- Insérer tous les produits existants
INSERT INTO products (id, name, category, price, price_label, unit, unit_label, origin, emoji, min_qty, step, description) VALUES
('patate-douces','Patate douces','Légumes & Tubercules',45.00,'45,00€ / carton (10kg)','carton','carton (10kg)','🇺🇬','🍠',1,1,'Patates douces fraîches de qualité supérieure, en carton de 10kg'),
('aubergine','Aubergine','Légumes & Tubercules',4.50,'4,50€ / kg','kg','kg','🇺🇬','🍆',0.5,0.5,'Aubergines fraîches d''Afrique de l''Est'),
('igname','Igname','Légumes & Tubercules',40.00,'40€ / carton (18kg) — 2,50€/kg','carton','carton (18kg)','🇬🇭','🥔',1,1,'Ignames authentiques en carton de 18kg'),
('manioc','Manioc','Légumes & Tubercules',2.70,'2,70€ / kg','kg','kg','🇬🇭','🌿',0.5,0.5,'Manioc frais, idéal pour vos plats traditionnels'),
('banane-verte','Banane verte','Fruits & Bananes',70.00,'70€ / carton (16kg)','carton','carton (16kg)','🇺🇬','🍌',1,1,'Bananes vertes fraîches en carton de 16kg'),
('petit-banane','Petit banane','Fruits & Bananes',35.00,'35€ / carton (8kg) — 5,30€/kg','carton','carton (8kg)','🇺🇬','🍌',1,1,'Petites bananes douces et savoureuses'),
('bananes-plantain','Bananes plantain','Fruits & Bananes',38.50,'38,50€ / carton (22kg) — 2,20€/kg','carton','carton (22kg)','🇨🇴','🍌',1,1,'Bananes plantain idéales pour alloco et autres plats'),
('mangue','Mangue','Fruits & Bananes',1.50,'1,50€ / pièce','pièce','pièce','🇧🇷','🥭',1,1,'Mangues fraîches et sucrées'),
('fruits-passion','Fruits de passion','Fruits & Bananes',8.50,'8,50€ / kg','kg','kg','🇷🇼','🟣',0.5,0.5,'Fruits de la passion du Rwanda, arôme intense'),
('attieke','Attiéké','Féculents',14.00,'14€ / sac (4kg)','sac','sac (4kg)','🇨🇮','🌾',1,1,'Attiéké de Côte d''Ivoire, couscous de manioc traditionnel'),
('fufu-rwanda','Fufu Rwanda (Cassava Flour)','Féculents',10.00,'10€ / carton (2kg)','carton','carton (2kg)','🇷🇼','🌾',1,1,'Farine de manioc pour préparer le fufu traditionnel rwandais'),
('mais-senegal','Maïs original Sénégal','Féculents',8.50,'8,50€ / lot de 5','lot','lot de 5','🇸🇳','🌽',1,1,'Maïs authentique du Sénégal, lot de 5 épis'),
('isombe-ku-munota','Isombe ku munota','Féculents',7.50,'7,50€ / pièce','pièce','pièce','🇷🇼','🌿',1,1,'Feuilles de manioc séchées, spécialité rwandaise'),
('akabanga','Akabanga','Épices & Condiments',3.50,'3,50€ / pièce (20ml)','pièce','flacon (20ml)','🇷🇼','🌶️',1,1,'Huile pimentée rwandaise ultra-forte, l''akabanga authentique'),
('pilau-masala','Pilau Masala','Épices & Condiments',6.50,'6,50€ / pièce','pièce','pièce','🇰🇪','🌶️',1,1,'Mélange d''épices kényan pour le riz pilau, parfum incomparable'),
('tea-masala','Tea Masala','Épices & Condiments',6.50,'6,50€ / pièce','pièce','pièce','🇰🇪','🧂',1,1,'Épices pour thé masala, mélange traditionnel kényan'),
('royco-boeuf','Royco Bœuf','Épices & Condiments',6.50,'6,50€ / pièce','pièce','pièce','🇰🇪','🧂',1,1,'Cube de bouillon Royco bœuf, condiment incontournable'),
('royco-poule','Royco Poule','Épices & Condiments',6.50,'6,50€ / pièce','pièce','pièce','🇰🇪','🧂',1,1,'Cube de bouillon Royco poulet, saveur authentique'),
('tea-bags-gold','Tea Bags Gold Blend','Thés & Boissons',6.00,'6,00€ / pièce','pièce','boîte','🇷🇼','🍵',1,1,'Thé noir Gold Blend du Rwanda, qualité premium'),
('tea-tangawizi','Tea Tangawizi','Thés & Boissons',6.00,'6,00€ / pièce','pièce','boîte','🇷🇼','🍵',1,1,'Thé au gingembre du Rwanda (tangawizi = gingembre)'),
('tea-bags-green','Tea Bags Green','Thés & Boissons',6.00,'6,00€ / pièce','pièce','boîte','🇷🇼','🍵',1,1,'Thé vert rwandais, doux et parfumé'),
('agashya','Agashya','Thés & Boissons',18.00,'18,00€ / bouteille','bouteille','bouteille','🇷🇼','🍾',1,1,'Jus d''hibiscus rwandais, riche en vitamines et antioxydants'),
('dry-pineapple','Dry Pineapple','Fruits secs',7.50,'7,50€ / sachet (500g)','pièce','sachet (500g)','🇷🇼','🍍',1,1,'Ananas séché du Rwanda, snack sain et délicieux'),
('petit-cola','Petit Cola','Divers',14.00,'14€ / kg','kg','kg','🇨🇮','🌰',0.5,0.5,'Noix de cola de Côte d''Ivoire, tradition africaine'),
('arrachide','Arrachide','Divers',8.00,'8,00€ / kg','kg','kg','🇺🇬','🥜',0.5,0.5,'Cacahuètes d''Ouganda, idéales pour les sauces et en-cas')
ON CONFLICT (id) DO NOTHING;