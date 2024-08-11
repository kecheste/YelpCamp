import api from "@/helpers/api";
import { Campground } from "@/interfaces/types";
import { create } from "zustand";

interface CampState {
  loading: boolean;
  error: string | null;
  campgrounds: Campground[];
  createCampground: (
    title: string,
    description: string,
    location: string,
    price: string,
    image: FileList,
    position: { lat: number; lng: number }
  ) => Promise<void>;
  updateCampground: (
    id: string,
    title: string,
    description: string,
    location: string,
    price: string,
    position: { lat: number; lng: number }
  ) => Promise<void>;
  deleteCampground: (id: string) => Promise<void>;
  fetchAllCampgrounds: () => Promise<void>;
}

export const useCampStore = create<CampState>((set) => ({
  loading: false,
  error: null,
  campgrounds: [],
  createCampground: async (
    title,
    description,
    location,
    price,
    image,
    position
  ) => {
    try {
      set({ loading: true, error: null });
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("price", price);

      Array.from(image).forEach((img) => {
        formData.append("image", img);
      });

      formData.append("position", JSON.stringify(position));

      await api.post("/campgrounds", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await useCampStore.getState().fetchAllCampgrounds();
      set({ loading: false, error: null });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: "An error occurred during creating the campground",
      });
    }
  },
  updateCampground: async (
    id,
    title,
    description,
    location,
    price,
    position
  ) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("position", JSON.stringify(position));

      await api.patch(`/campgrounds/${id}`, {
        title,
        description,
        location,
        price,
        position: JSON.stringify(position),
      });

      await useCampStore.getState().fetchAllCampgrounds();
      set({ loading: false, error: null });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: "An error occurred during updating the campground",
      });
    }
  },
  deleteCampground: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/campgrounds/${id}`);
      await useCampStore.getState().fetchAllCampgrounds();
      set({ loading: false, error: null });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: "An error occurred during deleting the campground",
      });
    }
  },
  fetchAllCampgrounds: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/campgrounds");
      set({ campgrounds: response.data, loading: false, error: null });
      set({ loading: false, error: null });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: "An error occurred during fetching campgrounds",
      });
    }
  },
}));
