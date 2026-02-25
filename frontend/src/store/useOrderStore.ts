import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export interface Order {
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
  isLoading: boolean;
  isDeleting: boolean;
  createOrder: (orderItems: OrderItem[], orderNote: string) => Promise<void>;
  getPastOrders: () => Promise<void>;
  getLastOrder: () => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  pastOrders: [],
  lastOrder: null,
  isLoading: false,
  isDeleting: false,

  createOrder: async (orderItems, orderNote) => {
    try {
      await axiosInstance.post("/orders/create-order", {
        orderItems,
        orderNote,
      });
      toast.success("Order created");
    } catch (error: any) {
      console.error("Error creating order", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },

  getPastOrders: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<Order[]>("/orders/past-orders");
      set({ pastOrders: res.data });
    } catch (error: any) {
      console.error(
        "Error fetching past orders",
        error?.response?.data?.message,
      );
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  getLastOrder: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<Order>("/orders/last-order");
      set({ lastOrder: res.data });
    } catch (error: any) {
      console.error(
        "Error fetching last order",
        error?.response?.data?.message,
      );
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteOrder: async (id) => {
    try {
      set({ isDeleting: true });
      await axiosInstance.delete(`/orders/delete-order/${id}`);
      toast.success("Order deleted.");
      await get().getPastOrders();
    } catch (error: any) {
      console.error("Error deleting order", error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isDeleting: false });
    }
  },
}));
