import { useAuthStore } from "@/stores/authStore";
import { useAuthWindowStore } from "@/stores/authWindow";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

function Header() {
  const user = useAuthStore((set) => set.user);
  const logout = useAuthStore((set) => set.logout);

  const setSignInOpen = useAuthWindowStore((state) => state.setSignInOpen);
  const setSignUpOpen = useAuthWindowStore((state) => state.setSignUpOpen);
  const isOpen = useAuthWindowStore((state) => state.isOpen);
  const setIsOpen = useAuthWindowStore((state) => state.setIsOpen);

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
          setIsOpen(false);
          redirect("/app/camps");
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred during logout");
    }
  };

  return (
    <div className="flex justify-between items-center relative">
      <a href="/" className="text-lg text-gray-100">
        YelpCamp
      </a>
      <div className="flex lg:gap-8 gap-4 items-center">
        <Link
          href="/app/camps"
          className="text-sm text-gray-200 hover:text-white"
        >
          CAMPGROUNDS
        </Link>
        {/* <Link
          href="/app/camps"
          className="text-sm text-gray-200 hover:text-white"
        >
          EVENTS
        </Link> */}
        <div
          className="flex gap-2 shadow-lg items-center rounded-full py-1 px-1.5 bg-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div></div>
          <RxHamburgerMenu size={16} className="text-gray-600" />
          <IoPersonCircleSharp size={32} className="text-gray-500" />
        </div>
        {isOpen &&
          (user ? (
            <div className="w-[200px] h-[70px] bg-white rounded-lg shadow-lg absolute top-12 right-0 bottom-0 flex flex-col p-4 justify-center">
              <Link
                href="/app/account"
                className="text-gray-600 hover:text-black text-md"
              >
                Account
              </Link>
              <Link
                href="#"
                onClick={() => {
                  handleLogOut();
                  setIsOpen(false);
                }}
                className="text-gray-600 hover:text-black text-md"
              >
                Log Out
              </Link>
            </div>
          ) : (
            <div className="w-[200px] h-[70px] bg-white rounded-lg shadow-lg absolute top-12 right-0 bottom-0 flex flex-col p-4 justify-center">
              <a
                href="#"
                className="text-gray-600 hover:text-black text-md"
                onClick={() => {
                  setIsOpen(false);
                  setSignUpOpen(true);
                }}
              >
                Sign Up
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-black text-md"
                onClick={() => {
                  setIsOpen(false);
                  setSignInOpen(true);
                }}
              >
                Log In
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Header;
