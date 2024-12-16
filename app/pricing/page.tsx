"use client";
import React from "react";
// import Navbar from "@/pages/NavBar";
import Banner from "@/assets/pricing.png";
import MobileNav from "@/components/MobileNavbar";
import { useState } from "react";
import logo from "@/assets/logo.png";
// import x from "@/assets/x.png";
// import fb from "@/assets/fb.png";
// import insta from "@/assets/insta.png";
// import git from "@/assets/git.png";
// import { useLocation } from "react-router";
import Link from "next/link";
import { useEffect } from "react";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { usePathname } from 'next/navigation'
const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <div className="w-full overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <MobileNav />

      <Hero isYearly={isYearly} setIsYearly={setIsYearly} />
      {isYearly ? <PricingCard /> : <PricingCard2 />}
      <Faq />
      <GetDemo />
      <Footer />
    </div>
  );
};

export default Pricing;

interface HeroProps {
  isYearly: boolean;
  setIsYearly: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = () => {
  const location = usePathname();
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const isActive = (path: string) => {
    return location === path;
  };
  useEffect(() => {
    const heroSection = document.querySelector("#hero-section");
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  return (
    <nav
      className={`fixed top-4 md:block hidden !z-[200] w-[80%]  m-auto  rounded-[10px] ${
        isHeroVisible
          ? " bg-white/30 bg-opacity-70"
          : "bg-black/30 bg-opacity-70"
      } px-12 py-3 text-white shadow-lg backdrop-blur-lg`}
    >
      <div className="container text-[20px] mx-auto flex items-center justify-between gap-6 space-x-8   font-medium">
        <div className="inter flex items-center  justify-between gap-6">
          <Link href="/">
            <img src={logo.src} alt="Logo" className="h-full w-32" />
          </Link>
        </div>
        <div className=" flex  justify-between  gap-10">
          <Link
            href="/about"
            className={`${
              isActive("/about") ? "text-white" : "text-black"
            } hover:text-[#E50914]`}
          >
            About
          </Link>
          <Link
            href="/review"
            className={`${
              isActive("/review") ? "text-white" : "text-black"
            } hover:text-[#E50914]`}
          >
            Reviews
          </Link>
          <Link
            href="/connect"
            className={`${
              isActive("/connect") ? "text-white" : "text-black"
            } hover:text-[#E50914]`}
          >
            Get App
          </Link>
          <Link
            href="/pricing"
            className={`${
              isActive("/Pricing") ? "text-white" : "text-white"
            } hover:text-[#E50914]`}
          >
            Pricing
          </Link>
        </div>
        <div className=" flex  items-center justify-center gap-6">
          <Link href="/login" className="text-white">
            <button className=" mt-1">
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.21686 9.63408C9.54037 9.63408 10.6863 9.15936 11.6229 8.22276C12.5592 7.28635 13.034 6.14057 13.034 4.8169C13.034 3.49363 12.5594 2.34773 11.6228 1.41097C10.6862 0.474687 9.54022 0 8.21686 0C6.89315 0 5.74733 0.474687 4.81093 1.41113C3.87452 2.34757 3.39964 3.49351 3.39964 4.8169C3.39964 6.14057 3.87448 7.28651 4.81097 8.22295C5.74768 9.15924 6.89362 9.63408 8.21682 9.63408H8.21686ZM5.63979 2.23984C6.35831 1.52129 7.20124 1.17203 8.21686 1.17203C9.23233 1.17203 10.0754 1.52129 10.794 2.23984C11.5126 2.95851 11.862 3.80155 11.862 4.81687C11.862 5.83249 11.5126 6.67542 10.794 7.39409C10.0754 8.1128 9.23233 8.46205 8.21686 8.46205C7.20151 8.46205 6.35866 8.11264 5.63979 7.39409C4.92108 6.67557 4.57167 5.83253 4.57167 4.8169C4.57167 3.80155 4.92108 2.95851 5.63979 2.23984ZM16.6456 15.379C16.6186 14.9893 16.564 14.5641 16.4836 14.1153C16.4024 13.663 16.2979 13.2354 16.1727 12.8447C16.0434 12.4408 15.8677 12.0419 15.6503 11.6597C15.4249 11.2629 15.16 10.9175 14.8628 10.6332C14.552 10.3358 14.1714 10.0967 13.7313 9.92229C13.2928 9.74885 12.8068 9.66096 12.287 9.66096C12.0828 9.66096 11.8854 9.74471 11.504 9.99299C11.233 10.1695 10.9611 10.3448 10.6885 10.5188C10.4265 10.6857 10.0715 10.8421 9.63315 10.9837C9.20545 11.1221 8.77119 11.1923 8.34241 11.1923C7.91397 11.1923 7.47967 11.1221 7.05167 10.9837C6.61378 10.8422 6.2587 10.6859 5.99714 10.5189C5.69362 10.325 5.41901 10.148 5.18081 9.99279C4.7998 9.74455 4.60233 9.66076 4.39819 9.66076C3.87816 9.66076 3.39234 9.74881 2.95394 9.92248C2.51417 10.0966 2.13347 10.3357 1.82234 10.6334C1.52511 10.9178 1.26023 11.2631 1.035 11.6597C0.817889 12.0419 0.642108 12.4406 0.512694 12.8448C0.387695 13.2356 0.283203 13.663 0.202031 14.1153C0.121445 14.5636 0.0669921 14.9888 0.0399609 15.3795C0.0133984 15.7614 0 16.1589 0 16.5605C0 17.6045 0.331874 18.4497 0.986326 19.073C1.63269 19.6881 2.48781 20 3.52796 20H13.1581C14.1979 20 15.0531 19.6881 15.6996 19.073C16.3542 18.4501 16.6861 17.6047 16.6861 16.5603C16.6859 16.1574 16.6724 15.7599 16.6456 15.379ZM14.8915 18.2238C14.4644 18.6303 13.8974 18.8279 13.1579 18.8279H3.528C2.78843 18.8279 2.2214 18.6303 1.79445 18.224C1.37562 17.8253 1.17207 17.281 1.17207 16.5605C1.17207 16.1857 1.18441 15.8157 1.20918 15.4605C1.23324 15.112 1.28254 14.7291 1.35566 14.3223C1.42781 13.9206 1.51965 13.5435 1.6289 13.2022C1.73375 12.8749 1.87672 12.5508 2.05402 12.2386C2.22324 11.941 2.41793 11.6858 2.63277 11.4801C2.83374 11.2877 3.08706 11.1302 3.3855 11.0121C3.66152 10.9028 3.97175 10.843 4.30851 10.834C4.34952 10.8559 4.42265 10.8975 4.54105 10.9747C4.78198 11.1317 5.05968 11.3109 5.36671 11.5069C5.7128 11.7276 6.15862 11.9269 6.69132 12.0988C7.23588 12.2749 7.79131 12.3643 8.3426 12.3643C8.89393 12.3643 9.44947 12.2749 9.99377 12.099C10.5269 11.9267 10.9726 11.7276 11.3192 11.5066C11.6333 11.3058 11.9033 11.1319 12.1442 10.9747C12.2626 10.8976 12.3357 10.8558 12.3767 10.834C12.7136 10.843 13.0238 10.9028 13.3 11.0121C13.5983 11.1302 13.8517 11.2878 14.0526 11.4801C14.2674 11.6856 14.4621 11.9409 14.6313 12.2388C14.8088 12.5508 14.952 12.8751 15.0566 13.202C15.166 13.5438 15.258 13.9207 15.33 14.3222C15.403 14.7297 15.4524 15.1127 15.4765 15.4606V15.4609C15.5014 15.8148 15.5139 16.1847 15.5141 16.5605C15.5139 17.2812 15.3104 17.8253 14.8915 18.2238H14.8915Z"
                  fill="white"
                />
              </svg>
            </button>
          </Link>
          <Link href="/schedule" className="text-white">
            <button className="bt-c  font-normal text-[20px]  bg-black whitespace-nowrap rounded-[8px] px-5 py-2">
              Schedule Wash
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC<HeroProps> = ({ isYearly, setIsYearly }) => {
  return (
    <div
      id="hero-section"
      className="relative  h-screen  w-full bg-cover flex items-center px-10 bg-center text-white"
      style={{ backgroundImage: `url(${Banner.src})` }}
    >
      <div className="  flex flex-col w-full  h-full gap-10 md:-mt-20  items-center justify-center">
        <div className=" flex  flex-col items-center justify-center gap-6">
          <h1 className=" font-medium md:text-[65px] text-6xl md:leading-[74px] text-center">
            Pricing plans <br className=" hidden md:block" />
            for teams of all sizes
          </h1>
          <h2 className=" text-center text-xl text-white/80 ">
            Nisi nulla minim deserunt adipisicing est consectetur sint labore
            commodo <br /> tempor tempor nisi. Deserunt tempor laboris aute
            labore.
          </h2>
        </div>
        <div className=" text-[16px] md:z-[150] z-[400] font-semibold flex gap-4 items-center justify-center">
          <h1>Pay Monthly</h1>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isYearly}
              onChange={() => setIsYearly((prev) => !prev)}
            />
            <div className="relative w-12 h-7 bg-white rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-600/0 peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-red-600 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-gray-200 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-white peer-checked:bg-[#D70006]"></div>
          </label>

          <h1>Pay Yearly</h1>
        </div>
      </div>
    </div>
  );
};

const PricingCard = () => {
  const plans = [
    {
      title: "Bi-weekly",
      price: "$1200",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
      ],
    },
    {
      title: "Once a Week",
      price: "$2099",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
      ],
    },
  ];

  return (
    <div className="w-full flex flex-wrap  z-[100] -mt-40 md:-mt-60 px-10 md:px-0   justify-center gap-8 py-16">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="max-w-lg w-full bg-white text-black shadow-md rounded-lg   border-[0.5px]  border-[#D70006]/50"
        >
          <div className="bg-black text-white py-5 text-[22px] text-center font-semibold rounded-t-lg">
            {plan.title}
          </div>
          <div className=" text-center">
            <div className=" p-6 ">
              <h1 className="  text-[40px] text-[#323232]">Essential</h1>
              <h2 className="  text-6xl md:text-[80px]   text-[#323232]">
                {plan.price}
                <span className="   md:text-[32px] text-xl font-normal text-[#636363]">
                  {plan.frequency}
                </span>
              </h2>
            </div>
            <ul className="mt-6 px-6 py-14 bg-[#F5F5F5] space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-red-600">✔</span>
                  <span className="text-gray-800">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
 

const GetDemo = () => {
  return (
    <div className="relative  w-[95%] md:w-[90%] rounded-xl py-16  my-20 md:my-40 bg-[#D70006] z-[-1] text-white flex items-center justify-center">
      {/* Background Circles */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="absolute md:w-[60%] w-[80%] md:h-screen h-[120%] border-4 border-white/30 rounded-full"></div>
        <div className="absolute md:w-[80%] w-[100%]  md:h-screen h-[140%] border-4 border-white/20 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold mb-4">Schedule a Wash</h2>
        <p className="text-lg text-white/80 mb-6">
          Ut aliquip anim laboris deserunt do cillum id amet aute veniam do do.
        </p>
        <button className="px-6 py-3 bg-white text-[#D70006] rounded-lg font-semibold hover:bg-gray-100 transition">
          Get demo
        </button>
      </div>
    </div>
  );
};

const PricingCard2 = () => {
  const plans = [
    {
      title: "Car Foam Wash",
      price: "$1200",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
      ],
    },
    {
      title: "Bike Foam Wash",
      price: "$2099",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
      ],
    },
  ];
  const plans2 = [
    {
      title: "Car + Bike Wash Combo",
      price: "$12",
      frequency: "/month",
      features: [
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
      ],
    },
    {
      title: "Battery Jump Start",
      price: "$12",
      frequency: "/month",
      features: [
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
      ],
    },
  ];

  return (
    <div className="w-full flex flex-wrap  z-[100] -mt-40 md:-mt-60 px-10 md:px-0  justify-center gap-8 py-16">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="max-w-lg w-full bg-white text-black shadow-md rounded-lg   border-[0.5px]  border-[#D70006]/50"
        >
          <div className="bg-black text-white py-5 text-[22px] text-center font-semibold rounded-t-lg">
            {plan.title}
          </div>
          <div className=" text-center">
            <div className=" p-6 ">
              <h1 className="  text-[40px] font-bold text-[#323232]">
                Essential
              </h1>
              <h2 className=" text-6xl  md:text-[80px]  font-bold  text-[#323232]">
                {plan.price}
                <span className="   text-xl md:text-[32px] font-normal text-[#636363]">
                  {plan.frequency}
                </span>
              </h2>
            </div>
            <ul className="mt-6 px-6 py-14 bg-[#F5F5F5] space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-red-600">✔</span>
                  <span className="text-gray-800 font-bold">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {plans2.map((plan, index) => (
        <div
          key={index}
          className="max-w-lg w-full bg-white text-black shadow-md rounded-lg   border-[0.5px]  border-[#D70006]/50"
        >
          <div className="bg-[#D70006] text-white py-5 text-[22px] text-center font-semibold rounded-t-lg">
            {plan.title}
          </div>
          <div className=" text-center">
            <div className=" p-6 ">
              <h1 className="  text-[40px] font-bold text-[#323232]">
                Essential
              </h1>
              <h2 className="  text-[80px] font-bold   text-[#323232]">
                {plan.price}
              </h2>
            </div>
            <ul className="mt-6 px-6 py-14 bg-[#F5F5F5] space-y-4">
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-left text-base  gap-3"
                >
                  <span className="text-[#191D23]">{feature}</span>
                </li>
              ))}
              <button className=" bg-black w-[60%] text-white rounded px-4 py-2.5">
                Get Started Now
              </button>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
