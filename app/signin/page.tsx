'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import dark from "@/assets/dark.png";
import logo from "@/assets/logo.png";
import GoogleLoginButton from "@/components/GoogleSigninBtn";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });
  
      const { accessToken } = response.data;
  
      // Store access token securely (consider httpOnly cookies for production)
      localStorage.setItem("accessToken", accessToken);

      toast.success("Login successful! Redirecting...", {
        position: "top-center",
      });
  
      // Redirect to the home page
      router.push("/");
    } catch (error: any) {
      // Handle errors more gracefully
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
      });
    }
  };
  

  return (
    <div
      className="relative h-screen bg-cover w-full text-white flex items-center justify-center"
    >
      <img
        src={dark.src}
        alt=""
        className="w-full h-full object-cover -z-[1]"
      />
      <div className="text-center md:scale-100 scale-75 flex flex-col gap-2 mt-4 items-center absolute">
        <Link href="/">
          <img src={logo.src} className="md:w-40 w-60" alt="Logo" />
        </Link>
        <div className="mt-4">
          <h1 className="text-4xl md:text-[52px] font-semibold opacity-95">
            Login to Your Account
          </h1>
          <p className="md:text-[20px] mt-4 opacity-90">
            Log in to manage bookings, view service history, and access exclusive offers.
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col bg-white/40 backdrop-blur-2xl px-6 py-10 rounded-[10px] text-black"
        >
          <input
            type="email"
            placeholder="Email Address"
            className="w-[400px] h-[55px] outline-gray-400 rounded-[10px] px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-[400px] h-[55px] outline-gray-400 rounded-[10px] px-4 py-2 mt-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="bg-transparent" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-black underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-[#D70006] text-white w-[400px] px-6 py-4 font-semibold mt-6 rounded-[10px]"
          >
            LOGIN
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
