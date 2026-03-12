'use client'
import { useEffect, useState, useCallback } from 'react'
import { X, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types'
import { categoryColors } from '@/data/products'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [added,    setAdded]    = useState(false)

  useEffect(() => {
    if (product) {
      setQuantity(product.minQty)
      setAdded(false)
    }
  }, [product])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [product])

  if (!product) return null

  const bgGradient = categoryColors[product.category] ?? 'from-gray-100 to-gray-50'
  const isKg  = product.unit === 'kg'
  const total = product.price * quantity

  function decrease() {
    setQuantity((q) => Math.max(product!.minQty, parseFloat((q - product!.step).toFixed(2))))
  }
  function increase() {
    setQuantity((q) => parseFloat((q + product!.step).toFixed(2)))
  }
  function handleAdd() {
    if (!product) return
    onAddToCart(product, quantity)
    setAdded(true)
    setTimeout(() => onClose(), 800)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 bg-white rounded-3xl w-full max-w-md shadow-2xl animate-scale-in overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-forest-50 transition-colors duration-200 shadow"
          aria-label="Fermer"
        >
          <X size={18} className="text-forest-900" />
        </button>

        {/* Product visual header */}
        <div className={`bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center py-10 relative`}>
          <span className="absolute top-3 right-12 text-2xl">{product.origin}</span>
          <span className="text-7xl mb-2 select-none">{product.emoji}</span>
          <span className="text-xs font-bold bg-white/75 text-gray-600 px-3 py-1 rounded-full tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-karla font-bold text-xl text-forest-900 mb-1 tracking-tight">{product.name}</h2>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-karla font-bold text-2xl text-forest-900">
              {product.price.toFixed(2).replace('.', ',')}€
            </span>
            <span className="text-sm text-gray-400">/ {product.unitLabel}</span>
          </div>

          {/* Quantity selector */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-forest-900 mb-3 tracking-tight">
              Quantité — <span className="text-river-500">{product.unitLabel}</span>
              {isKg && <span className="text-xs text-gray-400 ml-1 font-normal">(min. {product.minQty} kg)</span>}
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={decrease}
                disabled={quantity <= product.minQty}
                className="w-10 h-10 rounded-full border-2 border-forest-100 flex items-center justify-center hover:border-river-400 hover:bg-river-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Minus size={16} className="text-forest-900" />
              </button>
              <div className="flex-1 text-center">
                <span className="font-karla font-bold text-2xl text-gray-900">
                  {isKg ? quantity.toFixed(1).replace('.', ',') : quantity}
                </span>
                <span className="text-sm text-gray-400 ml-1">{product.unit}</span>
              </div>
              <button
                onClick={increase}
                className="w-10 h-10 rounded-full border-2 border-forest-100 flex items-center justify-center hover:border-river-400 hover:bg-river-50 transition-colors duration-200"
              >
                <Plus size={16} className="text-forest-900" />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-forest-50 rounded-2xl p-4 mb-5 flex items-center justify-between border border-forest-100">
            <span className="text-sm font-bold text-forest-900">Total estimé</span>
            <span className="font-karla font-bold text-xl text-forest-900">
              {total.toFixed(2).replace('.', ',')} €
            </span>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full flex items-center justify-center gap-2 font-karla font-bold text-base py-4 rounded-2xl transition-colors duration-300 ${
              added
                ? 'bg-mint-500 text-white'
                : 'bg-forest-900 hover:bg-river-500 text-white'
            }`}
          >
            <ShoppingCart size={18} />
            {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  )
}
