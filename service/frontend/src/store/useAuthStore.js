import { create } from 'zustand'

const useAuthStore = create((set) => {
  const storedToken = localStorage.getItem('access_token')

  return {
    user: null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,

    setUser: (user) => set({ user }),

    setToken: (token) => {
      localStorage.setItem('access_token', token)
      set({ token, isAuthenticated: true })
    },

    login: (user, token) => {
      localStorage.setItem('access_token', token)
      set({ user, token, isAuthenticated: true })
    },

    logout: () => {
      localStorage.clear()
      set({ user: null, token: null, isAuthenticated: false })
    },
  }
})

export default useAuthStore