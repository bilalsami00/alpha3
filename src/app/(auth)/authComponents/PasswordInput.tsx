"use client";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Image from "next/image";

type Props = {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  error?: string;
  className?: string; // input wrapper width
};

export default function PasswordInput({
  label, required, value, onChange, onBlur, onFocus, placeholder, error,
  className = "w-full 2xl:w-[496px]",
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="">
      <label className="block txt-16 font-normal mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className={`relative w-full h-full ${className}`}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          className={`${className} 2xl:h-[56px] rounded-lg bg-[#F2F5F6] p-3 pr-12 txt-14 outline-none transition-all duration-300 ${
            error
              ? "border border-[#F14D4D] bg-[rgba(241,77,77,0.08)]"
              : "border border-transparent focus:border-[#224674] focus:bg-[#C8E4FC80]"
          }`}
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <button type="button" onClick={() => setShow((s) => !s)} className="text-[#51595A] hover:text-gray-700 focus:outline-none">
            {show ? <RiEyeLine className="txt-24 cursor-pointer text-[#224674]" /> : <RiEyeOffLine className="txt-24 cursor-pointer text-[#224674]" />}
          </button>
        </div>
      </div>

      <p className={`text-[#F14D4D] flex gap-1 text-xs mt-1 transition-opacity duration-100 ${
        error ? "opacity-100" : "opacity-0"
      }`}>
        <Image src="/authIcons/info-circle.svg" alt="warning" width={16} height={16} /> {error ?? "\u00A0"}
      </p>
    </div>
  );
}
