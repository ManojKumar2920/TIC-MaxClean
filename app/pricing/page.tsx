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
import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBar";
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
            for a spotless ride
          </h1>
          <h2 className=" text-center text-xl text-white/80 ">
          Keep your car and bike spotless and shining with our premium wash services. <br />
          We offer flexible plans to suit every need and budget.
          </h2>
        </div>
        <div className=" text-[16px] md:z-[150] z-[400] font-semibold flex gap-4 items-center justify-center">
          <h1>Pay Once</h1>
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

          <h1>Pay Monthly</h1>
        </div>
      </div>
    </div>
  );
};

const PricingCard = () => {
  const plans = [
    {
      title: "Bi-weekly",
      price: "₹1099",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
        "Towel dry cleaning",
        "Air top up",
        "Tyre polish",
      ],
    },
    {
      title: "Once a Week",
      price: "₹2099",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
        "Towel dry cleaning",
        "Air top up",
        "Tyre polish",
      ],
    },
  ];

  return (
    <div className="w-full flex flex-wrap  z-[100] -mt-40 md:-mt-60 px-10 md:px-0   justify-center gap-8 py-16">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="max-w-lg w-full bg-white text-black shadow-md rounded-lg   border-[0.5px]  border-[#D70006]/50 relative pb-10"
        >
          <div className="bg-black text-white py-5 text-[22px] text-center font-semibold rounded-t-lg">
            {plan.title}
          </div>
          <div className=" text-center">
            <div className=" p-6 ">
              <h2 className="  text-6xl md:text-[80px] font-bold   text-[#323232]">
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
            <Link href={"/schedule"} className=" absolute bottom-0 w-full left-0 right-0">
              <button className=" bg-black w-[60%] my-5 text-white rounded px-4 py-2.5">
                Order Now
              </button>
            </Link>
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
      price: "₹649",
      frequency: "/per wash",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
        "Towel dry cleaning",
        "Air top up",
        "Tyre polish",
      ],
    },
    {
      title: "Bike Foam Wash",
      price: "₹449",
      frequency: "/per wash",
      features: [
        "Bike exterior pressure water wash",
        "Bike exterior pressure foam wash",
        "Hand scrub",
        "Towel dry cleaning",
        "Air top-up",
        "Tyre polish",
      ],
    },
  ];
  const plans2 = [
    {
      title: "Car + Bike Wash Combo",
      price: "₹899",
      frequency: "/per wash",
      features: ["Includes all services from car and bike foam wash"],
    },
    {
      title: "Battery Jump Start",
      price: "₹349",
      frequency: "/per wash",
      features: [
        "Introducing our Emergency Jump Start Plan, essential for car owners stranded with a dead battery. We'll come to you and get your car running again in no time. Ideal for busy individuals needing immediate help on the road. Stay stress-free and on the move with our reliable service!",
      ],
    },
  ];

  return (
    <div className="w-full flex flex-wrap  z-[100] -mt-40 md:-mt-60 px-10 md:px-0  justify-center gap-8 py-16">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="max-w-lg w-full relative bg-white text-black shadow-md rounded-lg   border-[0.5px]  border-[#D70006]/50 pb-10"
        >
          <div className="bg-black text-white py-5 text-[22px] text-center font-semibold rounded-t-lg">
            {plan.title}
          </div>
          <div className=" text-center">
            <div className=" p-6 ">
              <h2 className=" text-6xl  md:text-[80px]  font-bold  text-[#323232]">
                {plan.price}
                <span className="   text-xl md:text-[20px] font-normal text-[#636363]">
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
            <Link href={"/schedule"} className=" absolute bottom-0 w-full left-0 right-0">
              <button className=" bg-black w-[60%] my-5 text-white rounded px-4 py-2.5">
                Order Now
              </button>
            </Link>
          </div>
        </div>
      ))}

      {plans2.map((plan, index) => (
        <div
          key={index}
          className="max-w-lg w-full relative bg-white text-black shadow-md rounded-lg   border-[0.5px]  border-[#D70006]/50 pb-10"
        >
          <div className="bg-[#D70006] text-white py-5 text-[22px] text-center font-semibold rounded-t-lg">
            {plan.title}
          </div>
          <div className=" text-center">
            <div className=" p-6 ">
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
            </ul>
            <Link href={"/schedule"} className=" absolute bottom-0 w-full left-0 right-0">
              <button className=" bg-black w-[60%] my-5 text-white rounded px-4 py-2.5">
                Order Now
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
