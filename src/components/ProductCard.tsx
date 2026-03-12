'use client'
import type { Product } from '@/types'
import { categoryColors } from '@/data/products'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const bgGradient = categoryColors[product.category] ?? 'from-gray-100 to-gray-50'

  return (
    <button
      onClick={() => onClick(product)}
      className="product-card w-full text-left bg-white rounded-2xl overflow-hidden border border-forest-100 flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-river-500"
      aria-label={`Voir ${product.name}`}
    >
      {/* Product visual */}
      <div className={`relative bg-gradient-to-br ${bgGradient} flex items-center justify-center h-28 sm:h-32`}>
        <span className="absolute top-2 right-2 text-lg" title="Origine">{product.origin}</span>
        <span className="absolute top-2 left-2 text-[10px] font-medium bg-white/75 text-gray-600 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        <span className="text-5xl sm:text-6xl select-none">{product.emoji}</span>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <h3 className="font-karla font-bold text-gray-900 text-sm sm:text-base leading-snug mb-1 group-hover:text-forest-900 transition-colors duration-200 tracking-tight">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 leading-snug mb-3 flex-1 line-clamp-2">
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
            <ShoppingBag size={12} />
            <span>Ajouter</span>
          </div>
        </div>
      </div>
    </button>
  )
}
