"use client";

import HeaderCamps from "@/components/ui/HeaderCamps";
import Spinner from "@/components/ui/Spinner";
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { IoIosStarHalf } from "react-icons/io";

function Page() {
  const user = useAuthStore((set) => set.user);
  const loading = useAuthStore((set) => set.loading);

  if (loading) {
    return <Spinner theme="dark" />;
  }

  if (!user) {
    return redirect("/app/camps");
  }

  return (
    <div className="w-full text-gray-600 relative bg-gray-100 relative h-screen flex flex-col items-center px-44 gap-3">
      <HeaderCamps
        query=""
        handleSearch={() => {}}
        setCreateCampOpen={(v: boolean) => {}}
        setFavoritesOpen={(v: boolean) => {}}
      />
      <div className="flex items-center w-full pr-10 bg-white p-4 rounded-xl">
        <Image
          src="/card.jpg"
          alt=""
          width={250}
          height={250}
          className="w-[250px] h-[250px] object-cover rounded-2xl"
        />
        <div className="ml-10 flex flex-col mt-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-lg text-gray-500">Addis Ababa, Ethiopia</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold">101</h1>
                  <h1 className="text-sm text-gray-400">Campings</h1>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold">401</h1>
                  <h1 className="text-sm text-gray-400">Favorites</h1>
                </div>
              </div>
              <button className="text-white bg-purple-500 hover:bg-purple-600 py-2 px-5 rounded-xl">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 w-full">
            <div className="rounded-full flex gap-2 items-center border border-gray-300 px-4">
              <IoIosStarHalf size={30} color="green" />
              <div className="flex flex-col pr-2">
                <p className="text-md font-bold">TOP LUXURY HIGH END</p>
                <p className="text-sm text-green-600">2013-2016</p>
              </div>
            </div>
            <div className="rounded-full flex gap-2 items-center border border-gray-300 px-4">
              <IoIosStarHalf size={30} color="purple" />
              <div className="flex flex-col pr-2">
                <p className="text-md font-bold">TOP 1%</p>
                <p className="text-sm text-purple-600">2019</p>
              </div>
            </div>
            <div className="rounded-full flex gap-2 items-center border border-gray-300 px-4">
              <IoIosStarHalf size={30} color="orange" />
              <div className="flex flex-col pr-2">
                <p className="text-md font-bold">TOP 10%</p>
                <p className="text-sm text-orange-600">2021</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg w-full flex flex-col divide-y">
        <div className="px-4 py-2">
          <p className="text-lg font-bold">Your Campgrounds</p>
        </div>
        <div className="h-full flex">
          <div className=""></div>
        </div>
      </div>
    </div>
  );
}

export default Page;
