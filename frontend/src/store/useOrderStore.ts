import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

interface Order {
  _id: string;
  user: string;
  description: string;
  orderNote: string;
  orderItems: OrderItem[];
  orderNumber: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderStore {
  pastOrders: Order[];
  lastOrder: Order | null;
  createOrder: (
    orderItems: OrderItem[],
    totalPrice: number,
    orderNote: string,
  ) => Promise<void>;
  getPastOrders: () => Promise<void>;
  getLastOrder: () => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  pastOrders: [],
  lastOrder: null,

  createOrder: async (orderItems, totalPrice, orderNote) => {
    try {
      await axiosInstance.post("/orders/create-order", {
        orderItems,
        totalPrice,
        orderNote,
      });
      toast.success("Order created");
    } catch (error: any) {
      console.error("Error creating order", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  },

  getPastOrders: async () => {
    try {
      const res = await axiosInstance.get<Order[]>("/orders/past-orders");
      set({ pastOrders: res.data });
    } catch (error: any) {
      console.error(
        "Error fetching past orders",
        error?.response?.data?.message,
      );
      toast.error(error?.response?.data?.message);
    }
  },

  getLastOrder: async () => {
    try {
      const res = await axiosInstance.get<Order>("/orders/last-order");
      set({ lastOrder: res.data });
    } catch (error: any) {
      console.error(
        "Error fetching last order",
        error?.response?.data?.message,
      );
      toast.error(error?.response?.data?.message);
    }
  },
}));
