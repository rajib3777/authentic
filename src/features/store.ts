import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
    ids: string[];
    toggle: (id: string) => void;
    has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            ids: [],
            toggle: (id) => {
                const ids = get().ids;
                set({ ids: ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id] });
            },
            has: (id) => get().ids.includes(id),
        }),
        { name: 'authentic-wishlist' }
    )
);

// --- Auth Store ---
export interface Order {
    id: string;
    date: string;
    items: Array<{ name: string; qty: number; price: number; image: string }>;
    total: number;
    status: 'processing' | 'shipped' | 'delivered';
    address: string;
}

interface AuthStore {
    user: { name: string; email: string } | null;
    orders: Order[];
    login: (name: string, email: string) => void;
    register: (name: string, email: string) => void;
    logout: () => void;
    addOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            orders: [],
            login: (name, email) => set({ user: { name, email } }),
            register: (name, email) => set({ user: { name, email } }),
            logout: () => set({ user: null }),
            addOrder: (order) => set({ orders: [order, ...get().orders] }),
        }),
        { name: 'authentic-auth' }
    )
);

// --- Visualizer Store ---
export interface VisualizerProject {
    id: string;
    name: string;
    savedAt: string;
    canvasJSON: string;
    thumbnail?: string;
}

interface VisualizerStore {
    projects: VisualizerProject[];
    saveProject: (project: VisualizerProject) => void;
    deleteProject: (id: string) => void;
}

export const useVisualizerStore = create<VisualizerStore>()(
    persist(
        (set, get) => ({
            projects: [],
            saveProject: (project) => {
                const existing = get().projects.findIndex(p => p.id === project.id);
                if (existing >= 0) {
                    set({ projects: get().projects.map((p, i) => i === existing ? project : p) });
                } else {
                    set({ projects: [project, ...get().projects] });
                }
            },
            deleteProject: (id) => set({ projects: get().projects.filter(p => p.id !== id) }),
        }),
        { name: 'authentic-visualizer' }
    )
);
