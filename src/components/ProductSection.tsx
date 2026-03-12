'use client'
import { useState } from 'react'
import { ShoppingCart, SlidersHorizontal } from 'lucide-react'
import { products, categories, categoryIcons } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CheckoutModal from './CheckoutModal'
import type { Product } from '@/types'

export default function ProductSection() {
  const [activeCategory,  setActiveCategory]  = useState('Tous')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [checkoutOpen,    setCheckoutOpen]    = useState(false)

  const addItem    = useCartStore((s) => s.addItem)
  const items      = useCartStore((s) => s.items)
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = useCartStore((s) => s.totalPrice)

  const filtered =
    activeCategory === 'Tous'
      ? products
      : products.filter((p) => p.category === activeCategory)

  function handleAddToCart(product: Product, quantity: number) {
    addItem(product, quantity)
  }

  return (
    <section id="produits" className="py-16 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-river-600 bg-river-50 border border-river-200 px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            <SlidersHorizontal size={12} />
            Notre catalogue
          </div>
          <h2 className="font-karla font-bold text-3xl sm:text-4xl text-forest-900 tracking-tight">
            Nos <span className="text-river-500">Produits</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            {products.length} produits authentiques d&apos;Afrique de l&apos;Est
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-forest-900 text-white shadow-[0_2px_12px_rgba(27,77,59,0.25)]'
                  : 'bg-white text-gray-500 border border-forest-100 hover:border-river-300 hover:text-forest-900'
              }`}
            >
              {cat !== 'Tous' && <span>{categoryIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
            />
          ))}
        </div>

        {/* Checkout sticky bar */}
        {totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-forest-100 shadow-[0_-4px_20px_rgba(27,77,59,0.10)] sm:relative sm:mt-10 sm:border-none sm:shadow-none sm:bg-transparent sm:p-0">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full flex items-center justify-between bg-forest-900 hover:bg-river-500 text-white font-karla font-bold px-6 py-4 rounded-2xl transition-colors duration-200 shadow-[0_4px_20px_rgba(27,77,59,0.25)]"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-river-500 group-hover:bg-white text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                  <span>Voir mon panier</span>
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
        onAddToCart={handleAddToCart}
      />
      {checkoutOpen && (
        <CheckoutModal onClose={() => setCheckoutOpen(false)} />
      )}
    </section>
  )
}
