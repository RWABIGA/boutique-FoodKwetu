import { Phone, MapPin, Instagram, Clock } from 'lucide-react'

export default function ContactSection() {
  return (
    <section id="contact" className="bg-forest-900 text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-river-300 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            📍 Nous contacter
          </div>
          <h2 className="font-karla font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Besoin d&apos;aide ?
          </h2>
          <p className="text-white/55 mt-2 text-sm sm:text-base">
            Notre équipe est disponible pour vous accompagner
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Phone 1 */}
          <a
            href="tel:+33759264955"
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-river-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Phone size={18} className="text-white" />
            </div>
            <p className="text-xs text-white/45 mb-1 uppercase tracking-wide">Téléphone 1</p>
            <p className="font-karla font-bold text-white">+33 7 59 26 49 55</p>
          </a>

          {/* Phone 2 */}
          <a
            href="tel:+33618378919"
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-river-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Phone size={18} className="text-white" />
            </div>
            <p className="text-xs text-white/45 mb-1 uppercase tracking-wide">Téléphone 2</p>
            <p className="font-karla font-bold text-white">+33 6 18 37 89 19</p>
          </a>

          {/* Location */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 bg-river-500 rounded-xl flex items-center justify-center mb-3">
              <MapPin size={18} className="text-white" />
            </div>
            <p className="text-xs text-white/45 mb-1 uppercase tracking-wide">Zone de livraison</p>
            <p className="font-karla font-bold text-white">Île-de-France</p>
            <p className="text-xs text-white/45 mt-0.5">et toute la France</p>
          </div>

          {/* Instagram */}
          <a
            href="https://instagram.com/foodk_wetu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Instagram size={18} className="text-white" />
            </div>
            <p className="text-xs text-white/45 mb-1 uppercase tracking-wide">Instagram</p>
            <p className="font-karla font-bold text-white">@foodk_wetu</p>
          </a>
        </div>

        {/* Delivery info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 bg-river-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Clock size={22} className="text-river-300" />
          </div>
          <div>
            <h3 className="font-karla font-bold text-white text-base mb-1 tracking-tight">
              Délai de livraison : moins de 4 jours
            </h3>
            <p className="text-white/55 text-sm leading-relaxed">
              Commandez ici et recevez vos produits exotiques africains directement chez vous.
              Après votre commande, notre équipe vous contacte par téléphone ou WhatsApp pour
              confirmer et organiser la livraison avec paiement à la réception ou par virement.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-karla font-bold text-white tracking-tight">
            FOOD <span className="text-river-300">KWETU</span>
            <span className="block text-white/35 text-xs font-normal tracking-wide">Produits authentiques d&apos;Afrique de l&apos;Est</span>
          </p>
          <p className="text-white/25 text-xs text-center sm:text-right">
            © {new Date().getFullYear()} Food Kwetu — Île-de-France, France
          </p>
        </div>
      </div>
    </section>
  )
}
