"use client";

import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import CampgroundCard from "./CampgroundCard";
import haversineDistance from "@/helpers/haverSineDistance";
import api from "@/helpers/api";

function Favorites({
  setFavoritesOpen,
  setDetailsOpen,
  handleSelectCampground,
  selectedCampground,
}: {
  setFavoritesOpen: (value: boolean) => void;
  setDetailsOpen: (value: boolean) => void;
  handleSelectCampground: (value: string) => void;
  selectedCampground: string;
}) {
  const [campgrounds, setCampgrounds] = useState<
    {
      _id: string;
      name: string;
      description: string;
      location: string;
      images: {
        _id: string;
        url: string;
        filename: string;
      }[];
      rating: number;
      favorites: number;
      price: number;
      visits: number;
      position: { lat: number; lng: number };
      reviews: { id: number; name: string; rating: number; review: string }[];
    }[]
  >([]);

  useEffect(() => {
    async function fetchCampgrounds() {
      const response = await api.get("/campgrounds");
      if (!response.data) {
        return;
      }
      console.log(response.data);
      setCampgrounds(response.data);
    }

    fetchCampgrounds();
  }, []);

  return (
    <div className="absolute w-[1000px] h-2/3 bg-white rounded-lg flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      <div className="flex flex-col divide-y divide-gray-400 items-center gap-4 h-full w-full">
        <div className="flex items-center gap-6 px-4 pt-2 self-start w-full">
          <div
            className="cursor-pointer"
            onClick={() => setFavoritesOpen(false)}
          >
            <RxCross1 size={20} color="black" />
          </div>
          <p className="text-black">Favorites</p>
        </div>
        <div className="h-full mb-4 w-full flex flex-wrap gap-4 overflow-y-scroll p-4 bg-gray-100">
          {campgrounds.map((campground: any) => (
            <CampgroundCard
              campground={campground}
              setDetailsOpen={setDetailsOpen}
              setSelectedCampground={handleSelectCampground}
              selectedCampground={selectedCampground}
              nearbyCampgrounds={
                campgrounds.filter((campground1) => {
                  const distance1 = haversineDistance(
                    {
                      lat: campground1.position.lat,
                      lng: campground1.position.lng,
                    },
                    {
                      lat: campground.position.lat,
                      lng: campground.position.lng,
                    }
                  );
                  return distance1 <= 100;
                }).length
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
