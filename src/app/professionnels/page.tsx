'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useProAuthStore, type RegisterData, type CompanyType } from '@/store/proAuthStore'
import { useCartStore } from '@/store/cartStore'
import { proProducts, proCategories } from '@/data/proProducts'
import ProductModal from '@/components/ProductModal'
import CheckoutModal from '@/components/CheckoutModal'
import type { Product } from '@/types'
import {
  Building2, ShoppingCart, LogOut, Eye, EyeOff, CheckCircle2,
  Package, TrendingDown, Phone, ChevronRight, SlidersHorizontal,
  User, Lock, Mail, MapPin, Globe, Briefcase,
} from 'lucide-react'

// ── Company type options ──────────────────────────────────────────────────────
const COMPANY_TYPES: { value: CompanyType; label: string; icon: string }[] = [
  { value: 'restaurant',   label: 'Restaurant',            icon: '🍽️' },
  { value: 'epicerie',     label: 'Épicerie / Magazin',    icon: '🛒' },
  { value: 'boutique',     label: 'Boutique',              icon: '🏪' },
  { value: 'hotel',        label: 'Hôtel',                 icon: '🏨' },
  { value: 'traiteur',     label: 'Traiteur',              icon: '👨‍🍳' },
  { value: 'supermarche',  label: 'Supermarché',           icon: '🏬' },
  { value: 'autre',        label: 'Autre activité',        icon: '💼' },
]

// ── Input component ───────────────────────────────────────────────────────────
function Field({
  label, icon, error, required, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon?: React.ReactNode
  error?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-forest-900 uppercase tracking-widest">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full border rounded-xl py-3 text-sm font-karla bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200 ${
            icon ? 'pl-9 pr-4' : 'px-4'
          } ${error ? 'border-red-300 bg-red-50' : 'border-forest-100 hover:border-river-300'}`}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Landing view (before auth) ────────────────────────────────────────────────
function LandingView({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Hero banner */}
      <div className="bg-forest-900 py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(103,184,188,0.15) 30px,rgba(103,184,188,0.15) 60px)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-river-500/20 border border-river-500/30 rounded-full px-4 py-1.5 mb-5">
            <Building2 size={14} className="text-river-300" />
            <span className="text-river-300 text-xs font-bold uppercase tracking-widest">Espace Professionnels</span>
          </div>
          <h1 className="font-karla font-bold text-4xl sm:text-5xl text-white tracking-tight mb-4">
            Commandez en gros,<br />
            <span className="text-river-300">au meilleur prix</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Accès réservé aux restaurants, épiceries, hôtels et professionnels de la restauration.
            Tarifs grossiste, livraison rapide partout en France.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRegister}
              className="inline-flex items-center gap-2 bg-river-500 hover:bg-river-400 text-white font-bold px-8 py-4 rounded-full text-base transition-colors duration-200 shadow-[0_4px_20px_rgba(103,184,188,0.35)]"
            >
              Créer un compte pro
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onLogin}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-8 py-4 rounded-full text-base transition-colors duration-200"
            >
              J&apos;ai déjà un compte
            </button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <TrendingDown size={24} className="text-river-500" />,
              title: 'Tarifs grossiste',
              desc: 'Jusqu\'à 20% de réduction sur le prix public. Plus vous commandez, moins vous payez.',
            },
            {
              icon: <Package size={24} className="text-river-500" />,
              title: 'Grands conditionnements',
              desc: 'Lots de cartons, boîtes professionnelles. Adapté aux volumes de votre activité.',
            },
            {
              icon: <Phone size={24} className="text-river-500" />,
              title: 'Suivi personnalisé',
              desc: 'Un interlocuteur dédié vous contacte après commande pour confirmer et livrer.',
            },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-6 border border-forest-100"
              style={{ boxShadow: '0 2px 12px rgba(27,77,59,0.06)' }}>
              <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center mb-4">
                {b.icon}
              </div>
              <h3 className="font-karla font-bold text-forest-900 mb-2 tracking-tight">{b.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginView({ onSwitch }: { onSwitch: () => void }) {
  const login = useProAuthStore((s) => s.login)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400)) // small UX delay
    const result = login(email, password)
    setLoading(false)
    if (!result.success) setError(result.error ?? 'Erreur de connexion')
  }

  return (
    <div className="min-h-screen bg-cream pt-16 flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link href="/professionnels" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-forest-900 mb-6 transition-colors duration-200">
          ← Espace Professionnels
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-forest-100"
          style={{ boxShadow: '0 4px 24px rgba(27,77,59,0.08)' }}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-forest-900" />
            </div>
            <h2 className="font-karla font-bold text-2xl text-forest-900 tracking-tight">Connexion Pro</h2>
            <p className="text-sm text-gray-400 mt-1">Accédez à votre espace professionnel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Adresse e-mail"
              type="email"
              placeholder="contact@maboite.fr"
              icon={<Mail size={15} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-forest-900 uppercase tracking-widest">
                Mot de passe <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-forest-100 hover:border-river-300 rounded-xl py-3 pl-9 pr-10 text-sm font-karla bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest-900 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-900 hover:bg-river-500 text-white font-bold py-4 rounded-2xl transition-colors duration-200 disabled:opacity-60 mt-2"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore de compte ?{' '}
            <button onClick={onSwitch} className="text-river-500 font-bold hover:underline">
              Créer un compte pro
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Register form ─────────────────────────────────────────────────────────────
function RegisterView({ onSwitch }: { onSwitch: () => void }) {
  const register = useProAuthStore((s) => s.register)
  const [form, setForm] = useState<RegisterData>({
    firstName:   '',
    lastName:    '',
    company:     '',
    companyType: 'restaurant',
    siret:       '',
    address:     '',
    city:        '',
    postalCode:  '',
    website:     '',
    email:       '',
    phone:       '',
    password:    '',
  })
  const [confirmPw,  setConfirmPw]  = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterData | 'confirmPw', string>>>({})

  function set(key: keyof RegisterData, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setFieldErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate() {
    const errs: typeof fieldErrors = {}
    if (!form.firstName.trim())   errs.firstName   = 'Requis'
    if (!form.lastName.trim())    errs.lastName    = 'Requis'
    if (!form.company.trim())     errs.company     = 'Requis'
    if (!form.address.trim())     errs.address     = 'Requis'
    if (!form.city.trim())        errs.city        = 'Requis'
    if (!form.postalCode.trim())  errs.postalCode  = 'Requis'
    if (!form.email.trim())       errs.email       = 'Requis'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'E-mail invalide'
    if (!form.phone.trim())       errs.phone       = 'Requis'
    if (form.password.length < 8) errs.password    = 'Minimum 8 caractères'
    if (form.password !== confirmPw) errs.confirmPw = 'Les mots de passe ne correspondent pas'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const result = register(form)
    setLoading(false)
    if (!result.success) setError(result.error ?? 'Erreur lors de la création du compte')
    // on success, the store sets user → parent re-renders to catalog
  }

  return (
    <div className="min-h-screen bg-cream pt-16 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/professionnels" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-forest-900 mb-6 transition-colors duration-200">
          ← Espace Professionnels
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-forest-100"
          style={{ boxShadow: '0 4px 24px rgba(27,77,59,0.08)' }}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 size={22} className="text-forest-900" />
            </div>
            <h2 className="font-karla font-bold text-2xl text-forest-900 tracking-tight">Créer un compte Pro</h2>
            <p className="text-sm text-gray-400 mt-1">Accès réservé aux professionnels</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Identité ── */}
            <div>
              <p className="text-xs font-bold text-river-500 uppercase tracking-widest mb-3">Identité</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Prénom" placeholder="Jean" icon={<User size={15} />}
                  value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
                  error={fieldErrors.firstName} required />
                <Field label="Nom" placeholder="Dupont" icon={<User size={15} />}
                  value={form.lastName} onChange={(e) => set('lastName', e.target.value)}
                  error={fieldErrors.lastName} required />
              </div>
            </div>

            {/* ── Entreprise ── */}
            <div>
              <p className="text-xs font-bold text-river-500 uppercase tracking-widest mb-3">Entreprise</p>
              <div className="space-y-4">
                <Field label="Nom de l'entreprise" placeholder="Chez Mama Restaurant"
                  icon={<Briefcase size={15} />}
                  value={form.company} onChange={(e) => set('company', e.target.value)}
                  error={fieldErrors.company} required />

                {/* Company type selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-forest-900 uppercase tracking-widest">
                    Type d&apos;activité <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMPANY_TYPES.map((ct) => (
                      <button
                        key={ct.value}
                        type="button"
                        onClick={() => set('companyType', ct.value)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          form.companyType === ct.value
                            ? 'border-river-500 bg-river-50 text-forest-900'
                            : 'border-forest-100 bg-white text-gray-500 hover:border-river-300'
                        }`}
                      >
                        <span>{ct.icon}</span>
                        <span className="text-xs">{ct.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="N° SIRET" placeholder="123 456 789 00012 (optionnel)"
                  icon={<Briefcase size={15} />}
                  value={form.siret} onChange={(e) => set('siret', e.target.value)} />

                <Field label="Site web" placeholder="https://www.maboite.fr" type="url"
                  icon={<Globe size={15} />}
                  value={form.website} onChange={(e) => set('website', e.target.value)} />
              </div>
            </div>

            {/* ── Adresse ── */}
            <div>
              <p className="text-xs font-bold text-river-500 uppercase tracking-widest mb-3">Adresse de livraison</p>
              <div className="space-y-4">
                <Field label="Adresse" placeholder="12 rue de la Paix"
                  icon={<MapPin size={15} />}
                  value={form.address} onChange={(e) => set('address', e.target.value)}
                  error={fieldErrors.address} required />
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Field label="Ville" placeholder="Paris"
                      value={form.city} onChange={(e) => set('city', e.target.value)}
                      error={fieldErrors.city} required />
                  </div>
                  <Field label="Code postal" placeholder="75001"
                    value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)}
                    error={fieldErrors.postalCode} required />
                </div>
              </div>
            </div>

            {/* ── Contact ── */}
            <div>
              <p className="text-xs font-bold text-river-500 uppercase tracking-widest mb-3">Contact</p>
              <div className="space-y-4">
                <Field label="E-mail professionnel" placeholder="contact@maboite.fr" type="email"
                  icon={<Mail size={15} />}
                  value={form.email} onChange={(e) => set('email', e.target.value)}
                  error={fieldErrors.email} required />
                <Field label="Téléphone" placeholder="+33 6 12 34 56 78" type="tel"
                  icon={<Phone size={15} />}
                  value={form.phone} onChange={(e) => set('phone', e.target.value)}
                  error={fieldErrors.phone} required />
              </div>
            </div>

            {/* ── Mot de passe ── */}
            <div>
              <p className="text-xs font-bold text-river-500 uppercase tracking-widest mb-3">Sécurité</p>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-forest-900 uppercase tracking-widest">
                    Mot de passe <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Minimum 8 caractères"
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      className={`w-full border rounded-xl py-3 pl-9 pr-10 text-sm font-karla bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-forest-100 hover:border-river-300'
                      }`}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest-900 transition-colors">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-forest-900 uppercase tracking-widest">
                    Confirmer le mot de passe <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Répétez le mot de passe"
                      value={confirmPw}
                      onChange={(e) => { setConfirmPw(e.target.value); setFieldErrors((err) => ({ ...err, confirmPw: '' })) }}
                      className={`w-full border rounded-xl py-3 pl-9 pr-4 text-sm font-karla bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-river-400 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.confirmPw ? 'border-red-300 bg-red-50' : 'border-forest-100 hover:border-river-300'
                      }`}
                    />
                  </div>
                  {fieldErrors.confirmPw && <p className="text-xs text-red-500">{fieldErrors.confirmPw}</p>}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-900 hover:bg-river-500 text-white font-bold py-4 rounded-2xl transition-colors duration-200 disabled:opacity-60 mt-2"
            >
              {loading ? 'Création en cours…' : 'Créer mon compte professionnel'}
            </button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              En créant votre compte, notre équipe pourra vérifier votre activité.
              Vous serez contacté par téléphone ou WhatsApp pour confirmer vos commandes.
            </p>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Déjà un compte ?{' '}
            <button onClick={onSwitch} className="text-river-500 font-bold hover:underline">
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Pro Catalog (authenticated view) ─────────────────────────────────────────
function ProCatalog() {
  const user   = useProAuthStore((s) => s.user)
  const logout = useProAuthStore((s) => s.logout)

  const [activeCategory,  setActiveCategory]  = useState('Tous')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [checkoutOpen,    setCheckoutOpen]    = useState(false)

  const addItem    = useCartStore((s) => s.addItem)
  const items      = useCartStore((s) => s.items)
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = useCartStore((s) => s.totalPrice)

  const filtered =
    activeCategory === 'Tous'
      ? proProducts
      : proProducts.filter((p) => p.category === activeCategory)

  const categoryIcon: Record<string, string> = {
    'Fruits & Bananes':       '🍌',
    'Légumes & Tubercules':   '🥬',
    'Épices & Condiments':    '🌶️',
  }

  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Header bar */}
      <div className="bg-forest-900 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-river-500/20 border border-river-500/30 rounded-full px-3 py-1 mb-2">
              <CheckCircle2 size={12} className="text-river-300" />
              <span className="text-river-300 text-xs font-bold uppercase tracking-widest">Compte Pro actif</span>
            </div>
            <h1 className="font-karla font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Bienvenue, {user?.firstName} 👋
            </h1>
            <p className="text-white/50 text-sm mt-0.5">{user?.company} · Tarifs grossiste</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors duration-200"
          >
            <LogOut size={15} />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Catalog */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Section header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-river-600 bg-river-50 border border-river-200 px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            <SlidersHorizontal size={12} />
            Catalogue Professionnels
          </div>
          <h2 className="font-karla font-bold text-2xl sm:text-3xl text-forest-900 tracking-tight">
            Produits en <span className="text-river-500">gros</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">{proProducts.length} références — prix réservés aux professionnels</p>
        </div>

        {/* Info banner */}
        <div className="bg-forest-50 border border-forest-100 rounded-2xl px-5 py-4 mb-8 flex items-start gap-3">
          <TrendingDown size={18} className="text-river-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-forest-900">
            <strong>Tarifs grossiste :</strong> nos prix pro sont entre 14% et 20% moins chers que le tarif public.
            Paiement à la réception ou par virement après confirmation téléphonique ou WhatsApp.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide snap-x">
          {proCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-forest-900 text-white shadow-[0_2px_12px_rgba(27,77,59,0.25)]'
                  : 'bg-white text-gray-500 border border-forest-100 hover:border-river-300 hover:text-forest-900'
              }`}
            >
              {cat !== 'Tous' && <span>{categoryIcon[cat] ?? ''}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="product-card w-full text-left bg-white rounded-2xl overflow-hidden border border-forest-100 flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-river-500"
            >
              {/* Visual */}
              <div className="relative bg-gradient-to-br from-forest-50 to-river-50 flex items-center justify-center h-32 sm:h-36">
                <span className="absolute top-2 right-2 text-base" title="Origine">{product.origin}</span>
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold bg-forest-900 text-white px-2 py-1 rounded-full uppercase tracking-wide">
                    Pro
                  </span>
                </div>
                <span className="text-6xl sm:text-7xl select-none">{product.emoji}</span>
              </div>
              {/* Body */}
              <div className="flex flex-col flex-1 p-4">
                <h3 className="font-karla font-bold text-forest-900 text-sm sm:text-base leading-snug mb-1 group-hover:text-river-500 transition-colors duration-200 tracking-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400 mb-3 flex-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <span className="font-karla font-bold text-forest-900 text-base sm:text-lg">
                      {product.price.toFixed(2).replace('.', ',')}€
                    </span>
                    <span className="block text-[11px] text-gray-400">/ {product.unitLabel}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-forest-900 group-hover:bg-river-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors duration-200">
                    <Package size={12} />
                    <span>Commander</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Checkout bar */}
        {totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-forest-100 shadow-[0_-4px_20px_rgba(27,77,59,0.10)] sm:relative sm:mt-10 sm:border-none sm:shadow-none sm:bg-transparent sm:p-0">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full flex items-center justify-between bg-forest-900 hover:bg-river-500 text-white font-karla font-bold px-6 py-4 rounded-2xl transition-colors duration-200 shadow-[0_4px_20px_rgba(27,77,59,0.25)]"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-river-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                  <span>Voir ma commande pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-karla font-bold text-lg">
                    {totalPrice().toFixed(2).replace('.', ',')} €
                  </span>
                  <ShoppingCart size={18} />
                </div>
              </button>
            </div>
          </div>
        )}
        {totalItems > 0 && <div className="h-20 sm:hidden" />}
      </div>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, q) => addItem(p, q)}
      />
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────
type View = 'landing' | 'login' | 'register'

export default function ProfessionnelsPage() {
  const user = useProAuthStore((s) => s.user)
  const [view, setView] = useState<View>('landing')

  // Hydration guard — proAuthStore reads localStorage
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  if (!hydrated) return null

  // If logged in, show the pro catalog
  if (user) {
    return (
      <>
        <Navbar />
        <ProCatalog />
      </>
    )
  }

  return (
    <>
      <Navbar />
      {view === 'landing' && (
        <LandingView
          onLogin={() => setView('login')}
          onRegister={() => setView('register')}
        />
      )}
      {view === 'login' && (
        <LoginView onSwitch={() => setView('register')} />
      )}
      {view === 'register' && (
        <RegisterView onSwitch={() => setView('login')} />
      )}
    </>
  )
}
