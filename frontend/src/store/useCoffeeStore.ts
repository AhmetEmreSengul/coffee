import axios from "axios";
import { create } from "zustand";

interface Coffee {
  id: number;
  title: string;
  type: string;
  image: string;
}

interface CoffeeStore {
  isLoading: boolean;
  coffee: Coffee[];
  getCoffee: () => Promise<void>;
}

export const useCoffeeStore = create<CoffeeStore>((set) => ({
  isLoading: true,
  coffee: [],

  getCoffee: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get<Coffee[]>("/coffee.json");
      set({ coffee: response.data });
    } catch (error) {
      console.error("Error fetching coffes for some reason??", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
