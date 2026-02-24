import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    signIn: (email: string, name: string) => void
    signOut: () => void
    updateProfile: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: {
                id: '1',
                email: 'john@example.com',
                name: 'John Doe',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            isAuthenticated: true,
            signIn: (email, name) => {
                set({
                    user: { id: Date.now().toString(), email, name },
                    isAuthenticated: true,
                })
            },
            signOut: () => set({ user: null, isAuthenticated: false }),
            updateProfile: (updates) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                }))
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)
