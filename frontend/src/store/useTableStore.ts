import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: string;
}

interface TableBookings {
  bookingTime: {
    start: string;
    end: string;
  };
}

interface TableSlots {
  start: Date;
  end: Date;
}

interface TableStore {
  tables: Table[];
  tableSlots: TableSlots[];
  tableBookings: TableBookings[];
  isLoading: boolean;
  getTables: () => Promise<void>;
  getTableSlots: (id: string, date: Date) => Promise<void>;
  getTableBookings: (id: string) => Promise<void>;
}

export const useTableStore = create<TableStore>()((set) => ({
  tables: [],
  tableSlots: [],
  tableBookings: [],
  isLoading: false,

  getTables: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<Table[]>("/table/available-tables");
      set({ tables: res.data });
    } catch (error: any) {
      console.error("Error getting tables", error?.response?.data?.message);
      set({ tables: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getTableSlots: async (id, date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    try {
      const res = await axiosInstance.get(
        `/table/available-slots/${id}/?date=${formattedDate}`,
      );
      set({ tableSlots: Array.isArray(res.data) ? res.data : [] });
    } catch (error: any) {
      console.error("Error fetching table slots", error);
      toast.error(error?.response?.data?.message);
    }
  },

  getTableBookings: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/table/table-bookings/${id}`);
      set({ tableBookings: Array.isArray(res.data) ? res.data : [] });
    } catch (error: any) {
      console.error("Error fetching bookings for this table");
      toast.error(error?.response?.data?.message);
      set({ tableBookings: [] });
    }
  },
}));
