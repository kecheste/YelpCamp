/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import CampgroundCard from "@/components/ui/CampgroundCard";
import HeaderCamps from "@/components/ui/HeaderCamps";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import CreateCampgroundWindow from "@/components/ui/CreateCampgroundWindow";
import CampgroundDetails from "@/components/ui/CampgroundDetails";
import { FaCampground } from "react-icons/fa";
import { CiGlobe, CiStar } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import calculateDistance from "@/helpers/calculateDistance";
import Spinner from "@/components/ui/Spinner";
import Favorites from "@/components/ui/Favorites";
import haversineDistance from "@/helpers/haverSineDistance";
import { useAuthStore } from "@/stores/authStore";
import { useAuthWindowStore } from "@/stores/authWindow";
import SignInWindow from "@/components/ui/SignInWindow";
import SignUpWindow from "@/components/ui/SignUpWindow";
import { Toaster } from "react-hot-toast";
import { Campground } from "@/interfaces/types";
import { useCampStore } from "@/stores/campStore";
import axios from "axios";
import { useWindowStore } from "@/stores/windowStore";
import EditCampgroundWindow from "@/components/ui/EditCampgroundWindow";

const BASE_URL = "https://api.geoapify.com/v1/geocode/reverse";

function Page() {
  const signInOpen = useAuthWindowStore((set) => set.signInOpen);
  const setSignInOpen = useAuthWindowStore((set) => set.setSignInOpen);
  const signUpOpen = useAuthWindowStore((set) => set.signUpOpen);
  const setSignUpOpen = useAuthWindowStore((set) => set.setSignUpOpen);

  const checkAuth = useAuthStore((set) => set.checkAuth);
  const getAllFavorites = useAuthStore((set) => set.getAllFavorites);

  const setCreateCampOpen = useWindowStore((set) => set.setCreateCampOpen);
  const createCampOpen = useWindowStore((set) => set.createCampOpen);
  const editWindowOpen = useWindowStore((set) => set.editWindowOpen);
  const favoritesOpen = useWindowStore((state) => state.favoritesOpen);
  const setFavoritesOpen = useWindowStore((state) => state.setFavoritesOpen);
  const detailsOpen = useWindowStore((state) => state.detailsOpen);
  const setDetailsOpen = useWindowStore((state) => state.setDetailsOpen);
  const query = useWindowStore((state) => state.query);
  const setQuery = useWindowStore((state) => state.setQuery);
  const myPosition = useWindowStore((state) => state.myPosition);
  const getPosition = useWindowStore((state) => state.getPosition);
  const isLoadingPosition = useWindowStore((state) => state.isLoadingPosition);
  const selectedCampground = useWindowStore(
    (state) => state.selectedCampground
  );
  const setSelectedLocation = useWindowStore(
    (state) => state.setSelectedLocation
  );
  const selectedLocation = useWindowStore((state) => state.selectedLocation);
  const cityName = useWindowStore((state) => state.cityName);
  const setCityName = useWindowStore((state) => state.setCityName);
  const country = useWindowStore((state) => state.country);
  const setCountry = useWindowStore((state) => state.setCountry);

  const isLoading = useCampStore((state) => state.loading);
  const campgrounds = useCampStore((state) => state.campgrounds);
  const fetchAllCampgrounds = useCampStore(
    (state) => state.fetchAllCampgrounds
  );

  const [filteredCampgrounds, setFilteredCampgrounds] = useState(campgrounds);
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [distance, setDistance] = useState<number | null>(0);

  useEffect(() => {
    getPosition();
    checkAuth();
    getAllFavorites();
    fetchAllCampgrounds();
  }, []);

  useEffect(() => {
    if (myPosition) {
      setSelectedLocation({
        lat: myPosition.lat,
        lng: myPosition.lng,
      });
    }
  }, [myPosition]);

  useEffect(() => {
    if (selectedLocation) {
      if (typeof window !== "undefined") {
        const distance = calculateDistance(
          myPosition.lat,
          myPosition.lng,
          selectedLocation.lat,
          selectedLocation.lng
        );
        setDistance(distance);
      }
    }
  }, [myPosition, selectedLocation]);

  useEffect(() => {
    if (isLoadingPosition) return;

    if (selectedLocation.lat === 0 || selectedLocation.lng === 0) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);

        const res = await axios.get(
          `${BASE_URL}?lat=${selectedLocation.lat}&lon=${selectedLocation.lng}&apiKey=899f617a9c22413db5c18e929b0379e7`
        );

        if (!res) {
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 😉"
          );
        }

        setCityName(res.data.features[0].properties.city || "");
        setCountry(res.data.features[0].properties.country || "");
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [myPosition, selectedLocation]);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map/"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    const handleSearch = () => {
      if (query.length < 3) {
        setFilteredCampgrounds(campgrounds);
      } else {
        const filtered = campgrounds.filter((campground) =>
          campground.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCampgrounds(filtered);
      }
    };

    handleSearch();
  }, [query, campgrounds]);

  const nearbyCampgrounds = campgrounds.filter((campground) => {
    const distance1 = haversineDistance(
      { lat: selectedLocation.lat, lng: selectedLocation.lng },
      { lat: campground.position.lat, lng: campground.position.lng }
    );
    return distance1 <= 100;
  });

  const calculateAverageRating = (campgrounds: Campground[]) => {
    const totalRatings = campgrounds.reduce(
      (acc, campground) => acc + campground.rating,
      0
    );
    return Math.round((totalRatings / campgrounds.length) * 100) / 100 || 0;
  };

  const calculateFavorites = (campgrounds: Campground[]) => {
    const totalFavorites = campgrounds.reduce(
      (acc, campground) => acc + campground.favorites,
      0
    );
    return (
      (totalFavorites > 1000
        ? Math.floor(totalFavorites / 1000)
        : totalFavorites) || 0
    );
  };

  const calculateVisits = (campgrounds: Campground[]) => {
    const totalVisits = campgrounds.reduce(
      (acc, campground) => acc + campground.visits,
      0
    );
    return totalVisits > 1000
      ? Math.floor(totalVisits / 1000)
      : totalVisits || 0;
  };

  const averageRating = calculateAverageRating(nearbyCampgrounds);
  const totalFavorites = calculateFavorites(nearbyCampgrounds);
  const totalVisits = calculateVisits(nearbyCampgrounds);

  const authWindowOpen = useAuthWindowStore((state) => state.isOpen);
  const setAuthWindowOpen = useAuthWindowStore((state) => state.setIsOpen);

  const handleCloseWindows = () => {
    setCreateCampOpen(false);
    setDetailsOpen(false);
    setAuthWindowOpen(false);
    setFavoritesOpen(false);
    setSignInOpen(false);
    setSignUpOpen(false);
  };

  return (
    <div className="w-full relative bg-gray-100 relative h-screen flex flex-col items-center px-32">
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
      <HeaderCamps handleSearch={setQuery} />
      <Toaster />
      <div className="flex items-center gap-2 w-full h-1/2 mb-2">
        <div className="w-full h-full rounded-lg shadow-sm z-0 border-2 border-white">
          <Map
            setSelectedLocation={setSelectedLocation}
            campgrounds={filteredCampgrounds}
            posix={selectedLocation}
          />
        </div>
        {isLoadingGeocoding ? (
          <div className="w-[600px] h-full bg-white rounded-lg flex flex-col items-center py-4 px-6">
            <Spinner theme="dark" />
          </div>
        ) : (
          <div className="w-[600px] h-full bg-white rounded-lg flex flex-col items-center py-4 px-6">
            <p className="text-gray-700 text-3xl font-semibold mt-8">
              {cityName}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <ImLocation2 size={20} className="text-gray-600" />
              <p className="text-gray-600 text-md">
                {Math.round(distance / 1000)} Km from your current location
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <FaCampground size={20} className="text-gray-600" />
              <p className="text-gray-600 text-md">
                {nearbyCampgrounds.length || 0} Campgrounds found nearby
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-4 mt-8">
              <div className="flex flex-col items-center gap-2 border w-[110px] h-auto border-gray-300 bg-gray-50 rounded-lg py-2 px-1">
                <CiGlobe size={35} className="text-gray-600" />
                <p className="text-gray-600 text-sm">{totalVisits}k Visits</p>
              </div>
              <div className="flex flex-col items-center gap-2 border w-[110px] h-auto border-gray-300 bg-gray-50 rounded-lg py-2 px-1">
                <CiStar size={35} className="text-gray-600" />
                <p className="text-gray-600 text-sm">{averageRating} Ratings</p>
              </div>
              <div className="flex flex-col items-center gap-2 border w-[110px] h-auto border-gray-300 bg-gray-50 rounded-lg py-2 px-1">
                <MdFavoriteBorder size={35} className="text-gray-600" />
                <p className="text-gray-600 text-sm">
                  {totalFavorites}k Favorites
                </p>
              </div>
            </div>
            <button
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-full w-full py-2 text-md mt-8"
              onClick={getPosition}
            >
              Show Nearby Camps
            </button>
          </div>
        )}
      </div>

      <div className="h-1/2 rounded-lg mb-4 w-full flex flex-wrap items-center gap-4 overflow-y-scroll pr-2">
        {isLoading ? (
          <Spinner theme="dark" />
        ) : (
          filteredCampgrounds.map((campground) => (
            <CampgroundCard
              key={campground._id}
              campground={campground}
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
          ))
        )}
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
