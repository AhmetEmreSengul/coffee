import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: string;
}

interface UserBooking {
  _id: string;
  bookingTime: {
    start: string;
    end: string;
  };
  tableNumber: {
    _id: string;
    number: number;
    capacity: number;
  };
}

interface BookingQR {
  qrCode: string;
  booking: UserBooking;
}

interface CreateBookingData {
  tableNumber: string;
  bookingTime: {
    start: string;
    end: string;
  };
}

interface TableBookings {
  bookingTime: {
    start: string;
    end: string;
  };
}

interface BookingStore {
  tables: Table[];
  myBookings: UserBooking[];
  tableBookings: TableBookings[];
  bookingQR: BookingQR[];
  isLoading: boolean;

  getTables: () => Promise<void>;
  createBooking: (data: CreateBookingData) => Promise<void>;
  getUserBookings: () => Promise<void>;
  getQRCode: (id: string) => Promise<void>;
  updateUserBooking: (
    id: string,
    startTime: string,
    endTime: string
  ) => Promise<void>;
  getTableBookings: (id: string) => Promise<void>;
  deleteUserBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set) => ({
  tables: [],
  myBookings: [],
  bookingQR: [],
  tableBookings: [],
  isLoading: false,

  getTables: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<Table[]>("/book/available-tables");
      set({ tables: res.data });
    } catch (error: any) {
      console.error("Error getting tables", error?.response?.data?.message);
      set({ tables: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createBooking: async (data) => {
    try {
      await axiosInstance.post("/book/createBooking", data);
      toast.success("Booking created");
    } catch (error: any) {
      console.error("Error creating booking", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  },

  getUserBookings: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<UserBooking[]>("/book/my-bookings");
      set({ myBookings: res.data });
    } catch (error: any) {
      console.error("Error fetching bookings");
      toast.error(error?.response?.data?.message);
      set({ myBookings: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getQRCode: async (id: string) => {
    try {
      const res = await axiosInstance.get<BookingQR>(`/book/bookingQR/${id}`);

      set((state) => {
        const exists = state.bookingQR.some(
          (qr) => qr.booking._id === res.data.booking._id
        );
        if (exists) return state;

        return { bookingQR: [...state.bookingQR, res.data] };
      });
    } catch (error: any) {
      console.error("Error fetching QR", error);
      toast.error(error?.response?.data?.message);
    }
  },

  updateUserBooking: async (id, startTime, endTime) => {
    try {
      await axiosInstance.put(`/book/updateBooking/${id}`, {
        bookingTime: { start: startTime, end: endTime },
      });

      toast.success("Booking updated successfully");
    } catch (error: any) {
      console.error("Error updating booking", error);
      toast.error(error?.response?.data?.message || "Failed to update booking");
    }
  },

  getTableBookings: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/book/table-bookings/${id}`);
      set({ tableBookings: Array.isArray(res.data) ? res.data : [] });
    } catch (error: any) {
      console.error("Error fetching bookings for this table");
      toast.error(error?.response?.data?.message);
      set({ tableBookings: [] });
    }
  },

  deleteUserBooking: async (id) => {
    try {
      await axiosInstance.delete(`/book/cancelBooking/${id}`);
      toast.success("Cancelled booking");
    } catch (error: any) {
      console.error("Error deleting booking");
      toast.error(error?.response?.data?.message || "Failed to delete booking");
    }
  },
}));
