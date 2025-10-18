import { create } from 'zustand'

interface User {
  id: number
  address: string
  username: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  isAdmin: () => boolean
  isLoggedIn: () => boolean
  logout: () => void
}

// Store Zustand
export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    const stored = sessionStorage.getItem('authUser')
    return stored ? JSON.parse(stored) : null
  })(),

  setUser: (user) => {
    if (user) sessionStorage.setItem('authUser', JSON.stringify(user))
    else sessionStorage.removeItem('authUser')
    set({ user })
  },

  isAdmin: () => get().user?.role === 'admin',

  isLoggedIn: () => !!get().user,

  logout: () => {
    sessionStorage.removeItem('authUser')
    set({ user: null })
  },
}))
