'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface NavbarProps {
  onCartClick?: () => void
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const items        = useCartStore((s) => s.items)
  const animationTick = useCartStore((s) => s.animationTick)

  const [scrolled,       setScrolled]       = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [cartAnimating,  setCartAnimating]  = useState(false)
  const [showFloatPlus,  setShowFloatPlus]  = useState(false)

  const prevTick   = useRef(0)
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (animationTick > prevTick.current) {
      prevTick.current = animationTick
      setCartAnimating(true)
      setShowFloatPlus(true)
      const t1 = setTimeout(() => setCartAnimating(false), 500)
      const t2 = setTimeout(() => setShowFloatPlus(false), 700)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [animationTick])

  const navLinks = [
    { label: 'Accueil',        href: '/' },
    { label: 'Produits',       href: '/produits' },
    { label: 'Professionnels', href: '/professionnels' },
    { label: 'Contact',        href: '/#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_12px_rgba(27,77,59,0.12)]' : 'shadow-[0_1px_4px_rgba(27,77,59,0.06)]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="Food Kwetu Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="font-karla font-bold text-lg text-forest-900 tracking-tight">
                FOOD{' '}
                <span className="text-river-500">KWETU</span>
              </span>
              <p className="text-[10px] text-gray-400 hidden sm:block leading-none tracking-wide uppercase">
                Saveurs d&apos;Afrique de l&apos;Est
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-forest-900 transition-colors duration-200 relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[2px] after:bg-river-500 after:transition-all after:duration-200 hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Cart icon */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-forest-50 transition-colors duration-200"
              aria-label="Voir le panier"
            >
              <ShoppingCart
                size={22}
                className={`text-forest-900 ${cartAnimating ? 'animate-bounce-cart' : ''}`}
              />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-river-500 text-white text-[10px] font-bold flex items-center justify-center ${
                    cartAnimating ? 'badge-pulse' : ''
                  }`}
                >
                  {totalItems}
                </span>
              )}
              {showFloatPlus && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-river-500 animate-float-up pointer-events-none select-none">
                  +1
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-forest-50 transition-colors duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} className="text-forest-900" /> : <Menu size={20} className="text-forest-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-forest-100 animate-fade-in">
          <ul className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-forest-50 hover:text-forest-900 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
