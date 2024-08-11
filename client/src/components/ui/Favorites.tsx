"use client";

import React from "react";
import { RxCross1 } from "react-icons/rx";
import CampgroundCard from "./CampgroundCard";
import haversineDistance from "@/helpers/haverSineDistance";
import { useAuthStore } from "@/stores/authStore";
import { useWindowStore } from "@/stores/windowStore";

function Favorites() {
  const favorites = useAuthStore((state) => state.favorites);

  const setFavoritesOpen = useWindowStore((state) => state.setFavoritesOpen);

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
          {favorites.map((favorite: any) => (
            <CampgroundCard
              key={favorite._id}
              campground={favorite}
              nearbyCampgrounds={
                favorites.filter((favorite1) => {
                  const distance1 = haversineDistance(
                    {
                      lat: favorite1.position.lat,
                      lng: favorite1.position.lng,
                    },
                    {
                      lat: favorite.position.lat,
                      lng: favorite.position.lng,
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
