import axios from "axios";
import { create } from "zustand";

interface Coffee {
  id: number;
  title: string;
  type: string;
  image: string;
  description: string;
}

interface CoffeeStore {
  isLoading: boolean;
  coffee: Coffee[];
  getCoffee: () => Promise<void>;
  getRandomThree: () => Coffee[];
}

export const useCoffeeStore = create<CoffeeStore>((set, get) => ({
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

  getRandomThree: () => {
    const list = get().coffee;

    return [...list].sort(() => Math.random() - 0.5).slice(0, 3);
  },
}));
