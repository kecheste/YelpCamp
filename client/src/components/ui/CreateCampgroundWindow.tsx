import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { RxCross1 } from "react-icons/rx";
import LoadingButton from "./LoadingButton";
import Input from "./Input";
import { IoMdPhotos } from "react-icons/io";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { useCampStore } from "@/stores/campStore";
import toast from "react-hot-toast";
import { useWindowStore } from "@/stores/windowStore";

function CreateCampgroundWindow({
  setCreateCampOpen,
  myPosition,
  selectedLocation,
  cityName,
  country,
}: {
  setCreateCampOpen: (value: boolean) => void;
  myPosition: LatLngExpression;
  cityName: string;
  country: string;
  selectedLocation: { lat: number; lng: number };
}) {
  const [campgroundName, setCampgroundName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
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

  const createCamp = useCampStore((state) => state.createCampground);
  const setSelectedLocation = useWindowStore(
    (state) => state.setSelectedLocation
  );

  const createCampground = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCamp(
        campgroundName,
        description,
        cityName + ", " + country,
        price!.toString(),
        image!,
        selectedLocation
      );

      const { loading, error } = useCampStore.getState();

      if (loading) {
        toast.loading("Creating campground...");
      } else {
        if (error) {
          toast.dismiss();
          toast.error(error);
          setLoading(false);
        } else {
          toast.dismiss();
          toast.success("Campground created successfully");
          setLoading(false);
          setCreateCampOpen(false);
          setCampgroundName("");
          setDescription("");
          setPrice(null);
          setImage(null);
        }
      }
    } catch {
      console.error("An error occurred during creating the campground");
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <form action="/campground/create" method="post" onSubmit={createCampground}>
      <div className="absolute lg:w-auto w-full lg:h-auto h-screen bg-white rounded-lg flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 overflow-y-scroll p-2 py-4 pt-12 lg:p-0">
        <div className="flex flex-col divide-y divide-gray-400 items-center gap-4 w-full">
          <div className="flex items-center gap-6 px-4 pt-2 self-start w-full">
            <div
              className="cursor-pointer"
              onClick={() => setCreateCampOpen(false)}
            >
              <RxCross1 size={20} color="black" />
            </div>
            <p className="text-black">Create Campground</p>
          </div>

          <div className="flex lg:flex-row flex-col gap-2 w-full">
            <div className="flex lg:gap-4 gap-2 flex-col lg:px-2 py-4 lg:px-6">
              <Input
                value={campgroundName}
                onChange={(e) => setCampgroundName(e.target.value)}
                placeholder="Campground Name"
                name="campgroundName"
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
                value={price!}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                placeholder="Price"
                name="price"
                type="number"
              />
            </div>
            <div className="flex flex-col gap-4 lg:mr-6">
              <div className="lg:w-[600px] w-full lg:h-[300px] h-[250px] rounded-lg z-0 lg:my-4 shadow-sm">
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
          <div className="w-full lg:mb-3 mb-6 pt-3 lg:px-6">
            <LoadingButton
              onClick={createCampground}
              disabled={loading}
              loading={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
            >
              Create Campground
            </LoadingButton>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateCampgroundWindow;
