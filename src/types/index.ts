export interface Product {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    category: string
    images: string[]
    rating: number
    reviewsCount: number
    stock?: number
    isFeatured?: boolean
    isNew?: boolean
    materials?: string[]
    dimensions?: string
    colors?: string[]
    tags?: string[]
}

export interface CartItem extends Product {
    quantity: number
    selectedVariant?: Record<string, string>
}

export interface User {
    id: string
    email: string
    name: string
    avatar?: string
}

export interface Order {
    id: string
    userId: string
    items: CartItem[]
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered'
    createdAt: string
    address: {
        street: string
        city: string
        state: string
        zip: string
        country: string
    }
}
