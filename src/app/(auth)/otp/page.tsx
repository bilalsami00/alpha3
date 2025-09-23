// src\app\(auth)\otp\page.tsx
"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SideAnimation from "../authComponents/SideAnimation";
import { GoArrowLeft } from "react-icons/go";

import { Toaster, toast } from "react-hot-toast";

export const dynamic = "force-dynamic";

function FiveDigitVerifyInner() {
  const DIGITS = 5; // changed to 5
  const [code, setCode] = useState(Array(DIGITS).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  // add an "active" flag
  const [isActive, setIsActive] = useState(true);

  // start/stop interval based on isActive
  useEffect(() => {
    if (!isActive) return; // nothing to do

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // stop when we reach 0
          clearInterval(id);
          setIsActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isActive]);

  // when user clicks resend
  const handleResendCode = () => {
    setSecondsLeft(30);
    setIsActive(true); // <- restart the interval
  };

  const isFormValid = () => {
    return code.every((digit) => digit !== "");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    // allow only digits
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      // if user cleared input, update state
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    const newCode = [...code];
    newCode[index] = value[0];
    setCode(newCode);

    // move focus to next if exists
    if (index < DIGITS - 1 && value) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const newCode = [...code];

    if (e.key === "Backspace") {
      if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        // clear previous and focus it
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "Delete") {
      newCode[index] = "";
      setCode(newCode);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < DIGITS - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .slice(0, DIGITS)
      .replace(/\D/g, "");
    if (pasted.length > 0) {
      const newCode = pasted.split("");
      // If pasted is shorter than DIGITS, fill remaining with "" so length matches
      while (newCode.length < DIGITS) newCode.push("");
      setCode(newCode);
      // focus last filled input (or last index)
      const lastIndex = Math.min(pasted.length, DIGITS) - 1;
      if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const verificationCode = code.join("");

    if (verificationCode.length !== DIGITS) {
      // invalid length — keep UX simple
      setIsSubmitting(false);
      return;
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        if (from === "signup") {
          router.push("/Dashboard"); // Navigate to dashboard
        } else if (from === "forgetpassword") {
          router.push("/new-password");
        } else {
          router.push("/");
        }
      }, 1000);
    }
  };

  return (
    <div className=" min-h-[100vh] flex flex-col  md:flex-row items-stretch   gap-10 xl:gap-20 2xl:gap-32 pt-10 pl-6 xl:pl-10 pr-6 xl:pr-20 pb-10  ">
      <Toaster position="top-center" />
      {/* === Left Section === */}
      <SideAnimation />
      {/* Right Section */}
      <div className=" w-full md:w-[50%] flex self-center ">
        <div className="   bg-white  mx-auto md:mx-0 ">
          {/* Back Button */}
          <div onClick={() => router.back()} className="cursor-pointer mb-6">
            <GoArrowLeft className="h-8 w-8" />
          </div>

          <h2 className="txt-32 font-bold mb-2 text-[#25292A]">
            Verification Code
          </h2>
          <p className="txt-16 text-[#51595A] mb-6 w-full 2xl:w-[496px]">
            Enter {DIGITS} digit verification code sent to your email address.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="w-full 2xl:w-[496px] 2xl:h-[56px] flex justify-center gap-2 lg:gap-3 mb-6">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  className="w-14 h-14  max-sm:w-8 max-sm:h-8 max-lg:w-10 max-lg:h-10 text-center txt-16 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-50"
                />
              ))}
            </div>

            <div className="text-center mb-6">
              {secondsLeft > 0 ? (
                <div className="  txt-16 font-[400] leading-[100%] font-[Afacad Flux]">
                  0:
                  {secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="text-[#51595A] txt-16   leading-[100%]   transition"
                  >
                    Didn’t receive the code?
                  </button>{" "}
                  <span
                    onClick={handleResendCode}
                    className="font-semibold txt-16 cursor-pointer"
                  >
                    Resend Code
                  </span>
                </>
              )}
            </div>

            <button
              type="submit"
              className={`w-full txt-18 2xl:w-[496px] 2xl:h-[56px] py-3 rounded-full font-semibold transition ${
                !isFormValid()
                  ? " bg-[#25292A] text-white cursor-not-allowed"
                  : "bg-[#25292A] text-white cursor-pointer"
              }`}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function FiveDigitVerify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FiveDigitVerifyInner />
    </Suspense>
  );
}
