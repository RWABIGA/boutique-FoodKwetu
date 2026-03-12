export type ProductUnit = 'kg' | 'pièce' | 'carton' | 'sac' | 'bouteille' | 'lot'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  priceLabel: string
  unit: ProductUnit
  unitLabel: string
  origin: string // emoji flag
  emoji: string
  minQty: number
  step: number
  description?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

export interface Order {
  id?: string
  created_at?: string
  customer_firstname: string
  customer_lastname: string
  customer_phone: string
  customer_address: string
  items: CartItem[]
  total: number
  status: OrderStatus
  notes?: string
}