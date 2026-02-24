import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Order } from '@/types'

interface OrderState {
    orders: Order[]
    addOrder: (order: Order) => void
    getOrders: () => Order[]
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            addOrder: (order) => {
                set({ orders: [order, ...get().orders] })
            },
            getOrders: () => get().orders,
        }),
        {
            name: 'order-storage',
        }
    )
)
