import L from "leaflet";

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const pointA = L.latLng(lat1, lon1);
  const pointB = L.latLng(lat2, lon2);
  const distance = pointA.distanceTo(pointB);
  return distance;
};

export default calculateDistance;
