import { Campground } from "@/interfaces/types";
import Image from "next/image";
import React from "react";
import { FaCampground } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";

function CampgroundCard({
  setDetailsOpen,
  campground,
  setSelectedCampground,
  selectedCampground,
  nearbyCampgrounds,
}: {
  setDetailsOpen: (value: boolean) => void;
  campground: Campground;
  setSelectedCampground: (value: string) => void;
  selectedCampground: string;
  nearbyCampgrounds: number;
}) {
  return (
    <div
      onClick={() => setSelectedCampground(campground._id)}
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
      <div className="absolute bg-white hover:bg-gray-100 rounded-full p-2.5 top-7 right-7 cursor-pointer">
        <MdFavoriteBorder size={15} className="text-black" />
      </div>
    </div>
  );
}

export default CampgroundCard;
