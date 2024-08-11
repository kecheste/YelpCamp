import { LatLngExpression } from "leaflet";
import { create } from "zustand";

interface MapState {
  myPosition: LatLngExpression;
  setMyPosition: () => Promise<void>;
}

export const useMapStore = create<MapState>((set) => ({
  myPosition: {
    lat: 0,
    lng: 0,
  },
  setMyPosition: async () => {
    try {
      // await getPosition();
      // set({
      //   myPosition: {
      //     lat: geolocationPosition?.lat || 0,
      //     lng: geolocationPosition?.lng || 0,
      //   },
      // });
    } catch (error) {
      console.error(error);
    }
  },
}));
