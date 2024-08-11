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
        "flex relative flex-col gap-2 bg-white p-4 mb-2 rounded-xl w-[310px] h-[340px] cursor-pointer " +
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
      <div className="flex items-center gap-1">
        <IoLocationOutline size={16} color="black" />
        <p className="text-gray-600 text-sm">{campground.location}</p>
      </div>
      <h2 className="font-medium text-lg text-gray-700">{campground.title}</h2>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-1">
          <FaCampground size={15} className="text-gray-400" />
          <p className="text-gray-500">
            {nearbyCampgrounds} nearby campgrounds
          </p>
        </div>
        <div className="bg-orange-400 px-2 rounded-2xl">
          <p className="text-white">${campground.price}</p>
        </div>
      </div>
      <button
        onClick={() => setDetailsOpen(true)}
        className="bg-sky-500 hover:bg-sky-600 text-white rounded-full w-full py-2 text-md"
      >
        Show Details
      </button>
      {user && (
        <div className="absolute top-7 right-7 flex flex-col gap-2">
          <div
            className={
              "rounded-full p-2.5 cursor-pointer " +
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
                onClick={() => setEditWindowOpen(true)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CampgroundCard;
