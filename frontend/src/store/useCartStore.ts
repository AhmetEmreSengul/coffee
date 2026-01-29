import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Coffee {
  _id: string;
  title: string;
  type: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Coffee {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (coffee: Coffee) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
}
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (coffee) => {
        const cart = get().cart;
        const existing = cart.find((item) => item._id === coffee._id);

        if (existing) {
          set({
            cart: cart.map((item) =>
              item._id === coffee._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({
            cart: [...cart, { ...coffee, quantity: 1 }],
          });
        }
      },

      removeFromCart: (_id) =>
        set({
          cart: get().cart.filter((item) => item._id !== _id),
        }),

      increaseQty: (_id) => {
        const cart = get().cart;
        const existing = cart.find((item) => item._id === _id);
        if (existing && existing.quantity < 10) {
          set({
            cart: cart.map((item) =>
              item._id === _id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        }
      },
      

      decreaseQty: (_id) =>
        set({
          cart: get()
            .cart.map((item) =>
              item._id === _id
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "coffee-cart",
      version: 1,
    },
  ),
);
