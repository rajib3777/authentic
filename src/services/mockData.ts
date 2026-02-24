import { Product } from '@/types'

export const CATEGORIES = [
    'Sofa',
    'Chair',
    'Table',
    'Bed',
    'Lamp',
    'Storage',
    'Decor',
]

const TEMPLATE_PRODUCTS: Product[] = [
    {
        id: 'f1',
        name: 'Serene Cloud Sofa',
        category: 'Sofa',
        price: 320000,
        originalPrice: 380000,
        images: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80&w=800',
        ],
        description: 'A masterpiece of comfort and minimalism. The Serene Cloud Sofa features organic curves and a premium linen finish, ideal for modern living spaces.',
        materials: ['Linen', 'Oak Wood', 'High-Density Foam'],
        dimensions: '240cm x 100cm x 85cm',
        colors: ['Cream', 'Sand', 'Pearl'],
        tags: ['Best Seller', 'New Arrival'],
        rating: 4.9,
        reviewsCount: 124,
        isNew: true,
        isFeatured: true,
    },
    {
        id: 'f2',
        name: 'Vaulted Arch Lounge Chair',
        category: 'Chair',
        price: 145000,
        images: [
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800',
        ],
        description: 'Inspired by classical architecture, the Vaulted Arch Lounge Chair combines structural elegance with plush comfort.',
        materials: ['Boucle Fabric', 'Steel Frame'],
        dimensions: '85cm x 90cm x 75cm',
        colors: ['Off-white', 'Charcoal'],
        tags: ['Architectural'],
        rating: 4.8,
        reviewsCount: 86,
        isFeatured: true,
    },
    {
        id: 'f3',
        name: 'Floating Oak Dining Table',
        category: 'Table',
        price: 280000,
        images: [
            'https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800',
        ],
        description: 'Crafted from a single slab of seasoned oak, this dining table appears to float, bringing an airy feel to your dining area.',
        materials: ['Solid Oak', 'Tempered Glass'],
        dimensions: '200cm x 100cm x 75cm',
        colors: ['Natural Oak', 'Smoked Oak'],
        tags: ['Handcrafted'],
        rating: 4.7,
        reviewsCount: 42,
    },
]

export const PRODUCTS: Product[] = [...TEMPLATE_PRODUCTS]

// Furniture-specific image IDs from Unsplash (verified high resolutions)
const furnitureThumbs = [
    '1524758631624-e2822e304c36', // Sofa
    '1519710164239-da123dc03ef4', // Interior
    '1540518614846-7eded433c457', // Bed
    '1503602642458-232111445657', // Chair
    '1533090161767-e6ffed986c88', // Desk/Table
    '1513506003901-1e6a229e2d15', // Lamp
    '1586023492125-27b2c045efd7', // Shelves
    '1592078615290-033ee584e267', // Couch
    '1515562141207-7a88fb7ce338', // Light
    '1583847268964-b28cd8e5abd1'  // Minimal
]

// Generate 42 products (6 per category for symmetry)
CATEGORIES.forEach((cat, catIdx) => {
    for (let i = 1; i <= 6; i++) {
        const id = `${cat.toLowerCase()}-${i}`
        if (PRODUCTS.find(p => p.id === id)) return // Skip if already manually added

        const imgId = furnitureThumbs[(catIdx + i) % furnitureThumbs.length]
        PRODUCTS.push({
            id,
            name: `Authentic ${cat} ${i === 1 ? 'Prime' : i === 2 ? 'Select' : 'Signature ' + i}`,
            category: cat,
            price: (50 + Math.floor(Math.random() * 500)) * 1000, // Price in Taka
            images: [
                `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=800`,
                `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800`
            ],
            description: `Premium ${cat} from our signature series. Handcrafted for maximum aesthetic impact and functional longevity.`,
            materials: ['Genuine Leather', 'Premium Oak', 'Sustainable Fabric'],
            dimensions: 'Standard Luxury Dimensions',
            colors: ['Cream', 'Ebony', 'Walnut'],
            tags: i % 2 === 0 ? ['New Addition'] : [],
            rating: 4.5 + (Math.random() * 0.5),
            reviewsCount: Math.floor(Math.random() * 200),
            isNew: i === 1,
            isFeatured: i === 1 && catIdx === 0,
        })
    }
})
