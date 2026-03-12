'use client'
import { useState } from 'react'
import { X, ShoppingBag, Trash2, CheckCircle, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface CheckoutModalProps {
  onClose: () => void
}

type Step = 'cart' | 'form' | 'success'

// WhatsApp number for Food Kwetu
const WHATSAPP_NUMBER = '33759264955'

function buildWhatsAppMessage(
  firstname: string,
  lastname: string,
  phone: string,
  address: string,
  items: ReturnType<typeof useCartStore.getState>['items'],
  total: number
): string {
  const lines = [
    '🛒 *Nouvelle commande — Food Kwetu*',
    '',
    `👤 *Client :* ${firstname} ${lastname}`,
    `📞 *Téléphone :* ${phone}`,
    `📍 *Adresse :* ${address}`,
    '',
    '*Produits commandés :*',
    ...items.map(
      (i) =>
        `• ${i.product.emoji} ${i.product.name} — ${i.quantity} ${i.product.unit} — ${(i.product.price * i.quantity).toFixed(2).replace('.', ',')}€`
    ),
    '',
    `💰 *Total : ${total.toFixed(2).replace('.', ',')}€*`,
  ]
  return encodeURIComponent(lines.join('\n'))
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const items      = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart  = useCartStore((s) => s.clearCart)
  const totalPrice = useCartStore((s) => s.totalPrice)

  const [step,    setStep]    = useState<Step>('cart')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstname: '',
    lastname:  '',
    phone:     '',
    address:   '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 500))

    // Build WhatsApp message and open it
    const msg = buildWhatsAppMessage(
      form.firstname, form.lastname, form.phone, form.address, items, totalPrice()
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')

    setStep('success')
    clearCart()
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-100">
          <h2 className="font-karla font-bold text-lg text-forest-900 tracking-tight">
            {step === 'cart'    && '🛒 Mon panier'}
            {step === 'form'    && '📋 Mes coordonnées'}
            {step === 'success' && '✅ Commande envoyée'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-forest-50 transition-colors duration-200">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── CART ── */}
          {step === 'cart' && (
            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">Votre panier est vide</p>
                  <button onClick={onClose} className="mt-4 text-river-500 font-bold text-sm underline underline-offset-2">
                    Voir nos produits
                  </button>
                </div>
              ) : (
                <>
                  <ul className="space-y-3 mb-6">
                    {items.map((item) => (
                      <li key={item.product.id} className="flex items-center gap-3 p-3 bg-forest-50 rounded-2xl">
                        <span className="text-3xl">{item.product.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-forest-900 truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-400">
                            {item.quantity} {item.product.unit} × {item.product.price.toFixed(2).replace('.', ',')}€
                          </p>
                        </div>
                        <span className="font-karla font-bold text-sm text-forest-900 whitespace-nowrap">
                          {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}€
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 flex items-center justify-between mb-4">
                    <span className="font-bold text-forest-900 text-sm">Total commande</span>
                    <span className="font-karla font-bold text-xl text-forest-900">
                      {totalPrice().toFixed(2).replace('.', ',')} €
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 text-center mb-4 leading-relaxed">
                    💬 Après votre commande, notre équipe vous contactera par WhatsApp ou téléphone pour confirmer et organiser le paiement.
                  </p>

                  <button
                    onClick={() => setStep('form')}
                    className="w-full bg-forest-900 hover:bg-river-500 text-white font-karla font-bold py-4 rounded-2xl transition-colors duration-200"
                  >
                    Continuer → Mes coordonnées
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── FORM ── */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-sm text-gray-400 mb-2 leading-relaxed">
                Votre commande de{' '}
                <strong className="text-forest-900">{totalPrice().toFixed(2).replace('.', ',')}€</strong>{' '}
                sera envoyée directement sur WhatsApp à notre équipe.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1 uppercase tracking-wide">Prénom *</label>
                  <input name="firstname" value={form.firstname} onChange={handleChange} required placeholder="Jean"
                    className="w-full border border-forest-100 hover:border-river-300 rounded-xl px-3 py-2.5 text-sm font-karla focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1 uppercase tracking-wide">Nom *</label>
                  <input name="lastname" value={form.lastname} onChange={handleChange} required placeholder="Dupont"
                    className="w-full border border-forest-100 hover:border-river-300 rounded-xl px-3 py-2.5 text-sm font-karla focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1 uppercase tracking-wide">Téléphone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required type="tel" placeholder="+33 6 XX XX XX XX"
                  className="w-full border border-forest-100 hover:border-river-300 rounded-xl px-3 py-2.5 text-sm font-karla focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1 uppercase tracking-wide">Adresse de livraison *</label>
                <textarea name="address" value={form.address} onChange={handleChange} required rows={3}
                  placeholder="12 rue de la Paix, 75001 Paris"
                  className="w-full border border-forest-100 hover:border-river-300 rounded-xl px-3 py-2.5 text-sm font-karla focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep('cart')}
                  className="flex-1 border border-forest-100 text-gray-600 font-bold py-3.5 rounded-2xl hover:bg-forest-50 transition-colors duration-200">
                  ← Retour
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white font-karla font-bold py-3.5 rounded-2xl transition-colors duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  {loading ? 'Envoi…' : 'Commander via WhatsApp'}
                </button>
              </div>
            </form>
          )}

          {/* ── SUCCESS ── */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-mint-500" />
              </div>
              <h3 className="font-karla font-bold text-xl text-forest-900 mb-2 tracking-tight">
                Commande envoyée !
              </h3>
              <p className="text-gray-500 text-sm mb-2 leading-relaxed">
                Merci <strong className="text-forest-900">{form.firstname}</strong>, votre commande a été transmise sur WhatsApp.
              </p>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Notre équipe vous contactera au{' '}
                <strong className="text-forest-900">{form.phone}</strong>{' '}
                pour confirmer et organiser la livraison. 🙏
              </p>
              <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 text-sm text-forest-900 mb-6">
                📞 Vous pouvez aussi nous appeler directement :<br />
                <strong>+33 7 59 26 49 55</strong> · <strong>+33 6 18 37 89 19</strong>
              </div>
              <button onClick={onClose}
                className="w-full bg-forest-900 hover:bg-river-500 text-white font-karla font-bold py-4 rounded-2xl transition-colors duration-200">
                Continuer les achats
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
