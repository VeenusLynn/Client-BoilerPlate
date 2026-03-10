import { create } from 'zustand'
import api from '@/services/api'

const useAuthStore = create((set) => ({
  user:  JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  register: async (data) => {
    const { user, token } = await api.post('/auth/register', data)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

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
