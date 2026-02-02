import { create } from "zustand";

export type User = {
  id: string;
  username: string;
  email: string;
  role?: "admin" | "user";
};

type AuthState = {
  user: User | null;

  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
