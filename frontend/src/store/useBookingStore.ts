import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useBookingStore = create((set) => ({
  tables: [],
  bookings: [],

  getTables: async () => {
    try {
      const res = await axiosInstance.get("/book/available-tables");
      set({ tables: res.data });
    } catch (error) {
      console.error("Error getting tables", error.message);
      set({ tables: [] });
    }
  },

  createBooking: async (data) => {
    try {
      const res = await axiosInstance.post("/book/createBooking", data);
      set({ tables: res.data });
      toast.success("Booking created");
    } catch (error) {
      console.error(`Error booking table`);
      toast.error("Error booking table", error.message);
      set({ tables: [] });
    } finally {
      set({ tables: [] });
    }
  },
}));
