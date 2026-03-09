/**
 * state/useAuthStore.js
 * Global auth state via Zustand.
 *
 * Usage:
 *   const { user, login, logout } = useAuthStore()
 */
import { create } from 'zustand'
import api from '@/services/api'

const useAuthStore = create((set) => ({
  user:  JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  login: async (credentials) => {
    const { user, token } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  setUser: (user) => set({ user }),
}))

export default useAuthStore
