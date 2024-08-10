import Link from "next/link";
import React from "react";
import { FaCampground } from "react-icons/fa";

function Details() {
  return (
    <div className="text-center w-[450px]">
      <div className="flex flex-col gap-4 items-center justify-center">
        <p className="text-md text-gray-200">
          Discover the magic of untouched landscapes, connect with nature in its
          purest form, and awaken your sense of wonder as you navigate through
          rugged trails, lush forests, and tranquil lakes
        </p>
        <Link
          href="/app/camps"
          className="py-3 px-6 mt-3 text-black bg-white hover:bg-sky-100 rounded-full"
        >
          <span className="flex items-center gap-2">
            <FaCampground size={20} color="black" />
            <p>Find Nearby Spots</p>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Details;
