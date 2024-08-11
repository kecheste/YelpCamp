import React from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useAuthWindowStore } from "@/stores/authWindow";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { useWindowStore } from "@/stores/windowStore";

function HeaderCamps({
  handleSearch,
}: {
  handleSearch: (value: string) => void;
}) {
  const user = useAuthStore((set) => set.user);
  const logout = useAuthStore((set) => set.logout);

  const setFavoritesOpen = useWindowStore((state) => state.setFavoritesOpen);
  const setCreateCampOpen = useWindowStore((state) => state.setCreateCampOpen);
  const query = useWindowStore((state) => state.query);

  const setSignInOpen = useAuthWindowStore((state) => state.setSignInOpen);
  const setSignUpOpen = useAuthWindowStore((state) => state.setSignUpOpen);
  const authWindowOpen = useAuthWindowStore((state) => state.isOpen);
  const setAuthWindowOpen = useAuthWindowStore((state) => state.setIsOpen);

  const handleOpenSignIn = () => {
    setSignInOpen(true);
    setAuthWindowOpen(false);
  };

  const handleOpenSignUp = () => {
    setSignUpOpen(true);
    setAuthWindowOpen(false);
  };

  const handleLogOut = async () => {
    try {
      await logout();

      const { loading, user, error } = useAuthStore.getState();

      if (loading) {
        toast.loading("Logging out...");
      } else {
        if (user) {
          toast.dismiss();
          toast.error("Logout failed");
        } else if (error) {
          toast.dismiss();
          toast.error(error);
        } else {
          toast.dismiss();
          toast.success("Logged out successfully");
          setAuthWindowOpen(false);
          redirect("/app/camps");
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred during logout");
    }
  };

  return (
    <div className="flex bg-white items-center justify-between py-2 px-6 w-full my-6 border border-gray-300 shadow-md rounded-full">
      <Link href="/app/camps" className="text-lg text-gray-800">
        YelpCamp
      </Link>
      <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-full w-[400px]">
        <CiSearch size={20} className="text-gray-400" />
        <input
          placeholder="Search campgrounds.."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="text-gray-600 outline-none w-full"
        />
      </div>
      <div className="flex gap-8 items-center">
        {user && (
          <>
            <Link
              href="#"
              className="text-sm text-gray-700 hover:text-black"
              onClick={() => setCreateCampOpen(true)}
            >
              Create Campground
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-700 hover:text-black"
              onClick={() => setFavoritesOpen(true)}
            >
              Favorites
            </Link>{" "}
          </>
        )}
        <div
          className="flex gap-2 shadow-lg items-center rounded-full py-1 px-1.5 bg-white cursor-pointer"
          onClick={() => setAuthWindowOpen(!authWindowOpen)}
        >
          <div></div>
          <RxHamburgerMenu size={16} className="text-gray-600" />
          <IoPersonCircleSharp size={32} className="text-gray-500" />
        </div>
        {authWindowOpen &&
          (user ? (
            <div className="w-[200px] h-[70px] bg-white rounded-lg shadow-lg absolute top-20 mt-2 mr-12 right-20 bottom-0 z-30 flex flex-col p-4 justify-center">
              <Link
                href="/app/account"
                className="text-gray-600 hover:text-black text-md"
                onClick={() => setAuthWindowOpen(false)}
              >
                Account
              </Link>
              <Link
                href="#"
                onClick={handleLogOut}
                className="text-gray-600 hover:text-black text-md"
              >
                Log Out
              </Link>
            </div>
          ) : (
            <div className="w-[200px] h-[70px] bg-white rounded-lg shadow-lg absolute top-20 mt-2 mr-12 right-20 bottom-0 z-30 flex flex-col p-4 justify-center">
              <a
                href="#"
                onClick={handleOpenSignUp}
                className="text-gray-600 hover:text-black text-md"
              >
                Sign Up
              </a>
              <a
                href="#"
                onClick={handleOpenSignIn}
                className="text-gray-600 hover:text-black text-md"
              >
                Log In
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HeaderCamps;
