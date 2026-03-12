'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { products as hardcodedProducts } from '@/data/products'
import type { Order, OrderStatus } from '@/types'
import {
  RefreshCw, LogOut, Package, CheckCircle, Truck, XCircle, Clock,
  Users, ShoppingBag, Download, Edit2, Save, X, Eye, EyeOff, Upload,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = 'orders' | 'products' | 'clients' | 'export'

interface Product {
  id: string
  name: string
  category: string
  price: number
  price_label: string
  unit: string
  unit_label: string
  origin: string
  emoji: string
  min_qty: number
  step: number
  description: string
  available: boolean
}

interface Client {
  name: string
  phone: string
  address: string
  orderCount: number
  totalSpent: number
  lastOrder: string
}

// ── Status config ──────────────────────────────────────────────────────────
const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: 'En attente',  color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock size={12} /> },
  confirmed: { label: 'Confirmée',   color: 'bg-blue-100 text-blue-800 border-blue-200',       icon: <CheckCircle size={12} /> },
  delivered: { label: 'Livrée',      color: 'bg-green-100 text-green-800 border-green-200',    icon: <Truck size={12} /> },
  cancelled: { label: 'Annulée',     color: 'bg-red-100 text-red-800 border-red-200',          icon: <XCircle size={12} /> },
}

const ADMIN_PASSWORD_KEY = 'fk_admin_auth'

// ── Helpers ────────────────────────────────────────────────────────────────
function downloadCSV(filename: string, rows: string[][], headers: string[]) {
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ══════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [authed, setAuthed]   = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)
  const [tab, setTab]         = useState<Tab>('orders')

  // Orders
  const [orders, setOrders]   = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  // Products
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const [savingProduct, setSavingProduct] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // ── Auth ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_PASSWORD_KEY)
    if (stored === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setAuthed(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, password)
      setAuthed(true); setPwError(false)
    } else { setPwError(true) }
  }

  // ── Orders ──────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (!error && data) setOrders(data as Order[])
    setOrdersLoading(false)
  }, [])

  useEffect(() => {
    if (!authed) return
    fetchOrders()
    const channel = supabase.channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [authed, fetchOrders])

  async function updateStatus(orderId: string, status: OrderStatus) {
    setStatusUpdating(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setStatusUpdating(null)
  }

  // ── Products ────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('category')
    if (!error && data && data.length > 0) {
      setProducts(data as Product[])
    } else {
      // Fall back to hardcoded products if Supabase table is empty
      setProducts(hardcodedProducts.map(p => ({
        id: p.id, name: p.name, category: p.category,
        price: p.price, price_label: p.priceLabel,
        unit: p.unit, unit_label: p.unitLabel,
        origin: p.origin, emoji: p.emoji,
        min_qty: p.minQty, step: p.step,
        description: p.description ?? '',
        available: true,
      })))
    }
    setProductsLoading(false)
  }, [])

  async function syncToSupabase() {
    setSyncing(true)
    const rows = hardcodedProducts.map(p => ({
      id: p.id, name: p.name, category: p.category,
      price: p.price, price_label: p.priceLabel,
      unit: p.unit, unit_label: p.unitLabel,
      origin: p.origin, emoji: p.emoji,
      min_qty: p.minQty, step: p.step,
      description: p.description ?? '',
      available: true,
    }))
    await supabase.from('products').upsert(rows, { onConflict: 'id' })
    await fetchProducts()
    setSyncing(false)
  }

  useEffect(() => { if (authed) fetchProducts() }, [authed, fetchProducts])

  function startEdit(p: Product) { setEditingProduct(p); setEditForm({ ...p }) }
  function cancelEdit() { setEditingProduct(null); setEditForm({}) }

  async function saveProduct() {
    if (!editingProduct) return
    setSavingProduct(true)
    await supabase.from('products').update(editForm).eq('id', editingProduct.id)
    await fetchProducts()
    setSavingProduct(false)
    setEditingProduct(null)
  }

  async function toggleAvailable(p: Product) {
    await supabase.from('products').update({ available: !p.available }).eq('id', p.id)
    fetchProducts()
  }

  // ── Clients (derived from orders) ───────────────────────────────────────
  const clients: Client[] = Object.values(
    orders.reduce((acc, o) => {
      const key = o.customer_phone
      if (!acc[key]) {
        acc[key] = {
          name: `${o.customer_firstname} ${o.customer_lastname}`,
          phone: o.customer_phone,
          address: o.customer_address,
          orderCount: 0,
          totalSpent: 0,
          lastOrder: o.created_at ?? '',
        }
      }
      acc[key].orderCount++
      if (o.status !== 'cancelled') acc[key].totalSpent += o.total
      if ((o.created_at ?? '') > acc[key].lastOrder) acc[key].lastOrder = o.created_at ?? ''
      return acc
    }, {} as Record<string, Client>)
  ).sort((a, b) => b.totalSpent - a.totalSpent)

  // ── Stats ───────────────────────────────────────────────────────────────
  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    revenue:   orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
  }

  // ── Exports ─────────────────────────────────────────────────────────────
  function exportOrders() {
    const rows = orders.map(o => [
      o.id ?? '',
      o.created_at ? new Date(o.created_at).toLocaleString('fr-FR') : '',
      o.customer_firstname,
      o.customer_lastname,
      o.customer_phone,
      o.customer_address,
      o.status,
      String(o.total),
      (o.items ?? []).map((i: { product: { name: string }; quantity: number }) => `${i.product.name} x${i.quantity}`).join(' | '),
    ])
    downloadCSV('commandes_foodkwetu.csv', rows,
      ['ID', 'Date', 'Prénom', 'Nom', 'Téléphone', 'Adresse', 'Statut', 'Total (€)', 'Articles'])
  }

  function exportClients() {
    const rows = clients.map(c => [
      c.name, c.phone, c.address,
      String(c.orderCount), String(c.totalSpent.toFixed(2)),
      c.lastOrder ? new Date(c.lastOrder).toLocaleString('fr-FR') : '',
    ])
    downloadCSV('clients_foodkwetu.csv', rows,
      ['Nom', 'Téléphone', 'Adresse', 'Nb commandes', 'Total dépensé (€)', 'Dernière commande'])
  }

  function exportProducts() {
    const rows = products.map(p => [
      p.emoji, p.name, p.category, String(p.price), p.unit_label, p.origin, p.available ? 'Oui' : 'Non',
    ])
    downloadCSV('produits_foodkwetu.csv', rows,
      ['Emoji', 'Produit', 'Catégorie', 'Prix (€)', 'Unité', 'Origine', 'Disponible'])
  }

  // ── LOGIN ───────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gold-400" />
            </div>
            <h1 className="font-heading font-bold text-xl text-gray-900">FOOD <span className="text-gold-600">KWETU</span></h1>
            <p className="text-gray-500 text-sm mt-1">Dashboard Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 ${pwError ? 'border-red-400' : 'border-gray-200'}`}
              />
              {pwError && <p className="text-red-500 text-xs mt-1">Mot de passe incorrect</p>}
            </div>
            <button type="submit" className="w-full bg-primary-900 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-800 transition-colors">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'orders',   label: 'Commandes', icon: <ShoppingBag size={16} />, badge: stats.pending || undefined },
    { id: 'products', label: 'Produits',  icon: <Package size={16} /> },
    { id: 'clients',  label: 'Clients',   icon: <Users size={16} />, badge: clients.length || undefined },
    { id: 'export',   label: 'Export',    icon: <Download size={16} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-primary-900 text-white px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <div>
          <h1 className="font-heading font-bold text-lg">FOOD <span className="text-gold-400">KWETU</span></h1>
          <p className="text-white/50 text-xs">Dashboard Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchOrders} disabled={ordersLoading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors" title="Rafraîchir">
            <RefreshCw size={16} className={ordersLoading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => { sessionStorage.removeItem(ADMIN_PASSWORD_KEY); setAuthed(false) }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors" title="Déconnexion">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total commandes', value: stats.total,    color: 'text-gray-900' },
            { label: 'En attente',      value: stats.pending,  color: 'text-yellow-600' },
            { label: 'Clients',         value: clients.length, color: 'text-blue-600' },
            { label: 'CA total',        value: `${stats.revenue.toFixed(2).replace('.', ',')} €`, color: 'text-primary-900' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all relative ${
                tab === t.id ? 'bg-primary-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'
              }`}>
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
              {t.badge ? (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-gold-400 text-primary-900' : 'bg-yellow-100 text-yellow-700'}`}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-gray-900">
                Commandes{stats.pending > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {stats.pending} nouvelle{stats.pending > 1 ? 's' : ''}
                  </span>
                )}
              </h2>
              <span className="text-xs text-gray-400">Temps réel</span>
            </div>
            {ordersLoading ? (
              <div className="text-center py-16 text-gray-400">
                <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
                <p className="text-sm">Chargement...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Package size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune commande pour l&apos;instant</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {orders.map(order => {
                  const cfg = statusConfig[order.status]
                  const isExpanded = expandedId === order.id
                  const date = order.created_at
                    ? new Date(order.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—'
                  return (
                    <li key={order.id} className="hover:bg-gray-50 transition-colors">
                      <button className="w-full text-left px-6 py-4"
                        onClick={() => setExpandedId(isExpanded ? null : (order.id ?? null))}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {order.customer_firstname} {order.customer_lastname}
                            </p>
                            <p className="text-xs text-gray-500">{date}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-heading font-bold text-sm text-primary-900 whitespace-nowrap">
                              {order.total.toFixed(2).replace('.', ',')} €
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                              {cfg.icon} {cfg.label}
                            </span>
                          </div>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-5 pt-0 border-t border-gray-100 bg-gray-50">
                          <div className="grid sm:grid-cols-2 gap-6 mt-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Client</p>
                              <div className="space-y-1 text-sm">
                                <p className="font-medium text-gray-900">{order.customer_firstname} {order.customer_lastname}</p>
                                <p><a href={`tel:${order.customer_phone}`} className="text-primary-900 font-semibold">📞 {order.customer_phone}</a></p>
                                <p className="text-gray-600">📍 {order.customer_address}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Articles ({order.items?.length ?? 0})
                              </p>
                              <ul className="space-y-1">
                                {order.items?.map((item: { product: { emoji: string; name: string; price: number; unit: string }; quantity: number }, idx: number) => (
                                  <li key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-700">
                                      {item.product.emoji} {item.product.name}{' '}
                                      <span className="text-gray-400">× {item.quantity} {item.product.unit}</span>
                                    </span>
                                    <span className="font-medium text-gray-900 ml-2 whitespace-nowrap">
                                      {(item.product.price * item.quantity).toFixed(2).replace('.', ',')} €
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-semibold text-sm">
                                <span>Total</span>
                                <span className="text-primary-900">{order.total.toFixed(2).replace('.', ',')} €</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mettre à jour le statut</p>
                            <div className="flex flex-wrap gap-2">
                              {(Object.keys(statusConfig) as OrderStatus[]).map(s => (
                                <button key={s}
                                  disabled={order.status === s || statusUpdating === order.id}
                                  onClick={() => updateStatus(order.id!, s)}
                                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                                    order.status === s
                                      ? statusConfig[s].color + ' shadow-sm'
                                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                  } disabled:cursor-not-allowed`}>
                                  {statusConfig[s].icon} {statusConfig[s].label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-heading font-semibold text-gray-900">
                Produits <span className="text-gray-400 font-normal text-sm">({products.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={syncToSupabase} disabled={syncing}
                  className="flex items-center gap-1.5 bg-primary-900 text-white text-xs font-medium px-3 py-2 rounded-xl hover:bg-primary-800 transition-colors disabled:opacity-50">
                  <Upload size={13} /> {syncing ? 'Sync...' : 'Sync Supabase'}
                </button>
                <button onClick={fetchProducts} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <RefreshCw size={15} className={productsLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {productsLoading ? (
              <div className="text-center py-16 text-gray-400">
                <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
                <p className="text-sm">Chargement...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produit</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prix</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unité</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Origine</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p, i) => (
                      <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${!p.available ? 'opacity-40' : ''}`}>
                        {editingProduct?.id === p.id ? (
                          <td colSpan={8} className="px-4 py-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Nom</label>
                                  <input value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Prix (€)</label>
                                  <input type="number" step="0.01" value={editForm.price ?? ''} onChange={e => setEditForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Libellé prix</label>
                                  <input value={editForm.price_label ?? ''} onChange={e => setEditForm(f => ({ ...f, price_label: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">Catégorie</label>
                                  <input value={editForm.category ?? ''} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                                <input value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={saveProduct} disabled={savingProduct}
                                  className="flex items-center gap-1.5 bg-primary-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50">
                                  <Save size={14} /> {savingProduct ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                                <button onClick={cancelEdit}
                                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                  <X size={14} /> Annuler
                                </button>
                              </div>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{p.emoji}</span>
                                <span className="font-semibold text-gray-900">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                                {p.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-heading font-bold text-primary-900 whitespace-nowrap">
                              {Number(p.price).toFixed(2).replace('.', ',')} €
                            </td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.unit_label}</td>
                            <td className="px-4 py-3 text-lg">{p.origin}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${p.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {p.available ? '● Actif' : '○ Masqué'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleAvailable(p)} title={p.available ? 'Masquer' : 'Afficher'}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                                  {p.available ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button onClick={() => startEdit(p)} title="Modifier"
                                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── CLIENTS TAB ── */}
        {tab === 'clients' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-heading font-semibold text-gray-900">
                Clients <span className="text-gray-400 font-normal text-sm">({clients.length})</span>
              </h2>
            </div>
            {clients.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucun client pour l&apos;instant</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {clients.map((c, i) => (
                  <li key={c.phone} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-900 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                          <p className="text-xs text-gray-500">
                            <a href={`tel:${c.phone}`} className="text-primary-900 font-medium">📞 {c.phone}</a>
                            <span className="mx-1">·</span>
                            {c.address}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-heading font-bold text-primary-900 text-sm">
                          {c.totalSpent.toFixed(2).replace('.', ',')} €
                        </p>
                        <p className="text-xs text-gray-400">{c.orderCount} commande{c.orderCount > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ── EXPORT TAB ── */}
        {tab === 'export' && (
          <div className="space-y-4">
            {[
              {
                title: 'Commandes',
                description: `${orders.length} commandes · historique complet avec articles et statuts`,
                icon: <ShoppingBag size={22} className="text-primary-900" />,
                action: exportOrders,
                filename: 'commandes_foodkwetu.csv',
              },
              {
                title: 'Clients',
                description: `${clients.length} clients · noms, téléphones, adresses, total dépensé`,
                icon: <Users size={22} className="text-primary-900" />,
                action: exportClients,
                filename: 'clients_foodkwetu.csv',
              },
              {
                title: 'Produits',
                description: `${products.length} produits · prix, catégories, disponibilité`,
                icon: <Package size={22} className="text-primary-900" />,
                action: exportProducts,
                filename: 'produits_foodkwetu.csv',
              },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Format : {item.filename}</p>
                  </div>
                </div>
                <button onClick={item.action}
                  className="flex items-center gap-2 bg-primary-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-800 transition-colors flex-shrink-0">
                  <Download size={15} /> Télécharger
                </button>
              </div>
            ))}
            <p className="text-xs text-gray-400 text-center pt-2">
              Les fichiers CSV s&apos;ouvrent directement dans Excel ou Google Sheets
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
