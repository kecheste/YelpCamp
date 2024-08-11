import type { LatLng } from "leaflet";

let L: typeof import("leaflet") | undefined;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number | null => {
  if (!L) {
    return 0;
  }

  const pointA: LatLng = L.latLng(lat1, lon1);
  const pointB: LatLng = L.latLng(lat2, lon2);
  const distance: number = pointA.distanceTo(pointB);
  return distance;
};

export default calculateDistance;
