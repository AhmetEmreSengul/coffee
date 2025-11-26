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
  filteredCoffee: Coffee[];
  currentPage: number;
  coffeesPerPage: number;
  getCoffee: () => Promise<void>;
  getRandomThree: () => Coffee[];
  searchCoffee: (data: string) => void;
  setPage: (page: number) => void;
}

export const useCoffeeStore = create<CoffeeStore>((set, get) => ({
  isLoading: false,
  coffee: [],
  filteredCoffee: [],
  currentPage: 1,
  coffeesPerPage: 8,

  getCoffee: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get<Coffee[]>("/coffee.json");
      set({ coffee: response.data, filteredCoffee: response.data });
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

  searchCoffee: (data) => {
    const list = get().coffee;

    const filtered = list.filter(
      (item) =>
        item.title.toLowerCase().includes(data.toLowerCase()) ||
        item.type.toLowerCase().includes(data.toLowerCase())
    );

    set({ filteredCoffee: filtered });
  },

  setPage: (page) => set({ currentPage: page }),
}));
