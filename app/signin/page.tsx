"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import dark from "@/assets/dark.png";
import logo from "@/assets/logo.png";
import GoogleLoginButton from "@/components/GoogleSigninBtn";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
  return (
    <div>
      <Hero />
      <ToastContainer />
    </div>
  );
};

export default Signin;

const Hero = () => {
  const [formData, setFormData] = useState({
    email: "",
    emailOtp: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous error

    // If OTP is not sent, send OTP first
    if (!isOtpSent) {
      try {
        const { email } = formData;

        // Validate that all required fields are filled out
        if (!email) {
          setError("Please fill in all fields");
          toast.error("Please fill in all fields");
          return;
        }

        // Make a request to the backend to send OTP
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
          }),
        });

        const data = await response.json();

        

        if (!response.ok) {
          setError(data.message || "Error sending OTP");
          toast.error(data.message || "Error sending OTP");
          return;
        }

        // OTP sent successfully, now show OTP input form
        setIsOtpSent(true);
        setError(null); // Clear any previous errors after successful OTP request
        toast.success("OTP sent successfully! Check your email.");
      } catch (err) {
        setError("Error preparing signup");
        toast.error("Error preparing signup");
      }
    }

    // If OTP has been sent, verify OTP and complete signup
    if (isOtpSent) {
      try {
        const otpCode = otp.join(""); // Combine OTP digits entered by the user

        // Validate that the OTP field is not empty
        if (!otpCode) {
          setError("Please enter the OTP");
          toast.error("Please enter the OTP");
          return;
        }

        // Call backend to verify OTP and create the user
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            emailOtp: otpCode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "OTP verification failed");
          toast.error(data.message || "OTP verification failed");
          return;
        }

        toast.success("Signin successful!");

        // If OTP verification is successful, sign the user in
        router.push("/");
      } catch (err) {
        toast.error("Error completing signin");
        setError("Error completing signin");
      }
    }
  };

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  const handleOtpChange = (value: any, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{1,6}$/.test(pasteData)) return;
    const newOtp = pasteData.split("");
    for (let i = 0; i < 6; i++) {
      newOtp[i] = newOtp[i] || "";
    }
    setOtp(newOtp);
    const lastFilledIndex = pasteData.length - 1;
    const nextInput = document.getElementById(`otp-input-${lastFilledIndex}`);
    nextInput?.focus();
  };

  return (
    <div className="relative h-screen bg-cover w-full text-white flex items-center justify-center">
      <img
        src={dark.src}
        alt=""
        className="w-full h-full object-cover -z-[1]"
      />
      <div className="text-center md:scale-100 scale-75 flex flex-col gap-2 mt-4 items-center absolute">
      <Link href={"/"}>
            <h1 className="text-4xl font-bold helvetica text-white">
              MAX<span className="text-red-500">CLEAN</span>
            </h1>
          </Link>
        <div className="mt-4">
          <h1 className="text-4xl md:text-[52px] font-semibold opacity-95">
            Login to Your Account
          </h1>
          <p className="md:text-[20px] mt-4 opacity-90">
            Log in to manage bookings, view service history, and access
            exclusive offers.
          </p>
        </div>
        <form
          onSubmit={handleSignin}
          className="flex flex-col bg-white/40 backdrop-blur-2xl px-6 py-10 rounded-[10px] text-black"
        >
          {!isOtpSent && (
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              className="w-[400px] h-[55px] outline-gray-400 rounded-[10px] px-4 py-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}

          {isOtpSent && (
            <>
              <h2 className="text-xl text-white font-semibold mb-2">
                Verify Your OTP
              </h2>
              <p className="text-gray-300 mb-4">
                Enter the 6-digit OTP sent to your email.
              </p>
              <div className="flex space-x-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-12 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                ))}
              </div>
            </>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            className="bg-[#D70006] md:scale-100 scale-90 md:text-lg text-sm text-white w-full px-6 py-4 font-semibold overflow-hidden mt-6 rounded-[10px] uppercase"
          >
            {isOtpSent ? "Verify OTP" : "login"}
          </button>
          <GoogleLoginButton />
          <div className="flex text-center items-center justify-center mt-4 gap-2">
            <p className="text-[#F5F5F5]">Don’t have an account?</p>
            <Link href="/signup" className="text-black underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
