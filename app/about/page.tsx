"use client";
import React from "react";
import Navbar from "@/components/NavBar";
import aboutBanner from "@/assets/about.png";
import v1 from "@/assets/v1.png";
import v2 from "@/assets/v2.png";
import v3 from "@/assets/v3.png";
import shadow from "@/assets/aboutfooter.png";
import car from "@/assets/aboutfooter1.png";
import card from "@/assets/about3.png";
import Footer from "@/components/Footer";
import MobileBav from "@/components/MobileNavbar";
import { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const About = () => {
  return (
    <div className="w-full overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <MobileBav />
      <Hero />
      <Vision />
      <WhatWeDo />

      <Footer />
    </div>
  );
};

export default About;

const Hero = () => {
  return (
    <div
      className="relative h-screen w-screen bg-cover flex items-center px-10 bg-center text-white"
      style={{ backgroundImage: `url(${aboutBanner.src})` }}
    >
      <div className="  flex flex-col gap-6 items-end md:absolute bottom-20 right-20">
        <h1 className=" font-medium text-6xl md:text-[100px]  md:leading-[74px] md:text-right">
          About Us
        </h1>
        <Link href={"/schedule"}> 
        <div className=" w-fit flex items-center justify-center text-center rounded-[10px] overflow-hidden">
          <button className="bg-[#D70006] text-white w-[80%] px-6 py-4  font-semibold overflow-hidden">
            SCHEDULE WASH
          </button>
          <button className="bg-black text-white text-center font-semibold flex items-center justify-center px-6 py-4 w-[20%] whitespace-nowrap ">
            +
          </button>
        </div>
        </Link>
      </div>
    </div>
  );
};

const Vision = () => {
  const sectionRef = useRef(null);
  const controlsCard1 = useAnimation();
  const controlsCard2 = useAnimation();
  const controlsCard3 = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controlsCard2.start("visible"); // Animate middle card first
          setTimeout(() => controlsCard1.start("visible"), 300); // Animate left card with delay
          setTimeout(() => controlsCard3.start("visible"), 300); // Animate right card with delay
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controlsCard1, controlsCard2, controlsCard3]);

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.8 } },
  };

  return (
    <div ref={sectionRef} className="py-20 md:px-0 px-10 bg-[#ECEFF3]">
      <div className="text-center">
        <h1 className="text-6xl md:text-[80px]">
          Our <span className="text-[#FF0000]">Vision</span>
        </h1>
        <p className="md:text-[32px] text-xl text-[#191818]">
          We strive to redefine car care by focusing on
        </p>
      </div>
      <div className="flex mt-6 flex-col flex-wrap md:flex-row md:items-start items-center justify-center py-4 gap-10">
        {/* Card 1 */}
        <motion.div
          className="flex flex-col gap-4 w-[90%] md:w-[25%]"
          variants={fadeIn}
          initial="hidden"
          animate={controlsCard1}
        >
          <div>
            <img className="rounded-[30px]" src={v1.src} alt="" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[28px] font-medium text-[#FF0000]">
              Exceptional Quality
            </h1>
            <h2 className="text-lg">
              We’re dedicated to providing top-tier services that go beyond a
              simple wash. Every vehicle deserves meticulous attention, ensuring
              it leaves our care with a pristine, lasting shine.
            </h2>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="flex flex-col gap-4 w-[90%] md:w-1/4"
          variants={fadeIn}
          initial="hidden"
          animate={controlsCard2}
        >
          <div>
            <img className="rounded-[30px]" src={v2.src} alt="" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[28px] font-medium text-[#FF0000]">
              Eco-Friendly Practices
            </h1>
            <h2 className="text-lg">
              We are committed to reducing our environmental impact by using
              sustainable methods and eco-friendly products, so every wash is as
              kind to the planet as it is to your car.
            </h2>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          className="flex flex-col gap-4 w-[90%] md:w-1/4"
          variants={fadeIn}
          initial="hidden"
          animate={controlsCard3}
        >
          <div>
            <img className="rounded-[30px]" src={v3.src} alt="" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[28px] font-medium text-[#FF0000]">
              Exceptional Quality
            </h1>
            <h2 className="text-lg">
              We’re dedicated to providing top-tier services that go beyond a
              simple wash. Every vehicle deserves meticulous attention, ensuring
              it leaves our care with a pristine, lasting shine.
            </h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const WhatWeDo = () => {
  return (
    <div className="relative z-[150]  w-full bg-[#D70006] h-screen">
      {/* Background Shadow */}
      <div
        className="absolute inset-0 bg-shadow-image z-[50] bg-cover bg-center"
        style={{ backgroundImage: `url(${shadow.src})` }}
      ></div>

      {/* Car Image */}
      <div className="absolute z-[30]  hidden md:flex items-center justify-center ">
        <img src={car.src} alt="Car" className=" w-full  object-contain" />
      </div>
      <div className=" py-16 w-full flex flex-col md:items-center md:justify-center px-4   md:mt-0 mt-20 md:px-0 absolute z-[160]">
        <h1 className=" text-3xl md:text-[60px]   text-white">What we do ?</h1>
        <div className="  md:pl-40    flex justify-center gap-10 py-4 md:py-20 items-start">
          <div className=" flex flex-col gap-4">
            <h1 className=" text-white text-xl    md:text-4xl whitespace-nowrap font-semibold">
              Interior & Exterior Detailing
            </h1>
            <p className=" text-[#FFDBDC]/90  text-xl">
              We meticulously clean and polish every surface, inside and out,
              for a fresh and rejuvenated feel. From upholstery to wheels, no
              detail is overlooked.
            </p>
          </div>
          <div className="md:flex hidden  items-end space-x-5 overflow-hidden">
            {/* Image with Black Overlay */}
            <div className="relative w-1/3">
              <img src={card.src} className="w-full" alt="" />
              <div className="absolute inset-0  rounded-xl"></div>
            </div>

            <div className="relative w-1/4">
              <img src={card.src} className="w-full" alt="" />
              <div className="absolute inset-0 bg-black rounded-xl opacity-50"></div>
            </div>

            <div className="relative w-1/4">
              <img src={card.src} className="w-full" alt="" />
              <div className="absolute inset-0 bg-black rounded-xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

 