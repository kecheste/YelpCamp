import React, { useMemo, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import LoadingButton from "./LoadingButton";
import Input from "./Input";
import { IoMdPhotos } from "react-icons/io";
import dynamic from "next/dynamic";
import { useWindowStore } from "@/stores/windowStore";
import { Campground } from "@/interfaces/types";
import { useCampStore } from "@/stores/campStore";
import toast from "react-hot-toast";

function EditCampgroundWindow({
  campground,
  cityName,
  country,
}: {
  campground: Campground | undefined;
  cityName: string;
  country: string;
}) {
  const [title, setTitle] = useState(campground?.title);
  const [description, setDescription] = useState(campground?.description);
  const [price, setPrice] = useState<number>(campground?.price || 0);
  const [image, setImage] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map/"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const updateCamp = useCampStore((state) => state.updateCampground);
  const deleteCamp = useCampStore((state) => state.deleteCampground);
  const loadingDelete = useCampStore((state) => state.loading);

  const setEditWindowOpen = useWindowStore((state) => state.setEditWindowOpen);
  const setSelectedLocation = useWindowStore(
    (state) => state.setSelectedLocation
  );
  const selectedLocation = useWindowStore((state) => state.selectedLocation);

  const updateCampground = async () => {
    setLoading(true);
    try {
      await updateCamp(
        campground!._id,
        title!,
        description!,
        cityName + ", " + country,
        price!.toString(),
        selectedLocation
      );

      const { loading, error } = useCampStore.getState();

      if (loading) {
        toast.loading("Updating campground...");
      } else {
        if (error) {
          toast.dismiss();
          toast.error(error);
          setLoading(false);
        } else {
          toast.dismiss();
          toast.success("Campground updated successfully");
          setLoading(false);
          setEditWindowOpen(false);
          setTitle("");
          setDescription("");
          setPrice(0);
          setImage(null);
        }
      }
    } catch {
      console.error("An error occurred during updating the campground");
      setLoading(false);
    }

    setLoading(false);
  };

  const deleteCampground = async () => {
    try {
      await deleteCamp(campground!._id);

      const { loading, error } = useCampStore.getState();

      if (loading) {
        toast.loading("Deleting campground...");
      } else {
        if (error) {
          toast.dismiss();
          toast.error(error);
        } else {
          toast.dismiss();
          toast.success("Campground deleted successfully");
          setEditWindowOpen(false);
        }
      }
    } catch {
      console.error("An error occurred during deleting the campground");
      toast.error("An error occurred during deleting the campground");
    }
  };

  return (
    <div className="absolute w-auto h-auto bg-white rounded-lg flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      <div className="flex flex-col divide-y divide-gray-400 items-center gap-4">
        <div className="flex items-center gap-6 px-4 pt-2 self-start w-full">
          <div
            className="cursor-pointer"
            onClick={() => setEditWindowOpen(false)}
          >
            <RxCross1 size={20} color="black" />
          </div>
          <p className="text-black">Edit Campground</p>
        </div>

        <div className="flex gap-2">
          <div className="flex gap-4 flex-col px-2 py-4 sm:px-4 lg:px-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Campground Name"
              name="title"
              type="text"
            />
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-5">
              <div className="text-center">
                <IoMdPhotos className="mx-auto h-12 w-12 text-gray-300" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-600 focus-within:ring-offset-2 hover:text-sky-500"
                  >
                    <span>Upload an image</span>
                    <input
                      id="file-upload"
                      name="image"
                      onChange={(e) => setImage(e.target.files)}
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block px-4 py-2 w-full rounded-md border border-gray-300 focus:border-gray-400 py-1.5 text-gray-500 shadow-sm placeholder:text-gray-400 text-md outline-none"
              defaultValue={""}
            />
            <Input
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              placeholder="Price"
              name="price"
              type="number"
            />
          </div>
          <div className="flex flex-col gap-4 mr-6">
            <div className="w-[600px] h-[300px] rounded-lg z-0 my-4 shadow-sm">
              <Map
                setSelectedLocation={setSelectedLocation}
                posix={selectedLocation}
                zoom={14}
              />
            </div>
            <Input
              value={cityName + ", " + country}
              onChange={(e) => {}}
              placeholder="Location"
              disabled
              name="location"
              type="text"
            />
          </div>
        </div>
        <div className="w-full mb-3 pt-3 px-6 flex items-center gap-2">
          <LoadingButton
            onClick={() => updateCampground()}
            disabled={loading}
            loading={loading}
          >
            Edit Campground
          </LoadingButton>
          <LoadingButton
            onClick={() => deleteCampground()}
            disabled={loadingDelete}
            loading={loadingDelete}
            className="transition-colors w-full bg-red-400 text-white font-medium px-4 py-3 rounded-md hover:bg-red-500 disabled:bg-red-300"
          >
            Delete Campground
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

export default EditCampgroundWindow;
