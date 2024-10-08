import api from "@/helpers/api";
import { Campground } from "@/interfaces/types";
import { create } from "zustand";

interface AuthState {
  user: any;
  loading: boolean;
  favorites: Campground[];
  myCampgrounds: Campground[];
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getAllFavorites: () => Promise<void>;
  addFavoriteCampground: (campgroundId: string) => Promise<void>;
  getMyCampgrounds: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  favorites: [],
  myCampgrounds: [],
  error: null,
  login: async (username, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/login", { username, password });
      if (response.data.success) {
        await useAuthStore.getState().checkAuth();
      } else {
        set({ user: null, loading: false, error: response.data.message });
      }
    } catch (error) {
      console.error(error);
      set({
        user: null,
        loading: false,
        error: "Wrong username or password",
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
  getAllFavorites: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/getAllFavorites");
      set({ favorites: res.data.favorites, loading: false, error: null });
    } catch {
      set({ favorites: [] });
    }
  },
  addFavoriteCampground: async (campgroundId) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/campgrounds/${campgroundId}/favorite`);
      await useAuthStore.getState().getAllFavorites();
      set({ loading: false, error: null });
    } catch {
      set({
        loading: false,
        error: "An error occurred during adding favorite campground",
      });
    }
  },
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/getUser");
      if (res.data.user) {
        set({ user: res.data.user, loading: false, error: null });
      } else {
        set({ user: null, loading: false, error: null });
      }
    } catch {
      set({
        user: null,
        loading: false,
        error: "An error occurred during fetching user data",
      });
    }
  },
  getMyCampgrounds: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/getMyCampgrounds");
      set({ myCampgrounds: res.data.campgrounds, loading: false, error: null });
      set({ loading: false });
    } catch {
      set({
        myCampgrounds: [],
        error: "An error occurred during fetching",
        loading: false,
      });
    }
  },
}));
