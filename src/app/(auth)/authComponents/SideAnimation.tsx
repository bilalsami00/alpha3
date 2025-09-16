import Image from "next/image";
import React from "react";

export default function SideAnimation() {
  return (
    <div className="  md:flex max-w-[823px] w-full md:w-[48%] xl:w-[55%] max-h-[944px] lg:h-auto self-center lg:self-stretch  rounded-[48px]  items-center justify-center">
      <div className="relative w-full h-full rounded-[16px] overflow-hidden">
        {/* <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0  object-cover"
        >
          <source src="/authIcons/authVid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <div className="absolute inset-0 bg-[linear-gradient(104.99deg,_#FFD700_0.6%25,_#00C47E_100.6%25)] "></div>
        <div className="relative w-full h-full z-10 flex items-center justify-center  ">
          <Image
            priority
            src="/authIcons/Alpha-logo.png"
            // /authIcons/authBack-button.svg
            alt="PeptideMD Logo"
            width={256}
            height={256}
            className="w-auto h-auto max-lg:p-20 object-contain "
          />
        </div>
      </div>
    </div>
  );
}
