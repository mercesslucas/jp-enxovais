import { create } from 'zustand'

export interface ProductVariation {
  type?: 'color' | 'pattern'; // Switcher do painel admin
  color: string; // Nome da cor ou estampa
  colorCode?: string; // The hex value for the swatch (used if type='color')
  patternImage?: string; // Thumb-image URL for the swatch (used if type='pattern')
  image: string; // Imagem HD completa
}

export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  composition: string;
  variations: ProductVariation[];
  videoUrl?: string; // Optional URL to a short looping video
  stock?: number; // Optional reference for admin inventory
  price?: number; // Preço do produto
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  showSuccessNotification: boolean;
  isOrderSentOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openSuccessNotification: () => void;
  closeSuccessNotification: () => void;
  openOrderSent: () => void;
  closeOrderSent: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isCartOpen: false,
  showSuccessNotification: false,
  isOrderSentOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openSuccessNotification: () => set({ showSuccessNotification: true }),
  closeSuccessNotification: () => set({ showSuccessNotification: false }),
  openOrderSent: () => set({ isOrderSentOpen: true }),
  closeOrderSent: () => set({ isOrderSentOpen: false }),
  addItem: (item) => set((state) => {
    const existingIndex = state.items.findIndex(
      (i) => i.product.id === item.product.id && i.selectedColor === item.selectedColor
    );
    if (existingIndex !== -1) {
      const newItems = [...state.items];
      newItems[existingIndex].quantity += item.quantity;
      return { items: newItems };
    }
    return { items: [...state.items, item] };
  }),
  removeItem: (productId, color) => set((state) => ({
    items: state.items.filter((i) => !(i.product.id === productId && i.selectedColor === color))
  })),
  updateQuantity: (productId, color, quantity) => set((state) => ({
    items: state.items.map((i) => 
      (i.product.id === productId && i.selectedColor === color) 
        ? { ...i, quantity } 
        : i
    )
  })),
  clearCart: () => set({ items: [], isCartOpen: false }),
}));
