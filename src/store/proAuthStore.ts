'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CompanyType =
  | 'restaurant'
  | 'epicerie'
  | 'boutique'
  | 'hotel'
  | 'traiteur'
  | 'supermarche'
  | 'autre'

export interface ProUser {
  id:          string
  firstName:   string
  lastName:    string
  company:     string
  companyType: CompanyType
  siret:       string
  address:     string
  city:        string
  postalCode:  string
  website:     string
  email:       string
  phone:       string
  createdAt:   string
}

export interface RegisterData {
  firstName:   string
  lastName:    string
  company:     string
  companyType: CompanyType
  siret:       string
  address:     string
  city:        string
  postalCode:  string
  website:     string
  email:       string
  phone:       string
  password:    string
}

interface ProAuthState {
  user:     ProUser | null
  accounts: Array<ProUser & { password: string }> // stored locally
  register: (data: RegisterData) => { success: boolean; error?: string }
  login:    (email: string, password: string) => { success: boolean; error?: string }
  logout:   () => void
}

export const useProAuthStore = create<ProAuthState>()(
  persist(
    (set, get) => ({
      user:     null,
      accounts: [],

      register: (data) => {
        const { accounts } = get()
        const already = accounts.find((a) => a.email.toLowerCase() === data.email.toLowerCase())
        if (already) {
          return { success: false, error: 'Cette adresse e-mail est déjà utilisée.' }
        }
        const newUser: ProUser & { password: string } = {
          id:          crypto.randomUUID(),
          firstName:   data.firstName,
          lastName:    data.lastName,
          company:     data.company,
          companyType: data.companyType,
          siret:       data.siret,
          address:     data.address,
          city:        data.city,
          postalCode:  data.postalCode,
          website:     data.website,
          email:       data.email,
          phone:       data.phone,
          password:    data.password,
          createdAt:   new Date().toISOString(),
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...publicProfile } = newUser
        set((s) => ({
          accounts: [...s.accounts, newUser],
          user:     publicProfile,
        }))
        return { success: true }
      },

      login: (email, password) => {
        const { accounts } = get()
        const found = accounts.find(
          (a) =>
            a.email.toLowerCase() === email.toLowerCase() &&
            a.password === password
        )
        if (!found) {
          return { success: false, error: 'E-mail ou mot de passe incorrect.' }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...publicProfile } = found
        set({ user: publicProfile })
        return { success: true }
      },

      logout: () => set({ user: null }),
    }),
    { name: 'foodkwetu-pro-auth' }
  )
)
