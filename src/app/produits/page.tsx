import Navbar from '@/components/Navbar'
import ProductSection from '@/components/ProductSection'
import ContactSection from '@/components/ContactSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produits — Food Kwetu',
  description: 'Découvrez tous nos produits exotiques d\'Afrique de l\'Est. Fruits, légumes, épices et spécialités livrés en France en moins de 4 jours.',
}

export default function ProduitsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Page header */}
        <div className="bg-forest-900 py-12 px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-river-300 text-xs font-bold uppercase tracking-widest">Notre catalogue</span>
          </div>
          <h1 className="font-karla font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Nos <span className="text-river-300">Produits</span>
          </h1>
          <p className="text-white/55 mt-3 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Produits frais d&apos;Afrique de l&apos;Est, livrés partout en France en moins de 4 jours.
          </p>
        </div>

        {/* Product catalogue — same component as home */}
        <ProductSection />

        {/* Contact at the bottom */}
        <ContactSection />
      </main>
    </>
  )
}
