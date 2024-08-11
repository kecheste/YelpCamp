"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import Image from "next/image";
import { Campground } from "@/interfaces/types";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  campgrounds?: Campground[];
  setSelectedLocation?: (value: { lat: number; lng: number }) => void;
}

const Map = (Map: MapProps) => {
  const { posix, campgrounds, zoom, setSelectedLocation } = Map;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        className="rounded-lg"
        center={posix}
        zoom={zoom || 12}
        scrollWheelZoom={false}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "5px",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {campgrounds?.map((campground) => (
          <Marker
            key={campground._id}
            position={[campground.position.lat, campground.position.lng]}
            draggable={false}
          >
            <Popup>
              <div className="flex w-[100px] flex-col p-1 items-center bg-white rounded-lg">
                <Image
                  alt=""
                  src={campground.images[0].url}
                  width={100}
                  height={100}
                  className="w-[80px] h-[50px] object-cover"
                />
                <p className="text-gray-500 text-md font-medium mb-2">
                  {campground.title}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={posix} />
        <DetectClick setSelectedLocation={setSelectedLocation!} />
      </MapContainer>
    </div>
  );
};

function ChangeCenter({ position }: { position: LatLngExpression }) {
  const map = useMap();
  map.setView(position);
  return null;
}

interface DetectClickProps {
  setSelectedLocation?: (value: { lat: number; lng: number }) => void;
}

function DetectClick({ setSelectedLocation }: DetectClickProps): any {
  useMapEvents({
    click: (e) => {
      if (setSelectedLocation) {
        setSelectedLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });
  return null;
}

export default Map;
