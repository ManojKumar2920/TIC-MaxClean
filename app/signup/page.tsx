"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dark from "@/assets/dark.png";
import logo from "@/assets/logo.png";
import GoogleLoginButton from "@/components/GoogleSigninBtn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    emailOtp: ""
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


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);  // Clear any previous error
  
    // If OTP is not sent, send OTP first
    if (!isOtpSent) {
      try {
        const { firstName, lastName, email, phoneNumber } = formData;
  
        // Validate that all required fields are filled out
        if (!firstName || !lastName || !email || !phoneNumber) {
          setError("Please fill in all fields");
          toast.error("Please fill in all fields");
          return;
        }
  
        // Make a request to the backend to send OTP
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phoneNumber
          })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setError(data.message || "Error sending OTP");
          toast.error(data.message || "Error sending OTP");
          return;
        }
  
        // OTP sent successfully, now show OTP input form
        setIsOtpSent(true);
        setError(null);  // Clear any previous errors after successful OTP request
        toast.success("OTP sent successfully! Check your email.");
      } catch (err) {
        setError("Error preparing signup");
        toast.error("Error preparing signup");
      }
    }
  
    // If OTP has been sent, verify OTP and complete signup
    if (isOtpSent) {
      try {
        const otpCode = otp.join('');  // Combine OTP digits entered by the user
  
        // Validate that the OTP field is not empty
        if (!otpCode) {
          setError("Please enter the OTP");
          toast.error("Please enter the OTP");
          return;
        }
  
        // Call backend to verify OTP and create the user
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            emailOtp: otpCode
          })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setError(data.message || "OTP verification failed");
          toast.error(data.message || "OTP verification failed");
          return;
        }

        toast.success("Signup successful! Redirecting to Home...");


        // If OTP verification is successful, sign the user in
        router.push('/')
      } catch (err) {
        toast.error("Error completing signup");
        setError("Error completing signup");
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
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <Image
        src={dark}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="z-10 w-full flex flex-col items-center justify-center max-w-md px-4 py-8">
      <Link href={"/"}>
            <h1 className="text-4xl font-bold helvetica text-white py-2">
              MAX<span className="text-red-500">CLEAN</span>
            </h1>
          </Link>
        <h1 className="text-3xl md:text-4xl font-semibold text-white text-center mb-6">
          Create Free Account
        </h1>
        <form
          onSubmit={handleSignup}
          className="flex flex-col bg-white/40 w-full md:w-[90%] backdrop-blur-2xl px-6 py-10 rounded-[10px] text-black"
        >
          {!isOtpSent && (
            <>
              <div className="items-center flex gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full md:h-[55px] h-[45px] outline-gray-400 rounded-[10px] px-4 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full md:h-[55px] h-[45px] rounded-[10px] outline-gray-400 px-4 py-2"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full mt-4 md:h-[55px] h-[45px] outline-gray-400 rounded-[10px] px-4 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-4 md:h-[55px] h-[45px] outline-gray-400 rounded-[10px] px-4 py-2"
                required
              />
            </>
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
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-[#D70006] md:scale-100 scale-90 md:text-lg text-sm text-white w-full px-6 py-4 font-semibold overflow-hidden mt-6 rounded-[10px] uppercase"
          >
            {isOtpSent ? "Verify OTP" : "Create an Account"}
          </button>
          <GoogleLoginButton />
        </form>
        <div className="mt-4 text-center text-white">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;