# State Management with Zustand

Quick guide to adding global state to your HubLab app.

## Install
```bash
npm install zustand
```

## Usage
```typescript
// stores/cart-store.ts
import { create } from 'zustand';

interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));

// In your component
function Cart() {
  const { items, addItem, removeItem } = useCartStore();
  // ... use the state
}
```

**Time:** 10 minutes
