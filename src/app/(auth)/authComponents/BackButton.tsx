import Image from "next/image";
import React from "react";
import { useRouter} from "next/navigation";

export default function BackButton() {
      const router = useRouter();
  return (
    <div onClick={() => router.back()} className="cursor-pointer mb-3">
      <Image
        src="/authIcons/authBack-button.svg"
        height={24}
        width={24}
        className="h-10 w-10"
        alt="left-arrows"
      />
    </div>
  );
}
