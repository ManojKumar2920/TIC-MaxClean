"use client"
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // To track if the menu is open
  // const location = useLocation(); // To get the current location
  // const darkNavLocations = ["/privacy", "/terms", "/other-dark-page"]; // Define dark location routes

  // Check if the current location is in the darkNavLocations array
  // const isDarkLocation = darkNavLocations.includes(location.pathname);

  // const navItemVariants = {
  //   hidden: { opacity: 0, x: 100 },
  //   visible: {
  //     opacity: 1,
  //     x: 0,
  //     transition: { delay: 0.5, duration: 1.2, ease: "easeOut" },
  //   },
  // };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the state of the menu
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = usePathname();

  console.log("The location is "+location);

  const router = useRouter();

  const isActive = (path: string) => {
    return location === path;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await fetch("/api/auth/auth-status");
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    };

    checkAuthStatus();
  }, []);

  return (
    <>
      <div className="absolute md:hidden overflow-hidden z-40 top-0 left-0 w-full flex items-center justify-between p-6 lg:p-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex items-center space-x-3"
        >
         <Link href={"/"}>
            <h1 className="text-2xl font-bold helvetica text-white">
              MAX<span className="text-red-500">CLEAN</span>
            </h1>
          </Link>
        </motion.div>

        {/* Hamburger Icon for mobile */}
        <div className="lg:hidden ml-6 flex items-center" onClick={toggleMenu}>
          <div className="w-8 h-8 flex flex-col justify-around items-center space-y-1 cursor-pointer">
            <div className={`w-full h-1 ${location === '/schedule' || location === '/order-history' || location === '/terms' || location === '/privacy' ? 'bg-black' : 'bg-white'}`}></div>
            <div className={`w-full h-1 ${location === '/schedule' || location === '/order-history' || location === '/terms' || location === '/privacy' ? 'bg-black' : 'bg-white'}`}></div>
            <div className={`w-full h-1 ${location === '/schedule' || location === '/order-history' || location === '/terms' || location === '/privacy' ? 'bg-black' : 'bg-white'}`}></div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[600] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`bg-black  relative text-white w-3/4 h-full px-6 transform transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex mt-7 justify-end   right-10  absolute">
            <div onClick={toggleMenu} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col   space-y-6 text-2xl">
            <Link href="/" className="w-[65%] mb-4 ">
              <img src={logo.src} alt="logo" className="w-full mt-7 h-full" />
            </Link>
            <Link
              href="/"
              className="text-white  font-semibold uppercase hover:text-gray-600"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white font-semibold uppercase hover:text-gray-600"
              onClick={toggleMenu}
            >
              About
            </Link>
            {/* <Link
              href="/review"
              className="text-white font-semibold uppercase hover:text-gray-600"
              onClick={toggleMenu}
            >
              Reviews
            </Link> */}
            {/* <Link
              href="/GetApp"
              className="text-white font-semibold uppercase hover:text-gray-600"
              onClick={toggleMenu}
            >
              Get App
            </Link> */}
            <Link
              href="/pricing"
              className="text-white font-semibold uppercase hover:text-gray-600"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            {!isAuthenticated ? (
              <Link
                href={"/signin"}
                className="text-white font-semibold uppercase hover:text-gray-600"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href={"/order-history"}
                className="text-white font-semibold uppercase hover:text-gray-600"
              >
                Order History
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
