import { Campground } from "@/interfaces/types";
import { useAuthStore } from "@/stores/authStore";
import { useWindowStore } from "@/stores/windowStore";
import Image from "next/image";
import React from "react";
import { FaCampground } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdEdit, MdFavoriteBorder } from "react-icons/md";

function CampgroundCard({
  campground,
  nearbyCampgrounds,
}: {
  campground: Campground;
  nearbyCampgrounds: number;
}) {
  const favorites = useAuthStore((state) => state.favorites);

  const user = useAuthStore((state) => state.user);

  const addFavoriteCampground = useAuthStore(
    (state) => state.addFavoriteCampground
  );

  const isFavorite = (favorites: Campground[], campgroundId: string) => {
    return favorites.some((favorite) => favorite._id === campgroundId);
  };

  const setSelectedCampground = useWindowStore(
    (state) => state.setSelectedCampground
  );
  const selectedCampground = useWindowStore(
    (state) => state.selectedCampground
  );
  const setSelectedLocation = useWindowStore(
    (state) => state.setSelectedLocation
  );
  const setDetailsOpen = useWindowStore((state) => state.setDetailsOpen);
  const setEditWindowOpen = useWindowStore((state) => state.setEditWindowOpen);
  const setFavoriteWindowOpen = useWindowStore(
    (state) => state.setFavoritesOpen
  );

  return (
    <div
      onClick={() => {
        setSelectedCampground(campground._id);
        setSelectedLocation({
          lat: campground.position.lat,
          lng: campground.position.lng,
        });
      }}
      className={
        "flex relative flex-col lg:gap-2 gap-1 bg-white lg:p-4 p-1 mb-2 rounded-xl lg:w-[310px] w-[180px] lg:h-[340px] h-[200px] cursor-pointer " +
        (selectedCampground === campground._id
          ? "border border-orange-300"
          : "")
      }
    >
      <Image
        src={campground.images[0].url}
        alt="card"
        width={300}
        height={300}
        className="w-full h-1/2 object-cover bg-center rounded-lg"
      />
      <div className="flex items-center lg:gap-1 gap-0">
        <IoLocationOutline className="text-gray-600 lg:text-lg text-[12px]" />
        <p className="text-gray-600 lg:text-lg text-[11px] mt-1">
          {campground.location}
        </p>
      </div>
      <h2 className="font-medium lg:text-xl text-sm text-gray-700">
        {campground.title}
      </h2>
      <div className="flex items-center lg:gap-2 gap-0 justify-between">
        <div className="flex items-center gap-1">
          <FaCampground className="text-gray-400 lg:text-sm text-[11px]" />
          <p className="text-gray-500 lg:text-lg text-[10px]">
            {nearbyCampgrounds} nearby campgrounds
          </p>
        </div>
        <div className="bg-orange-400 px-2 rounded-2xl">
          <p className="text-white lg:text-sm text-[10px]">
            ${campground.price}
          </p>
        </div>
      </div>
      <button
        onClick={() => setDetailsOpen(true)}
        className="bg-sky-500 hover:bg-sky-600 text-white rounded-full w-full lg:py-2 py-0 lg:text-md text-[12px]"
      >
        Show Details
      </button>
      {user && (
        <div className="absolute lg:top-7 top-3 lg:right-7 right-3 flex flex-col gap-2">
          <div
            className={
              "rounded-full lg:p-2.5 p-2 cursor-pointer " +
              (isFavorite(favorites, campground._id)
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white hover:bg-gray-100")
            }
          >
            <MdFavoriteBorder
              size={15}
              className={
                isFavorite(favorites, campground._id)
                  ? "text-white"
                  : "text-black"
              }
              onClick={() => addFavoriteCampground(campground._id)}
            />
          </div>
          {user?._id === campground.author && (
            <div className="rounded-full p-2.5 cursor-pointer bg-orange-400 hover:bg-orange-500">
              <MdEdit
                size={15}
                className="text-white"
                onClick={() => {
                  setEditWindowOpen(true);
                  setFavoriteWindowOpen(false);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CampgroundCard;
