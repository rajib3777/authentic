import { useQuery } from '@tanstack/react-query'
import { PRODUCTS, CATEGORIES } from '../mockData'
import { Product } from '@/types'

// Mock API calls
const fetchProducts = async (): Promise<Product[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    return PRODUCTS
}

const fetchProductById = async (id: string): Promise<Product | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return PRODUCTS.find((p) => p.id === id)
}

const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return PRODUCTS.filter((p) => p.category === category)
}

const fetchCategories = async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return CATEGORIES
}

// Hooks
export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    })
}

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
    })
}

export const useProductsByCategory = (category: string) => {
    return useQuery({
        queryKey: ['products', category],
        queryFn: () => fetchProductsByCategory(category),
        enabled: !!category,
    })
}

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    })
}
