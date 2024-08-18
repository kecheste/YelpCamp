import React from "react";

function Hero() {
  return (
    <div className="text-center flex-grow">
      <div className="flex flex-col gap-1 items-center justify-center">
        <p className="lg:text-3xl text-5xl">Your Adventure Begins Here!</p>
        <p className="lg:text-md text-sm text-gray-200 lg:text-gray-100">
          Discover the Greatest Outdoors
        </p>
      </div>
    </div>
  );
}

export default Hero;
