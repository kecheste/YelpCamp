/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "@smastrom/react-rating/style.css";
import { Rating, ThinStar } from "@smastrom/react-rating";
import Input from "./Input";
import { Campground } from "@/interfaces/types";
import { useReviewStore } from "@/stores/reviewStore";
import toast from "react-hot-toast";
import LoadingButton from "./LoadingButton";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useWindowStore } from "@/stores/windowStore";

function CampgroundDetails({ campground }: { campground: Campground }) {
  const [ratingForm, setRatingForm] = useState(0);
  const [body, setBody] = useState("");
  const [locading, setLoading] = useState(false);
  const setDetailsOpen = useWindowStore((state) => state.setDetailsOpen);

  const fetchAllReviews = useReviewStore((state) => state.fetchAllReviews);
  const reviews = useReviewStore((state) => state.reviews);

  useEffect(() => {
    fetchAllReviews(campground._id);
  }, []);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map/"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const createReviewForCampground = useReviewStore(
    (state) => state.createReview
  );

  const createReview = async () => {
    setLoading(true);

    try {
      await createReviewForCampground(campground._id, body, ratingForm);

      const { loading, error } = useReviewStore.getState();

      if (loading) {
        toast.loading("Creating review...");
      } else {
        if (error) {
          toast.error(error);
          setLoading(false);
        } else {
          toast.success("Review created successfully");
          setLoading(false);
          setBody("");
          setRatingForm(0);
        }
      }
    } catch {
      console.error("An error occurred during creating the review");
      toast.success("Review created successfully");
      setLoading(false);
    }
    setLoading(false);
  };

  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: "#ffb700",
    inactiveFillColor: "#fbf1a9",
  };

  return (
    <div className="absolute lg:w-3/4 w-full lg:h-auto lg:h-max-3/4 h-full bg-white rounded-lg flex items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 lg:overflow-y-hidden overflow-y-scroll">
      <div className="flex lg:flex-row flex-col w-full h-full gap-4 lg:p-4 p-2 relative">
        <div className="absolute">
          <button
            onClick={() => setDetailsOpen(false)}
            className="absolute lg:-top-1 lg:-right-8 -right-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 z-30"
          >
            <IoClose className="text-white text-lg" />
          </button>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="w-full lg:h-1/2 h-auto object-cover">
            <Carousel>
              {campground.images.map((image, index) => (
                <Image
                  alt="camp"
                  height={400}
                  width={400}
                  key={index}
                  src={image.url}
                  className="w-[400px] max-h-[350px] object-cover"
                />
              ))}
            </Carousel>
          </div>
          <div className="text-gray-700 lg:pl-6 lg:mt-0 mt-3">
            <div className="flex items-center justify-between lg:pr-6 pr-2 mb-3">
              <h2 className="lg:text-3xl text-xl font-bold">
                {campground.title}
              </h2>
              <div className="flex items-center gap-4">
                <Rating
                  className="lg:max-w-[150px] max-w-[100px]"
                  value={Math.floor(campground.rating)}
                  itemStyles={myStyles}
                  readOnly
                />
                <p className="lg:text-md text-sm mt-1">{campground.rating}/5</p>
              </div>
            </div>
            <p className="lg:text-lg text-sm text-gray-500 font-italic">
              {campground.description}
            </p>
            <p className="lg:text-lg text-sm text-gray-500 mt-4">
              <span className="font-bold">Location:</span> {campground.location}
            </p>
            <p className="lg:text-lg text-sm text-gray-500">
              <span className="font-bold">Favorites:</span>{" "}
              {campground.favorites}
            </p>
            <p className="lg:text-lg text-sm text-gray-500 mb-4">
              <span className="font-bold">By:</span>{" "}
              {campground.author.username}
            </p>

            <p className="lg:text-lg text-sm text-gray-500 mt-4 bg-orange-400 rounded-full px-3 py-1 text-white lg:w-[150px] w-[110px] text-center">
              ${campground.price}/night
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:gap-4 gap-2 w-full h-auto lg:pb-0 pb-20">
          <div className="rounded-lg shadow-md border-2 border-white z-0 w-full lg:h-[350px] h-[250px]">
            <Map
              campgrounds={[campground]}
              posix={[campground.position.lat, campground.position.lng]}
            />
          </div>
          <h2 className="lg:text-2xl text-lg text-gray-700 font-bold">
            Leave a Review
          </h2>
          <div className="flex items-center gap-4">
            <Input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Review"
              name="body"
              type="text"
              required
            />
            <Rating
              className="lg:max-w-[150px] max-w-[100px]"
              value={ratingForm}
              onChange={setRatingForm}
              itemStyles={myStyles}
            />
          </div>
          <LoadingButton
            onClick={createReview}
            disabled={locading}
            loading={locading}
            className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg w-full lg:py-3 py-2 lg:text-md text-sm"
          >
            Create Review
          </LoadingButton>
          {reviews.length > 0 && (
            <div className="flex gap-2 flex-wrap lg:h-[250px] max-h-[250px] overflow-y-scroll border border-1 border-gray-200 rounded-md p-2">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="rounded-xl text-black border h-auto shadow-sm py-1 px-6 border-gray-300 flex flex-col gap-1 lg:max-w-[330px] max-w-full"
                >
                  <div className="flex gap-2 items-center justify-between">
                    <p className="text-md font-bold text-gray-700">
                      {review.author.username}
                    </p>
                    <Rating
                      className="max-w-[150px]"
                      value={review.rating}
                      itemStyles={myStyles}
                      readOnly
                    />
                  </div>
                  <p className="text-sm font-italic text-gray-600">
                    {review.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampgroundDetails;
