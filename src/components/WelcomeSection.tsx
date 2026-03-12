export default function WelcomeSection() {
  return (
    <section className="py-16 px-4 bg-cream">
      <div className="max-w-3xl mx-auto">
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-river-300" />
          <span className="text-2xl select-none">🌿</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-river-300" />
        </div>

        {/* Welcome card — white surface, forest accents */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-forest-100"
          style={{ boxShadow: '0 2px 8px rgba(27,77,59,0.05), 0 12px 40px rgba(27,77,59,0.08)' }}>
          {/* Corner accent — top left */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-river-100 to-transparent rounded-tl-3xl rounded-br-full opacity-70 pointer-events-none" />
          {/* Corner accent — bottom right */}
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-forest-50 to-transparent rounded-br-3xl rounded-tl-full opacity-70 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-karla font-bold text-2xl sm:text-3xl text-forest-900 text-center mb-8 tracking-tight">
              Bienvenue chez{' '}
              <span className="text-river-500">Food Kwetu</span>
            </h2>

            <div className="space-y-5 text-gray-600 leading-[1.8] text-base sm:text-lg text-center italic font-light">
              <p>
                &ldquo;C&apos;est avec grande joie que nous sommes très heureux de vous présenter la boutique
                de vos produits exotiques en provenance de l&apos;Afrique de l&apos;Est.&rdquo;
              </p>
              <p>
                &ldquo;Plus besoin d&apos;attendre le voyage au pays pour retrouver le goût des aliments de chez vous.
                C&apos;est arrivé en Île-de-France et partout en France.&rdquo;
              </p>
              <p>
                &ldquo;Vous pouvez maintenant commander ici directement et le recevoir{' '}
                <strong className="text-forest-900 not-italic font-bold">en moins de 4 jours.</strong>&rdquo;
              </p>
              <p className="text-forest-900 font-bold not-italic text-base sm:text-lg tracking-wide">
                Que Dieu vous bénisse, vous garde et vous bénisse. 🙏
              </p>
            </div>

            {/* Signature */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-river-400" />
              <span className="font-karla font-bold text-forest-900 tracking-widest text-sm uppercase">
                FOOD <span className="text-river-500">KWETU</span>
              </span>
              <div className="h-px w-12 bg-river-400" />
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: '🌱', label: 'Produit frais' },
            { icon: '✅', label: 'Qualité garantie' },
            { icon: '🚚', label: 'Livraison rapide' },
          ].map((feat) => (
            <div
              key={feat.label}
              className="bg-white rounded-2xl p-4 text-center border border-forest-100 hover:border-river-300 transition-colors duration-200"
              style={{ boxShadow: '0 1px 4px rgba(27,77,59,0.06)' }}
            >
              <div className="text-2xl mb-1">{feat.icon}</div>
              <div className="text-xs sm:text-sm font-bold text-forest-900">{feat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
