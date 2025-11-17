import { create } from "zustand";

interface AuthState {
  auth: {};
  isLoading: boolean;
  login: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  auth: { name: "test" },
  isLoading: false,

  login: () => {
    console.log("test");
    set({ isLoading: true });
  },
}));
