import api from "@/helpers/api";
import { Review } from "@/interfaces/types";
import { create } from "zustand";

interface ReviewState {
  loading: boolean;
  error: string | null;
  reviews: Review[];
  createReview: (id: string, body: string, rating: number) => Promise<void>;
  fetchAllReviews: (id: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  loading: false,
  error: null,
  reviews: [],
  createReview: async (id, body, rating) => {
    try {
      set({ loading: true, error: null });

      await api.post("/campgrounds/" + id + "/reviews", {
        body,
        rating,
      });

      await useReviewStore.getState().fetchAllReviews(id);
      set({ loading: false, error: null });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: "An error occurred during creating the review",
      });
    }
  },
  fetchAllReviews: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/campgrounds/" + id + "/reviews");
      set({ reviews: response.data, loading: false, error: null });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: "An error occurred during fetching reviews",
      });
    }
  },
}));
