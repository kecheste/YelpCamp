import { create } from "zustand";

interface AllWindowState {
  query: string;
  position: { lat: number; lng: number };
  detailsOpen: boolean;
  favoritesOpen: boolean;
  selectedCampground: string;
  createCampOpen: boolean;
  isLoadingPosition: boolean;
  myPosition: { lat: number; lng: number };
  selectedLocation: { lat: number; lng: number };
  editWindowOpen: boolean;
  cityName: string;
  country: string;
  setCityName: (value: string) => void;
  setCountry: (value: string) => void;
  setSelectedLocation: (value: { lat: number; lng: number }) => void;
  setQuery: (value: string) => void;
  setCreateCampOpen: (value: boolean) => void;
  setDetailsOpen: (value: boolean) => void;
  setSelectedCampground: (value: string) => void;
  setFavoritesOpen: (value: boolean) => void;
  setPosition: (value: { lat: number; lng: number }) => void;
  getPosition: () => void;
  setEditWindowOpen: (value: boolean) => void;
}

export const useWindowStore = create<AllWindowState>((set) => ({
  query: "",
  detailsOpen: false,
  selectedCampground: "",
  position: { lat: 0, lng: 0 },
  favoritesOpen: false,
  createCampOpen: false,
  isLoadingPosition: false,
  myPosition: { lat: 0, lng: 0 },
  editWindowOpen: false,
  selectedLocation: { lat: 0, lng: 0 },
  cityName: "",
  country: "",
  setCityName: (value: string) => set({ cityName: value }),
  setCountry: (value: string) => set({ country: value }),
  setSelectedLocation: (value: { lat: number; lng: number }) =>
    set({ selectedLocation: value }),
  setDetailsOpen: (value: boolean) => set({ detailsOpen: value }),
  setSelectedCampground: (value: string) => set({ selectedCampground: value }),
  setFavoritesOpen: (value: boolean) => set({ favoritesOpen: value }),
  setCreateCampOpen: (value: boolean) => set({ createCampOpen: value }),
  setQuery: (value: string) => set({ query: value }),
  setPosition: (value: { lat: number; lng: number }) =>
    set({ position: value }),
  setEditWindowOpen: (value: boolean) => set({ editWindowOpen: value }),
  getPosition: () => {
    if (!navigator.geolocation)
      return console.log("Your browser does not support geolocation");

    set({ isLoadingPosition: true });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({
          myPosition: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          isLoadingPosition: false,
        });
      },
      (error) => {
        console.log(error.message);
        set({ isLoadingPosition: false });
      }
    );
    set({ isLoadingPosition: false });
  },
}));
