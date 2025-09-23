// src\app\(auth)\new-password\page.tsx
"use client";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { GoArrowLeft } from "react-icons/go";

import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import SideAnimation from "../authComponents/SideAnimation";
type ErrorState = {
  password?: string;
  confirmPassword?: string;
};
export default function CreateNewPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): ErrorState => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };
  const isFormValid = (): boolean => {
    const validation = validateForm();
    return Object.keys(validation).length === 0;
    // check if the object is empty so the form is valid then return true otherwise return false
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    router.push("/login");
  };

  useEffect(() => {
    setEmail(localStorage.getItem("peptide_user_email") || "");
    console.log("🔁 email ===>", email);
    // if (!email || email === null ) {
    //   router.push("/Login");
    // }
  }, [email]);

  return (
    <div className="min-h-[100vh] flex flex-col  md:flex-row items-stretch   gap-10 xl:gap-20 2xl:gap-32 pt-10 pl-6 xl:pl-10 pr-6 xl:pr-20 pb-10">
      {/* === Left Section === */}
      <SideAnimation />
      {/* Right Section */}
      <div className=" w-full md:w-[50%] flex self-center ">
        <div className="   bg-white  mx-auto md:mx-0 ">
          {/* Back Button */}
          <div
            onClick={() => router.back()}
            className="cursor-pointer mb-1 lg:mb-6"
          >
            <GoArrowLeft className="h-8 w-8" />
          </div>

          <form noValidate className="space-y-2" onSubmit={handlePasswordReset}>
            <h2 className="txt-32 font-bold mb-2 text-[#25292A]">
              Create a New Password
            </h2>
            <p className="txt-16 text-[#51595A] mb-1 lg:mb-6 w-full 2xl:w-[496px]">
              Create a strong password. Make it something only you would know.
            </p>

            {/* Password Field */}
            <div>
              <label className="block txt-14 font-normal mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full h-full 2xl:w-[496px]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  onBlur={() => {
                    const validationErrors = validateForm();
                    setErrors((prev) => ({
                      ...prev,
                      password: validationErrors.password,
                    }));
                  }}
                  className={`w-full 2xl:w-[496px] 2xl:h-[56px] rounded-lg bg-[#F2F5F6] p-3 pr-12 txt-12 outline-none transition-all duration-300 ${
                    errors.password
                      ? "border border-[#F14D4D] bg-[rgba(241,77,77,0.08)]"
                      : "border border-transparent focus:border-[#224674] focus:bg-[#C8E4FC80]"
                  }`}
                  placeholder="Enter new password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />

                <div className="absolute inset-y-0 right-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#51595A] hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <RiEyeLine className="cursor-pointer txt-24 text-[#9EA9AA]" />
                    ) : (
                      <RiEyeOffLine className="cursor-pointer txt-24 text-[#9EA9AA]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password error — only rendered when present */}
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-red-500 text-xs mt-1 mb-1"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block txt-14 font-normal mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full h-full 2xl:w-[496px]">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => {
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  onBlur={() => {
                    const validationErrors = validateForm();
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validationErrors.confirmPassword,
                    }));
                  }}
                  className={`w-full 2xl:w-[496px] 2xl:h-[56px] rounded-lg bg-[#F2F5F6] p-3 pr-12 txt-12 outline-none transition-all duration-300 ${
                    errors.confirmPassword
                      ? "border border-[#F14D4D] bg-[rgba(241,77,77,0.08)]"
                      : "border border-transparent focus:border-[#224674] focus:bg-[#C8E4FC80]"
                  }`}
                  placeholder="Enter confirm password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                />

                <div className="absolute inset-y-0 right-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#51595A] hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <RiEyeLine className="cursor-pointer txt-24 text-[#9EA9AA]" />
                    ) : (
                      <RiEyeOffLine className="cursor-pointer txt-24 text-[#9EA9AA]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password error — only rendered when present */}
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  role="alert"
                  className="text-red-500 text-xs mt-1 mb-1"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full txt-18 2xl:w-[496px] 2xl:h-[56px] py-3 rounded-lg font-semibold transition mt-4 ${
                isFormValid()
                  ? "bg-[#25292A] text-white cursor-pointer"
                  : "bg-[#25292A] text-white cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
