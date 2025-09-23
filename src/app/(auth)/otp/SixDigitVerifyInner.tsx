// "use client";

// import { useEffect, useRef, useState, useCallback, memo } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Toaster, toast } from "react-hot-toast";
// import SideAnimation from "../authComponents/SideAnimation";

// const CODE_LENGTH = 5;

// function SixDigitVerifyInnerBase({
//   email,
//   from,
// }: {
//   email: string;
//   from?: string;
// }) {
//   const router = useRouter();
//   const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [secondsLeft, setSecondsLeft] = useState(30);
//   const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // ✅ log only once (not every render)
//   //   useEffect(() => {
//   //     console.log("email ===>", email);
//   //     console.log("from ===>", from);
//   //   }, [email, from]);

//   // ✅ setInterval only once; use functional updater
//   useEffect(() => {
//     intervalRef.current = setInterval(() => {
//       setSecondsLeft((s) => {
//         if (s <= 1) {
//           if (intervalRef.current) {
//             clearInterval(intervalRef.current);
//             intervalRef.current = null;
//           }
//           return 0;
//         }
//         return s - 1;
//       });
//     }, 1000);
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   const isFormValid = useCallback(() => code.every((d) => d !== ""), [code]);

//   const handleResendCode = useCallback(async () => {
//     try {
//       const response = await fetch(
//         "https://peptide-backend.mazedigital.us/users/v1_mobile_check-email",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );
//       const result = await response.json();
//       if (!response.ok || result?.status !== "success") {
//         toast.error(result?.message || "Failed to resend code.");
//         return;
//       }
//       toast.success("OTP sent again!");
//       setSecondsLeft(30);
//       // restart interval if needed
//       if (!intervalRef.current) {
//         intervalRef.current = setInterval(() => {
//           setSecondsLeft((s) => {
//             if (s <= 1) {
//               if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//                 intervalRef.current = null;
//               }
//               return 0;
//             }
//             return s - 1;
//           });
//         }, 1000);
//       }
//     } catch {
//       toast.error("Network error while resending code.");
//     }
//   }, [email]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
//       const v = e.target.value.replace(/\D/g, "");
//       if (!v) return;
//       setCode((prev) => {
//         const next = [...prev];
//         next[idx] = v[0];
//         return next;
//       });
//       if (idx < CODE_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
//     },
//     []
//   );

//   const handleKeyDown = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
//       setCode((prev) => {
//         const next = [...prev];
//         if (e.key === "Backspace") {
//           if (next[idx]) next[idx] = "";
//           else if (idx > 0) {
//             next[idx - 1] = "";
//             inputsRef.current[idx - 1]?.focus();
//           }
//         } else if (e.key === "Delete") {
//           next[idx] = "";
//         } else if (e.key === "ArrowLeft" && idx > 0) {
//           inputsRef.current[idx - 1]?.focus();
//         } else if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) {
//           inputsRef.current[idx + 1]?.focus();
//         }
//         return next;
//       });
//     },
//     []
//   );

//   const handlePaste = useCallback(
//     (e: React.ClipboardEvent<HTMLInputElement>) => {
//       e.preventDefault();
//       const pasted = e.clipboardData
//         .getData("text")
//         .replace(/\D/g, "")
//         .slice(0, CODE_LENGTH);
//       if (!pasted) return;
//       const arr = Array(CODE_LENGTH).fill("");
//       for (let i = 0; i < pasted.length; i++) arr[i] = pasted[i];
//       setCode(arr);
//       inputsRef.current[Math.min(pasted.length, CODE_LENGTH) - 1]?.focus();
//     },
//     []
//   );

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (isSubmitting) return;

//       const verificationCode = code.join("");
//       if (!verificationCode || verificationCode.length !== CODE_LENGTH) {
//         toast.error(`Please enter a valid ${CODE_LENGTH}-digit code.`);
//         return;
//       }

//       setIsSubmitting(true);
//       try {
//         const response = await fetch(
//           "https://peptide-backend.mazedigital.us/users/v1_mobile_verify-otp",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, otp: verificationCode }),
//           }
//         );
//         const result = await response.json();

//         // ✅ Cleanup OTP email storage
//         try {
//           await fetch("/api/auth/clear-otp-cookie", { method: "POST" });
//         } catch (err) {
//           console.error("Failed to clear cookie", err);
//         }

//         if (result.status === "success") {
//           toast.success("OTP verified!");
//           if (from === "signup") {
//             document.cookie =
//               "onboard_gate=1; Path=/; Max-Age=900; SameSite=Lax";
//             router.replace("/on-board"); // replace use karo -> back se OTP pe na jaye
//           } else if (from === "forgetpassword") {
//             document.cookie =
//               "onNewPassword_gate=1; Path=/; Max-Age=900; SameSite=Lax";
//             router.replace("/new-password");
//           } else router.replace("/");
//         } else {
//           const msg = (result?.message || "").toLowerCase();
//           if (msg.includes("otp") || msg.includes("expired")) {
//             toast.error("Invalid or expired OTP. Please try again.");
//           } else {
//             toast.error(result?.message || "OTP verification failed.");
//           }
//         }
//       } catch {
//         toast.error("Network error. Please try again.");
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [code, email, from, isSubmitting, router]
//   );

//   return (
//     <div className="min-h-[100vh] flex flex-col md:flex-row items-stretch gap-10 xl:gap-20 2xl:gap-32 pt-10 pl-6 xl:pl-10 pr-6 xl:pr-20 pb-10 2xl:pb-20">
//       <Toaster position="top-center" />
//       <SideAnimation />

//       <div className="w-full md:w-[50%] flex self-center">
//         <div className="bg-white mx-auto md:mx-0">
//           <div className="cursor-pointer mb-3">
//             <Link href="/login">
//               <Image
//                 src="/authIcons/authBack-button.svg"
//                 height={24}
//                 width={24}
//                 className="h-10 w-10"
//                 alt="back"
//               />
//             </Link>
//           </div>

//           <div className="p-2 bg-[#DD6F941F] border-[#DD6F94] border-1 rounded-xl flex items-center justify-center w-fit lg:w-15 lg:h-15 mb-6">
//             <img
//               src="/authIcons/password-check.png"
//               alt="SMS Icon"
//               className="w-10 h-10 object-contain"
//             />
//           </div>

//           <h2 className="txt-32 font-semibold mb-2 text-[#25292A]">
//             Enter Verification Code
//           </h2>
//           <p className="txt-20 text-[#51595A] mb-6 w-full 2xl:w-[496px]">
//             Please enter the verification code sent to{" "}
//             <span className="text-[#224674]">{email}</span>.
//           </p>

//           <form onSubmit={handleSubmit}>
//             <div className="w-full 2xl:w-[496px] 2xl:h-[56px] flex justify-around gap-2 lg:gap-3 mb-6">
//               {code.map((digit, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleChange(e, idx)}
//                   onKeyDown={(e) => handleKeyDown(e, idx)}
//                   onPaste={handlePaste}
//                   ref={(el) => {
//                     inputsRef.current[idx] = el; // ✅ TS-safe, returns void
//                   }}
//                   className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-14 xl:w-18 xl:h-16 text-center txt-18 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-50"
//                 />
//               ))}
//             </div>

//             <div className="text-left mb-6">
//               {secondsLeft > 0 ? (
//                 <div className="text-[#8D9A9B] txt-18">
//                   Request a new code (0:
//                   {secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft})
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={handleResendCode}
//                   className="cursor-pointer text-[#224674] txt-16 font-[600] underline transition"
//                 >
//                   Request a new code
//                 </button>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={!isFormValid()}
//               className={`w-full txt-18 2xl:w-[496px] 2xl:h-[56px] py-3 rounded-full font-semibold transition ${
//                 !isFormValid()
//                   ? "bg-[#D8DFE0] cursor-not-allowed text-[#9EA9AA]"
//                   : "bg-[#224674] text-white cursor-pointer"
//               }`}
//             >
//               {isSubmitting ? (
//                 <img
//                   src="/homePage/loader.gif"
//                   alt="Loading..."
//                   className="w-6 h-6 mx-auto bg-[#224674]"
//                 />
//               ) : (
//                 "Verify"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Optional: memo to avoid parent re-renders affecting this
// export default memo(SixDigitVerifyInnerBase);
