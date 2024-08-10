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
import { useGeolocation } from "@/components/hooks/useGeolocation";
import calculateDistance from "@/helpers/calculateDistance";
import Spinner from "@/components/ui/Spinner";
import Favorites from "@/components/ui/Favorites";
import haversineDistance from "@/helpers/haverSineDistance";
import { useAuthStore } from "@/stores/authStore";
import { useAuthWindowStore } from "@/stores/authWindow";
import SignInWindow from "@/components/ui/SignInWindow";
import SignUpWindow from "@/components/ui/SignUpWindow";
import { Toaster } from "react-hot-toast";
import api from "@/helpers/api";
import { Campground } from "@/interfaces/types";
import { useCampStore } from "@/stores/campStore";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Page() {
  const user = useAuthStore((set) => set.user);
  const signInOpen = useAuthWindowStore((set) => set.signInOpen);
  const setSignInOpen = useAuthWindowStore((set) => set.setSignInOpen);
  const signUpOpen = useAuthWindowStore((set) => set.signUpOpen);
  const setSignUpOpen = useAuthWindowStore((set) => set.setSignUpOpen);

  const checkAuth = useAuthStore((set) => set.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchAllCampgrounds = useCampStore(
    (state) => state.fetchAllCampgrounds
  );
  const isLoading = useCampStore((state) => state.loading);
  const campgrounds = useCampStore((state) => state.campgrounds);

  useEffect(() => {
    fetchAllCampgrounds();
  }, []);

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [createCampOpen, setCreateCampOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [filteredCampgrounds, setFilteredCampgrounds] = useState(campgrounds);
  const [selectedCampground, setSelectedCampground] = useState("");
  const [query, setQuery] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const [distance, setDistance] = useState(0);

  const [myPosition, setMyPosition] = useState({
    lat: geolocationPosition.lat,
    lng: geolocationPosition.lng,
  });

  const [selectedLocation, setSelectedLocation] = useState(myPosition);

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    window.localStorage.foo = "bar";
  }, []);

  useEffect(() => {
    if (geolocationPosition) {
      setMyPosition({
        lat: geolocationPosition.lat,
        lng: geolocationPosition.lng,
      });
      setSelectedLocation({
        lat: geolocationPosition.lat,
        lng: geolocationPosition.lng,
      });
    }
  }, [geolocationPosition]);

  //   calculating distance
  useEffect(() => {
    if (selectedLocation) {
      const distance = calculateDistance(
        geolocationPosition.lat,
        geolocationPosition.lng,
        selectedLocation.lat,
        selectedLocation.lng
      );
      setDistance(distance);
    }
  }, [selectedLocation, geolocationPosition]);

  useEffect(() => {
    if (isLoadingPosition) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeocodingError("");

        const res = await fetch(
          `${BASE_URL}?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}`
        );
        const data = await res.json();

        if (!data.countryCode) {
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 😉"
          );
        }

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
      } catch (err: any) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [isLoadingPosition, selectedLocation, myPosition]);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map/"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const handleCloseCreateWindow = () => {
    setCreateCampOpen(false);
  };

  const handleCloseDetailsWindow = () => {
    setDetailsOpen(false);
  };

  const handleSelectCampground = (id: string) => {
    setSelectedCampground(id);
    console.log(campgrounds.find((campground) => campground._id === id));
    setSelectedLocation({
      lat: campgrounds.find((campground) => campground._id === id)!.position
        .lat,
      lng: campgrounds.find((campground) => campground._id === id)!.position
        .lng,
    });
  };

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
    handleCloseCreateWindow();
    handleCloseDetailsWindow();
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
            handleCloseCreateWindow();
            handleCloseDetailsWindow();
            setFavoritesOpen(false);
            setSignInOpen(false);
            setSignUpOpen(false);
          }}
        ></div>
      )}
      <HeaderCamps
        query={query}
        handleSearch={setQuery}
        setCreateCampOpen={setCreateCampOpen}
        setFavoritesOpen={setFavoritesOpen}
      />
      <Toaster />
      <div className="flex items-center gap-4 w-full h-1/2 mb-8">
        <div className="w-full h-full rounded-lg shadow-sm z-0 border-2 border-white">
          <Map
            setSelectedLocation={setSelectedLocation}
            campgrounds={filteredCampgrounds}
            posix={[selectedLocation.lat, selectedLocation.lng]}
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
          ))
        )}
      </div>

      {createCampOpen && (
        <CreateCampgroundWindow
          myPosition={myPosition}
          selectedLocation={selectedLocation}
          setCreateCampOpen={setCreateCampOpen}
          setSelectedLocation={setSelectedLocation}
          cityName={cityName}
          country={country}
        />
      )}

      {favoritesOpen && (
        <Favorites
          setDetailsOpen={setDetailsOpen}
          handleSelectCampground={handleSelectCampground}
          selectedCampground={selectedCampground}
          setFavoritesOpen={setFavoritesOpen}
        />
      )}

      {detailsOpen && selectedCampground && (
        <CampgroundDetails
          setSelectedLocation={setSelectedLocation}
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
