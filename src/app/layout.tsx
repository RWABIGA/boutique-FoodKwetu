import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Food Kwetu — Produits exotiques d\'Afrique de l\'Est',
  description:
    'Boutique en ligne de produits alimentaires africains authentiques. Fruits, légumes, épices et spécialités d\'Afrique de l\'Est livrés en Île-de-France et partout en France en moins de 4 jours.',
  keywords: ['produits africains', 'épicerie africaine', 'Afrique de l\'Est', 'livraison France', 'food kwetu'],
  openGraph: {
    title: 'Food Kwetu',
    description: 'Produits exotiques d\'Afrique de l\'Est livrés chez vous en France',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}