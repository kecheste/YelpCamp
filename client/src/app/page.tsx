/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Details from "@/components/Details";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SignInWindow from "@/components/ui/SignInWindow";
import SignUpWindow from "@/components/ui/SignUpWindow";
import { useAuthStore } from "@/stores/authStore";
import { useAuthWindowStore } from "@/stores/authWindow";
import { useWindowStore } from "@/stores/windowStore";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function Page() {
  const signInOpen = useAuthWindowStore((state) => state.signInOpen);
  const setSignInOpen = useAuthWindowStore((state) => state.setSignInOpen);
  const signUpOpen = useAuthWindowStore((state) => state.signUpOpen);
  const setSignUpOpen = useAuthWindowStore((state) => state.setSignUpOpen);
  const isOpen = useAuthWindowStore((state) => state.isOpen);
  const setIsOpen = useAuthWindowStore((state) => state.setIsOpen);
  const getPosition = useWindowStore((state) => state.getPosition);

  const checkAuth = useAuthStore((set) => set.checkAuth);

  useEffect(() => {
    checkAuth();
    getPosition();
  }, []);

  const handleCloseWindows = () => {
    setSignInOpen(false);
    setSignUpOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="flex relative flex-col font-normal w-full h-full">
      {(signInOpen || signUpOpen || isOpen) && (
        <div
          className="absolute inset-0 bg-black opacity-50 z-20"
          onClick={() => handleCloseWindows()}
        ></div>
      )}
      <div className="bg-cover w-full h-screen bg-bottom bg-[url('/back.jpg')] px-40 py-12 flex flex-col items-center justify-between">
        <div className="w-full flex-grow relative z-20">
          <Header />
        </div>
        <Toaster />
        <Hero />
        <Details />

        {signInOpen && <SignInWindow />}
        {signUpOpen && <SignUpWindow />}
      </div>
    </div>
  );
}

export default Page;
