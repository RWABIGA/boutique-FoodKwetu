# Food Kwetu — Guide de mise en place

## Stack technique
- **Frontend + Backend** : Next.js 14 (App Router, TypeScript)
- **CSS** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL + Realtime)
- **État panier** : Zustand (persisté dans localStorage)
- **Email** : Nodemailer (Gmail SMTP)
- **Déploiement** : Vercel (recommandé)

---

## 1. Installation

```bash
# Clonez ou copiez le projet, puis :
cd foodkwetu
npm install
```

---

## 2. Supabase

### Créer un projet
1. Allez sur [supabase.com](https://supabase.com) → New project
2. Notez l'URL et les clés API (Settings → API)

### Créer la table
1. Dans votre projet Supabase → SQL Editor
2. Copiez-collez le contenu de `supabase/schema.sql`
3. Cliquez **Run**

---

## 3. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` avec vos vraies valeurs :

| Variable | Où la trouver |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `GMAIL_USER` | Votre adresse Gmail |
| `GMAIL_APP_PASSWORD` | Gmail → Mon compte → Sécurité → Mots de passe des applications |
| `ADMIN_EMAIL` | L'adresse qui reçoit les notifications de commandes |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Mot de passe de votre choix pour /admin |

---

## 4. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 5. Ajouter vos images

### Image hero
Ajoutez une belle photo dans `public/images/hero.jpg` (recommandé : 1920×1080px).
Puis dans `src/components/Hero.tsx`, remplacez le fond CSS par :
```tsx
<Image src="/images/hero.jpg" fill className="object-cover" alt="Food Kwetu" priority />
```

### Images produits
Ajoutez vos photos dans `public/images/products/[id-produit].jpg`
et référencez-les dans `src/data/products.ts` en ajoutant un champ `image`.

---

## 6. Déployer sur Vercel

```bash
npm install -g vercel
vercel
```

Puis dans Vercel → Settings → Environment Variables, ajoutez toutes les variables de `.env.local`.

**Important** : Le domaine de production doit être ajouté dans :
- Supabase → Authentication → URL Configuration → Site URL

---

## 7. Dashboard Admin

Accédez à `/admin` et entrez le mot de passe défini dans `NEXT_PUBLIC_ADMIN_PASSWORD`.

Fonctionnalités :
- Vue en temps réel de toutes les commandes
- Détails client et articles commandés
- Mise à jour du statut : En attente → Confirmée → Livrée / Annulée

---

## Structure des fichiers

```
foodkwetu/
├── public/
│   ├── logo.png              ← Logo FK
│   └── images/               ← Vos images produits/hero
├── src/
│   ├── app/
│   │   ├── layout.tsx        ← HTML wrapper + metadata SEO
│   │   ├── page.tsx          ← Page d'accueil
│   │   ├── api/orders/       ← API : enregistrement + email
│   │   └── admin/            ← Dashboard admin
│   ├── components/
│   │   ├── Navbar.tsx        ← Barre de nav + icône panier animée
│   │   ├── Hero.tsx          ← Section hero pleine largeur
│   │   ├── WelcomeSection.tsx← Message de bienvenue
│   │   ├── ProductSection.tsx← Grille produits + filtres + checkout
│   │   ├── ProductCard.tsx   ← Carte produit cliquable
│   │   ├── ProductModal.tsx  ← Modal sélection quantité
│   │   ├── CheckoutModal.tsx ← Panier + formulaire commande
│   │   └── ContactSection.tsx← Section contact + footer
│   ├── data/products.ts      ← Liste des 25 produits
│   ├── lib/supabase.ts       ← Client Supabase
│   ├── store/cartStore.ts    ← État panier (Zustand)
│   └── types/index.ts        ← Types TypeScript
└── supabase/schema.sql       ← À exécuter dans Supabase
```

---

## Numéros de contact (déjà intégrés)

- **+33 7 59 26 49 55**
- **+33 6 18 37 89 19**
- Instagram : **@foodk_wetu**