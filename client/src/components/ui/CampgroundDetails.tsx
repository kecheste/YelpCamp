"use client";

import dynamic from "next/dynamic";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "@smastrom/react-rating/style.css";
import { Rating, ThinStar } from "@smastrom/react-rating";
import Input from "./Input";
import { Campground, Review } from "@/interfaces/types";
import { useReviewStore } from "@/stores/reviewStore";
import toast from "react-hot-toast";
import LoadingButton from "./LoadingButton";

function CampgroundDetails({
  campground,
  setSelectedLocation,
}: {
  campground: Campground;
  setSelectedLocation: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
}) {
  const [ratingForm, setRatingForm] = useState(0);
  const [body, setBody] = useState("");
  const [locading, setLoading] = useState(false);

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
    <div className="absolute w-3/4 bg-white rounded-lg flex items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      <div className="flex w-full gap-4 p-4">
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-1/2 object-cover">
            <Carousel>
              {campground.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  className="w-[400px] max-h-[350px] object-cover"
                />
              ))}
            </Carousel>
          </div>
          <div className="text-gray-700 pl-6">
            <div className="flex items-center justify-between pr-6 mb-3">
              <h2 className="text-3xl font-bold">{campground.title}</h2>
              <div className="flex items-center gap-4">
                <Rating
                  className="max-w-[150px]"
                  value={Math.floor(campground.rating)}
                  itemStyles={myStyles}
                  readOnly
                />
                <p className="text-md mt-1">{campground.rating}/5</p>
              </div>
            </div>
            <p className="text-md text-gray-600 font-italic">
              {campground.description}
            </p>
            <p className="text-md text-gray-500 mt-4">
              <span className="font-bold">Location:</span> {campground.location}
            </p>
            <p className="text-md text-gray-500 mt-4 bg-orange-400 rounded-full px-3 py-1 text-white w-[150px] text-center">
              ${campground.price}/night
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="rounded-lg shadow-md border-2 border-white z-0 w-full h-[350px]">
            <Map
              campgrounds={[campground]}
              posix={[campground.position.lat, campground.position.lng]}
            />
          </div>
          <h2 className="text-2xl text-gray-700 font-bold">Leave a Review</h2>
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
              className="max-w-[150px]"
              value={ratingForm}
              onChange={setRatingForm}
              itemStyles={myStyles}
            />
          </div>
          <LoadingButton
            onClick={createReview}
            disabled={locading}
            loading={locading}
          >
            Create Review
          </LoadingButton>
          <div className="flex flex-wrap items-center gap-2 h-[200px] overflow-y-scroll pr-1">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="rounded-xl text-black border h-auto shadow-sm py-1 px-6 border-gray-300 flex flex-col gap-1 max-w-[330px]"
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
        </div>
      </div>
    </div>
  );
}

export default CampgroundDetails;
