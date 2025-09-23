// src\app\(auth)\forget-password\page.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SideAnimation from "../authComponents/SideAnimation";
// import { FaArrowLeft } from "react-icons/fa6";
import { GoArrowLeft } from "react-icons/go";


export default function EmailVerification() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!isValidEmail(email)) {
  //     setError("Please enter a valid email address.");
  //     return;
  //   }

  //   setError(null);
  //   setIsSubmitting(true);
  //   try {
  //     // 🔁 Send OTP
  //     const otpResponse = await fetch(
  //       "https://peptide-backend.mazedigital.us/users/v1_mobile_check-email",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email }),
  //       }
  //     );

  //     const otpResult = await otpResponse.json();

  //     if (otpResult.status === "success") {
  //       document.cookie = `otp_email=${encodeURIComponent(
  //         email
  //       )}; Path=/; Max-Age=600; SameSite=Lax`;

  //       // ✅ history me OTP na rahe → back pe wapas na aaye
  //       router.replace("/otp?from=forgetpassword");
  //       // localStorage.setItem("peptide_user_email", email);
  //       // router.push("/otp?from=forgetpassword");
  //     } else {
  //       alert("Please enter a valid email address." + otpResult.message);
  //     }
  //   } catch (error) {
  //     console.error("🔁 error ===>", error);
  //     if (error instanceof Error) {
  //       alert("Please enter a valid email address." + error.message);
  //     } else {
  //       alert("Please enter a valid email address. An unknown error occurred.");
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // optionally store email even if invalid:
  document.cookie = `otp_email=${encodeURIComponent(email)}; Path=/; Max-Age=600; SameSite=Lax`;

  // router.replace("/otp?from=forgetpassword");
    router.push("/otp?from=forgetpassword");

};



  return (
    <div
      // className=" min-h-[100vh] flex flex-col  md:flex-row items-stretch gap-10 xl:gap-20 2xl:gap-32 pt-10 pl-6 xl:pl-10 pr-6 xl:pr-20 pb-10 2xl:pb-20  "
      className=" min-h-[100vh] flex flex-col  md:flex-row items-stretch   gap-10 xl:gap-20 2xl:gap-32 pt-10 pl-6 xl:pl-10 pr-6 xl:pr-20 pb-10  "
    >
      {/* <Toaster position="top-center" /> */}
      {/* === Left Section === */}
      <SideAnimation />
      {/* Right Section */}
      <div className=" w-full md:w-[50%] flex self-center ">
        {/* <div className="   bg-white  mx-auto md:mx-0 "> */}
                <div className="bg-white w-full max-w-[496px] mx-auto md:mx-0 px-0">

          {/* Back Button */}
          <div onClick={() => router.back()} className="cursor-pointer mb-6">
            <GoArrowLeft className="h-8 w-8"/>
          </div>

          <h2 className="txt-32 font-bold mb-4  text-[#25292A]">
            Email Verification
          </h2>
          <p className="txt-16  mb-6">
            Enter your email address to verify your account.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block txt-14 font-medium mb-1">
                Email Address
                {/* <span className="text-red-500">*</span> */}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (!isValidEmail(value)) {
                    setError("Please enter a valid email address.");
                  } else {
                    setError(null);
                  }
                }}
                placeholder="Enter email address"
                className={`w-full txt-12 rounded-md bg-[#F2F5F6] p-3 2xl:w-[496px] 2xl:h-[56px] txt-14 outline-none
                    ${
                      error
                        ? "border border-red-500"
                        : "border border-transparent focus:border-[#224674] focus:bg-[#C8E4FC80]"
                    }`}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={` w-full txt-18 py-3 2xl:w-[496px] 2xl:h-[56px] rounded-lg font-semibold transition ${
                !email || error
                  ? // ? "bg-[#D8DFE0] cursor-not-allowed text-[#9EA9AA]"
                    // : "bg-[#224674] text-white cursor-pointer"
                    " bg-[#25292A] text-white cursor-not-allowed"
                  : "bg-[#25292A] text-white cursor-pointer"
              }`}
              disabled={!email || !!error || isSubmitting}
            >
              {/* {isSubmitting ? (
                <img
                  src="/homePage/loader.gif"
                  alt="Loading..."
                  className="w-6 h-6 mx-auto bg-[#224674] "
                />
              ) : ( */}
              Continue
              {/* )} */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
