'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order, OrderStatus } from '@/types'
import { RefreshCw, LogOut, Package, CheckCircle, Truck, XCircle, Clock } from 'lucide-react'

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock size={12} />,
  },
  confirmed: {
    label: 'Confirmée',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle size={12} />,
  },
  delivered: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <Truck size={12} />,
  },
  cancelled: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle size={12} />,
  },
}

const ADMIN_PASSWORD_KEY = 'fk_admin_auth'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  // Check auth on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_PASSWORD_KEY)
    if (stored === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setAuthed(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, password)
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setOrders(data as Order[])
    setLoading(false)
  }, [])

  // Load orders + real-time subscription
  useEffect(() => {
    if (!authed) return
    fetchOrders()

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [authed, fetchOrders])

  async function updateStatus(orderId: string, status: OrderStatus) {
    setStatusUpdating(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setStatusUpdating(null)
  }

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gold-400" />
            </div>
            <h1 className="font-heading font-bold text-xl text-gray-900">
              FOOD <span className="text-gold-600">KWETU</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Dashboard Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 ${
                  pwError ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {pwError && <p className="text-red-500 text-xs mt-1">Mot de passe incorrect</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary-900 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-800 transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    revenue: orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((s, o) => s + o.total, 0),
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-primary-900 text-white px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <div>
          <h1 className="font-heading font-bold text-lg">
            FOOD <span className="text-gold-400">KWETU</span>
          </h1>
          <p className="text-white/50 text-xs">Dashboard commandes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => { sessionStorage.removeItem(ADMIN_PASSWORD_KEY); setAuthed(false) }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total commandes', value: stats.total, color: 'text-gray-900' },
            { label: 'En attente', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Confirmées', value: stats.confirmed, color: 'text-blue-600' },
            { label: 'CA total', value: `${stats.revenue.toFixed(2).replace('.', ',')} €`, color: 'text-primary-900' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`font-heading font-bold text-2xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-gray-900">
              Commandes{' '}
              {stats.pending > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.pending} nouvelle{stats.pending > 1 ? 's' : ''}
                </span>
              )}
            </h2>
            <span className="text-xs text-gray-400">Mis à jour en temps réel</span>
          </div>

          {loading ? (
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
              {orders.map((order) => {
                const cfg = statusConfig[order.status]
                const isExpanded = expandedId === order.id
                const date = order.created_at
                  ? new Date(order.created_at).toLocaleString('fr-FR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })
                  : '—'

                return (
                  <li key={order.id} className="hover:bg-gray-50 transition-colors">
                    <button
                      className="w-full text-left px-6 py-4"
                      onClick={() => setExpandedId(isExpanded ? null : (order.id ?? null))}
                    >
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
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-6 pb-5 pt-0 border-t border-gray-100 bg-gray-50 animate-fade-in">
                        <div className="grid sm:grid-cols-2 gap-6 mt-4">
                          {/* Client info */}
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Client</p>
                            <div className="space-y-1 text-sm">
                              <p className="font-medium text-gray-900">
                                {order.customer_firstname} {order.customer_lastname}
                              </p>
                              <p>
                                <a href={`tel:${order.customer_phone}`} className="text-primary-900 font-semibold">
                                  📞 {order.customer_phone}
                                </a>
                              </p>
                              <p className="text-gray-600">📍 {order.customer_address}</p>
                            </div>
                          </div>

                          {/* Items */}
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              Articles ({order.items?.length ?? 0})
                            </p>
                            <ul className="space-y-1">
                              {order.items?.map((item, idx) => (
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
                              <span className="text-primary-900">
                                {order.total.toFixed(2).replace('.', ',')} €
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status update buttons */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Mettre à jour le statut
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(statusConfig) as OrderStatus[]).map((s) => (
                              <button
                                key={s}
                                disabled={order.status === s || statusUpdating === order.id}
                                onClick={() => updateStatus(order.id!, s)}
                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                                  order.status === s
                                    ? statusConfig[s].color + ' opacity-100 shadow-sm'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                } disabled:cursor-not-allowed`}
                              >
                                {statusConfig[s].icon}
                                {statusConfig[s].label}
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
      </main>
    </div>
  )
}