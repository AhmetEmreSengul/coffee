import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useBookingStore = create((set) => ({
  tables: [],
  myBookings: [],
  bookingQR: [],

  getTables: async () => {
    try {
      const res = await axiosInstance.get("/book/available-tables");
      set({ tables: res.data });
    } catch (error) {
      console.error("Error getting tables", error?.response?.data?.message);
      set({ tables: [] });
    }
  },

  createBooking: async (data) => {
    try {
      await axiosInstance.post("/book/createBooking", data);
      toast.success("Booking created");
    } catch (error) {
      console.error("Error creating booking", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  },

  getUserBookings: async () => {
    try {
      const res = await axiosInstance.get("/book/my-bookings");
      set({ myBookings: res.data });
    } catch (error) {
      console.error("Error fetching bookings");
      toast.error(error?.response?.data?.message);
      set({ myBookings: [] });
    }
  },

  getQRCode: async (id) => {
    try {
      const res = await axiosInstance.get(`/book/bookingQR/${id}`);

      set((state) => {
        const exists = state.bookingQR.some(
          (qr) => qr.booking._id === res.data.booking._id
        );
        if (exists) return state;

        return {
          bookingQR: [...state.bookingQR, res.data],
        };
      });
    } catch (error) {
      console.error("Error fetching QR", error);
      toast.error(error?.response?.data?.message);
    }
  },

  updateUserBooking: async (id, startTime, endTime) => {
    try {
      const res = await axiosInstance.put(`/book/updateBooking/${id}`, {
        bookingTime: {
          start: startTime,
          end: endTime,
        },
      });

      toast.success("Booking updated successfully");
    } catch (error) {
      console.error("Error updating booking", error);
      toast.error(error?.response?.data?.message || "Failed to update booking");
    }
  },
}));
