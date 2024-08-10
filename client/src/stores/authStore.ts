import api from "@/helpers/api";
import { create } from "zustand";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (username, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/login", { username, password });
      if (response.data.success) {
        const res = await api.get("/getUser");
        set({ user: res.data, loading: false, error: null });
      } else {
        set({ user: null, loading: false, error: response.data.message });
      }
    } catch (error) {
      console.error(error);
      set({
        user: null,
        loading: false,
        error: "An error occurred during login",
      });
    }
  },
  register: async (email, username, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/register", {
        email,
        username,
        password,
      });
      if (response.data.success) {
        await useAuthStore.getState().login(username, password);
      } else {
        set({ user: null, loading: false, error: response.data.message });
      }
    } catch (error) {
      console.error(error);
      set({
        user: null,
        loading: false,
        error: "An error occurred during registration",
      });
    }
  },
  logout: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/logout");
      if (response.data.success) {
        set({ user: null, loading: false, error: null });
      } else {
        set({ user: null, loading: false, error: response.data.message });
      }
    } catch (error) {
      console.error(error);
    }
  },
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/getUser");
      set({ user: res.data });
      set({ loading: false });
    } catch {
      set({ user: null });
    }
  },
}));
