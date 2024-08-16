/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import CampgroundCard from "@/components/ui/CampgroundCard";
import CampgroundDetails from "@/components/ui/CampgroundDetails";
import CreateCampgroundWindow from "@/components/ui/CreateCampgroundWindow";
import EditCampgroundWindow from "@/components/ui/EditCampgroundWindow";
import Favorites from "@/components/ui/Favorites";
import HeaderCamps from "@/components/ui/HeaderCamps";
import SignInWindow from "@/components/ui/SignInWindow";
import SignUpWindow from "@/components/ui/SignUpWindow";
import Spinner from "@/components/ui/Spinner";
import haversineDistance from "@/helpers/haverSineDistance";
import { useAuthStore } from "@/stores/authStore";
import { useAuthWindowStore } from "@/stores/authWindow";
import { useCampStore } from "@/stores/campStore";
import { useWindowStore } from "@/stores/windowStore";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { IoIosStarHalf } from "react-icons/io";

function Page() {
  const user = useAuthStore((set) => set.user);
  const loading = useAuthStore((set) => set.loading);

  const myCampgrounds = useAuthStore((set) => set.myCampgrounds);
  const getMyCampgrounds = useAuthStore((set) => set.getMyCampgrounds);
  const isLoading = useAuthStore((set) => set.loading);
  const selectedCampground = useWindowStore(
    (state) => state.selectedCampground
  );

  const campgrounds = useCampStore((state) => state.campgrounds);

  const myPosition = useWindowStore((state) => state.myPosition);
  const selectedLocation = useWindowStore((state) => state.selectedLocation);
  const editWindowOpen = useWindowStore((state) => state.editWindowOpen);
  const createCampOpen = useWindowStore((set) => set.createCampOpen);
  const detailsOpen = useWindowStore((set) => set.detailsOpen);
  const favoritesOpen = useWindowStore((set) => set.favoritesOpen);
  const authWindowOpen = useAuthWindowStore((state) => state.isOpen);
  const setAuthWindowOpen = useAuthWindowStore((state) => state.setIsOpen);
  const setCreateCampOpen = useWindowStore((set) => set.setCreateCampOpen);
  const setDetailsOpen = useWindowStore((set) => set.setDetailsOpen);
  const setFavoritesOpen = useWindowStore((set) => set.setFavoritesOpen);
  const setSignInOpen = useAuthWindowStore((state) => state.setSignInOpen);
  const setSignUpOpen = useAuthWindowStore((state) => state.setSignUpOpen);
  const setEditWindowOpen = useWindowStore((state) => state.setEditWindowOpen);
  const signInOpen = useAuthWindowStore((state) => state.signInOpen);
  const signUpOpen = useAuthWindowStore((state) => state.signUpOpen);
  const cityName = useWindowStore((state) => state.cityName);
  const country = useWindowStore((state) => state.country);
  const checkAuth = useAuthStore((set) => set.checkAuth);

  useEffect(() => {
    checkAuth();
    getMyCampgrounds();
  }, []);

  if (loading) {
    return <Spinner theme="dark" />;
  }

  if (!user) {
    return redirect("/app/camps");
  }

  const handleCloseWindows = () => {
    setCreateCampOpen(false);
    setDetailsOpen(false);
    setAuthWindowOpen(false);
    setFavoritesOpen(false);
    setSignInOpen(false);
    setSignUpOpen(false);
    setEditWindowOpen(false);
  };

  return (
    <div className="w-full relative text-gray-600 relative bg-gray-100 relative h-screen flex flex-col items-center px-44 gap-3">
      {(createCampOpen ||
        detailsOpen ||
        favoritesOpen ||
        authWindowOpen ||
        signInOpen ||
        editWindowOpen ||
        signUpOpen) && (
        <div
          className="absolute inset-0 bg-black opacity-50 z-20"
          onClick={handleCloseWindows}
        ></div>
      )}

      {signInOpen && <SignInWindow />}
      {signUpOpen && <SignUpWindow />}

      {authWindowOpen && (
        <div
          className="absolute inset-0 bg-black opacity-5 z-10"
          onClick={() => {
            setCreateCampOpen(false);
            setDetailsOpen(false);
            setFavoritesOpen(false);
            setSignInOpen(false);
            setSignUpOpen(false);
          }}
        ></div>
      )}
      <HeaderCamps handleSearch={() => {}} />
      <Toaster />
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
      <div className="rounded-lg w-full flex flex-col divide-y">
        <div className="px-4 py-2 bg-white mt-4 rounded-lg">
          <p className="text-lg font-bold">Your Campgrounds</p>
        </div>
        <div className="h-full rounded-lg py-2 w-full flex flex-wrap items-center gap-3 overflow-y-scroll pr-2">
          {isLoading ? (
            <Spinner theme="dark" />
          ) : (
            myCampgrounds.map((campground) => (
              <CampgroundCard
                key={campground._id}
                campground={campground}
                nearbyCampgrounds={
                  myCampgrounds.filter((campground1) => {
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
            ))
          )}
        </div>
      </div>

      {createCampOpen && (
        <CreateCampgroundWindow
          myPosition={myPosition}
          selectedLocation={selectedLocation}
          setCreateCampOpen={setCreateCampOpen}
          cityName={cityName}
          country={country}
        />
      )}

      {editWindowOpen && (
        <EditCampgroundWindow
          cityName={cityName}
          country={country}
          campground={campgrounds.find(
            (campground) => campground._id === selectedCampground
          )}
        />
      )}

      {favoritesOpen && <Favorites />}

      {detailsOpen && selectedCampground && (
        <CampgroundDetails
          campground={
            campgrounds.find(
              (campground) => campground._id === selectedCampground
            )!
          }
        />
      )}
    </div>
  );
}

export default Page;
