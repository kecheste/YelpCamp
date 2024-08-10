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
