import { create } from 'zustand'

interface UIState {
    isCartDrawerOpen: boolean
    isFilterDrawerOpen: boolean
    isMobileMenuOpen: boolean
    setCartDrawerOpen: (open: boolean) => void
    setFilterDrawerOpen: (open: boolean) => void
    setMobileMenuOpen: (open: boolean) => void
    toggleCartDrawer: () => void
}

export const useUIStore = create<UIState>((set) => ({
    isCartDrawerOpen: false,
    isFilterDrawerOpen: false,
    isMobileMenuOpen: false,
    setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
    setFilterDrawerOpen: (open) => set({ isFilterDrawerOpen: open }),
    setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
}))
