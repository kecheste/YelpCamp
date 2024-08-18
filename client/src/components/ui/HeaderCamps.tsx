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
    <div className="flex bg-white items-center justify-between py-2 lg:px-6 px-4 w-full lg:my-6 my-3 gap-4 lg:gap-0 border border-gray-300 shadow-md rounded-full">
      <Link href="/app/camps" className="text-lg text-gray-800">
        YelpCamp
      </Link>
      <div className="flex items-center gap-2 lg:px-4 px-2 lg:py-2 py-1 border border-gray-300 hover:border-gray-400 rounded-full lg:w-[400px] w-full">
        <CiSearch className="text-gray-400 text-xl" />
        <input
          placeholder="Search campgrounds.."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="text-gray-600 outline-none w-full"
        />
      </div>
      <div className="flex gap-8 items-center">
        {user && (
          <div className="lg:flex items-center hidden gap-8">
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
          </div>
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
            <div className="w-[200px] lg:h-[80px] h-[140px] bg-white rounded-lg shadow-lg absolute lg:top-20 top-14 mt-2 mr-12 lg:right-20 -right-5 bottom-0 z-30 flex flex-col p-4 justify-center">
              {user && (
                <div className="flex flex-col items-start lg:hidden gap-1">
                  <Link
                    href="#"
                    className="text-md text-gray-700 hover:text-black border-b border-gray-300 w-full"
                    onClick={() => {
                      setCreateCampOpen(true);
                      setAuthWindowOpen(false);
                    }}
                  >
                    Create Campground
                  </Link>
                  <Link
                    href="#"
                    className="text-md text-gray-700 hover:text-black border-b border-gray-300 w-full"
                    onClick={() => {
                      setFavoritesOpen(true);
                      setAuthWindowOpen(false);
                    }}
                  >
                    Favorites
                  </Link>{" "}
                </div>
              )}
              <Link
                href="/app/account"
                className="text-gray-600 hover:text-black text-md border-b border-gray-300 w-full"
                onClick={() => setAuthWindowOpen(false)}
              >
                Account
              </Link>
              <Link
                href="#"
                onClick={handleLogOut}
                className="text-gray-600 mt-3 text-white text-md rounded-full bg-red-500 px-4 py-1"
              >
                Log Out
              </Link>
            </div>
          ) : (
            <div className="w-[200px] h-[70px] bg-white rounded-lg shadow-lg absolute lg:top-20 top-14 mt-2 mr-12 lg:right-20 -right-5 bottom-0 z-30 flex flex-col p-4 justify-center">
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
