'use client'

import OvalLoader from "@/components/utility/OvalLoader";
import MazindaLogoFull from "@/public/logo_mazinda.png";
import Image from "next/image";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <Image
          className="my-4 mt-12"
          src={MazindaLogoFull}
          alt="Mazinda Logo"
        />
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-semibold text-center mb-6">
            Hang On ... 
          </h1>
        </div>

        <div className="flex items-center justify-center"><OvalLoader /></div>
      </div>
    </>
  );
};

export default Loading;
