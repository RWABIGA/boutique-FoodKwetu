import type { Product } from '@/types'

// ── Professional / bulk products ─────────────────────────────────────────────
// Sold in large quantities at wholesale prices to restaurants, grocers, hotels…

export const proProducts: Product[] = [
  // ── Bananes ──────────────────────────────────────────────────────────────
  {
    id:          'pro-banane-verte-5',
    name:        'Banane verte — lot 5 cartons',
    category:    'Fruits & Bananes',
    price:       300.00,        // 60€/carton vs 70€ retail
    priceLabel:  '300€ / lot de 5 cartons (80kg) — 3,75€/kg',
    unit:        'lot',
    unitLabel:   'lot de 5 cartons (80kg)',
    origin:      '🇺🇬',
    emoji:       '🍌',
    minQty:      1,
    step:        1,
    description: 'Bananes vertes fraîches d\'Ouganda, conditionnement professionnel. 5 cartons de 16kg. Prix réservé aux professionnels.',
  },
  {
    id:          'pro-banane-plantain-5',
    name:        'Banane plantain — lot 5 cartons',
    category:    'Fruits & Bananes',
    price:       175.00,        // 35€/carton vs 38,50€ retail
    priceLabel:  '175€ / lot de 5 cartons (110kg) — 1,59€/kg',
    unit:        'lot',
    unitLabel:   'lot de 5 cartons (110kg)',
    origin:      '🇨🇴',
    emoji:       '🍌',
    minQty:      1,
    step:        1,
    description: 'Bananes plantain pour alloco et plats traiteur, lot professionnel de 5 cartons. Prix réservé aux professionnels.',
  },
  {
    id:          'pro-petit-banane-10',
    name:        'Petite banane — lot 10 cartons',
    category:    'Fruits & Bananes',
    price:       280.00,        // 28€/carton vs 35€ retail
    priceLabel:  '280€ / lot de 10 cartons (80kg) — 3,50€/kg',
    unit:        'lot',
    unitLabel:   'lot de 10 cartons (80kg)',
    origin:      '🇺🇬',
    emoji:       '🍌',
    minQty:      1,
    step:        1,
    description: 'Petites bananes douces, idéales en dessert ou buffet. Lot professionnel de 10 cartons de 8kg.',
  },

  // ── Patate douce ─────────────────────────────────────────────────────────
  {
    id:          'pro-patate-douce-5',
    name:        'Patate douce — lot 5 cartons',
    category:    'Légumes & Tubercules',
    price:       190.00,        // 38€/carton vs 45€ retail
    priceLabel:  '190€ / lot de 5 cartons (50kg) — 3,80€/kg',
    unit:        'lot',
    unitLabel:   'lot de 5 cartons (50kg)',
    origin:      '🇺🇬',
    emoji:       '🍠',
    minQty:      1,
    step:        1,
    description: 'Patates douces fraîches d\'Ouganda, conditionnement professionnel. 5 cartons de 10kg. Prix réservé aux professionnels.',
  },
  {
    id:          'pro-patate-douce-10',
    name:        'Patate douce — lot 10 cartons',
    category:    'Légumes & Tubercules',
    price:       350.00,        // 35€/carton
    priceLabel:  '350€ / lot de 10 cartons (100kg) — 3,50€/kg',
    unit:        'lot',
    unitLabel:   'lot de 10 cartons (100kg)',
    origin:      '🇺🇬',
    emoji:       '🍠',
    minQty:      1,
    step:        1,
    description: 'Commande palettisée de patate douce. 10 cartons de 10kg. Tarif grossiste réservé aux professionnels.',
  },

  // ── Akabanga ─────────────────────────────────────────────────────────────
  {
    id:          'pro-akabanga-24',
    name:        'Akabanga — boîte 24 flacons',
    category:    'Épices & Condiments',
    price:       72.00,         // 3,00€/flacon vs 3,50€ retail
    priceLabel:  '72€ / boîte de 24 flacons (20ml) — 3,00€/flacon',
    unit:        'lot',
    unitLabel:   'boîte de 24 flacons',
    origin:      '🇷🇼',
    emoji:       '🌶️',
    minQty:      1,
    step:        1,
    description: 'Huile pimentée rwandaise Akabanga en boîte de 24 flacons de 20ml. Idéal pour restaurants et épiceries. Remise professionnelle.',
  },
  {
    id:          'pro-akabanga-48',
    name:        'Akabanga — lot 2 boîtes (48 flacons)',
    category:    'Épices & Condiments',
    price:       134.40,        // 2,80€/flacon
    priceLabel:  '134,40€ / 48 flacons (20ml) — 2,80€/flacon',
    unit:        'lot',
    unitLabel:   '2 boîtes de 24 flacons',
    origin:      '🇷🇼',
    emoji:       '🌶️',
    minQty:      1,
    step:        1,
    description: 'Lot de 2 boîtes d\'Akabanga (48 flacons 20ml). Meilleur prix pour les revendeurs et grandes cuisines.',
  },
]

export const proCategories = ['Tous', 'Fruits & Bananes', 'Légumes & Tubercules', 'Épices & Condiments']
