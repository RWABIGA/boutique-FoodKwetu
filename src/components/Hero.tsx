import Image from 'next/image'

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image — pic 1.jpg */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Produits frais d'Afrique de l'Est"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark gradient overlay from bottom + color treatment */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-900/50 to-forest-900/30" />
        {/* Subtle teal tint layer */}
        <div className="absolute inset-0 bg-river-500/10 mix-blend-multiply" />
      </div>

      {/* Radial glow accents */}
      <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full bg-river-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[-40px] w-64 h-64 rounded-full bg-mint-500/10 blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-8">
          <span className="text-pale-500 text-sm font-medium tracking-widest uppercase">
            🌍 Île-de-France &amp; Toute la France
          </span>
        </div>

        {/* Main heading */}
        <h1 className="font-karla font-bold text-5xl sm:text-6xl lg:text-8xl text-white leading-[0.95] tracking-[-0.04em] mb-5">
          FOOD{' '}
          <span className="relative text-river-300">
            KWETU
            <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-river-400/60 rounded-full" />
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-karla text-lg sm:text-2xl text-white/85 mb-3 font-medium tracking-wide">
          Produits authentiques d&apos;Afrique de l&apos;Est
        </p>
        <p className="text-white/65 text-sm sm:text-base mb-12 max-w-xl mx-auto leading-relaxed">
          Fruits, légumes, épices et spécialités livrés directement chez vous en moins de 4 jours
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#produits"
            className="inline-flex items-center gap-2 bg-river-500 hover:bg-river-400 text-white font-bold font-karla px-8 py-4 rounded-full text-base hover:scale-105 shadow-[0_4px_20px_rgba(103,184,188,0.35)] transition-transform duration-200"
          >
            Voir nos produits
            <span className="text-lg">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white/12 hover:bg-white/22 text-white border border-white/30 font-medium px-8 py-4 rounded-full text-base backdrop-blur-sm transition-colors duration-200"
          >
            Nous contacter
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {[
            { value: '25+', label: 'Produits' },
            { value: '< 4j', label: 'Livraison' },
            { value: '🇫🇷', label: 'Toute la France' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-karla font-bold text-2xl text-river-300">{stat.value}</div>
              <div className="text-white/55 text-xs mt-0.5 tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave — cream fill */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 27.5C840 35 960 40 1080 37.5C1200 35 1320 25 1380 20L1440 15V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="#F5F7F5"
          />
        </svg>
      </div>
    </section>
  )
}
