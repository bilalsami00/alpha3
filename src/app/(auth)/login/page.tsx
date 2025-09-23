// src\app\(auth)\login\page.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SideAnimation from "../authComponents/SideAnimation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Enter email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    return newErrors;
  };

  const isFormValid = () => {
    const currentErrors = validate();
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    router.push("/dashboard/users");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const message = data?.message || "Login failed. Try again.";
        toast.error(message);
        return;
      }
      if (data?.user) {
        // saveUserToStorage(data.user);
      }

      toast.success("Login successful!");

      const redirectPath = data.isOnboardingIncomplete
        ? "/on-board"
        : "/dashboard";
      router.push(redirectPath);
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" min-h-[100vh] flex flex-col  md:flex-row items-stretch   gap-10 xl:gap-20 2xl:gap-32 pt-10 pl-6 xl:pl-10 pr-6 xl:pr-20 pb-10  ">
      <Toaster position="top-center" />
      {/* === Left Section  === */}
      <SideAnimation />
      {/* Right Section */}
      <div className=" w-full md:w-[50%] flex self-center ">
        <div className=" flex flex-col justify-center w-full max-w-[498px]  bg-white  mx-auto md:mx-0 ">
          {/* Login Form */}
          <h2 className="txt-32 font-bold mb-6 text-[#25292A]">Log In</h2>
          <form noValidate className="space-y-2" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block txt-14 font-normal mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => {
                  // Just entering the field hides the error
                  if (errors.email) {
                    setErrors((prev) => ({
                      ...prev,
                      email: undefined,
                    }));
                  }
                }}
                onBlur={() => {
                  const validationErrors = validate();
                  setErrors((prev) => ({
                    ...prev,
                    email: validationErrors.email,
                  }));
                }}
                className={`w-full txt-12 2xl:w-[496px] 2xl:h-[56px] rounded-lg bg-[#F2F5F6] p-3 pr-12 txt-14 outline-none transition-all duration-300 ${
                  errors.email
                    ? "border border-[#F14D4D] bg-[rgba(241,77,77,0.08)]"
                    : "border border-transparent focus:border-[#224674] focus:bg-[#C8E4FC80]"
                }`}
                placeholder="Enter email address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {/* Email error (only rendered when present) */}
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block txt-14 font-medium mb-1">Password</label>
              <div className="relative w-full 2xl:w-[496px]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPassword(v);
                    // clear password error while typing
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  onBlur={() => {
                    // validate password on blur so error becomes visible even when submit is disabled
                    const validationErrors = validate();
                    setErrors((prev) => ({
                      ...prev,
                      password: validationErrors.password,
                    }));
                  }}
                  className={`w-full txt-12 2xl:w-[496px] 2xl:h-[56px] rounded-lg bg-[#F2F5F6] p-3 pr-12 txt-14 outline-none border ${
                    errors.password
                      ? "border-red-500"
                      : "border-transparent focus:border-[#224674] focus:bg-[#C8E4FC80]"
                  }`}
                  placeholder="Enter password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
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

              {/* Password error (only rendered when present) */}
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="w-full 2xl:w-[496px] mt-1 flex justify-end">
              <Link
                href="/forget-password"
                className="txt-16 font-semibold text-right"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full mt-4 txt-18 2xl:w-[496px] 2xl:h-[56px] py-3 rounded-lg font-semibold transition ${
                !isFormValid()
                  ? " bg-[#25292A] text-white cursor-not-allowed"
                  : "bg-[#25292A] text-white cursor-pointer"
              }`}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
