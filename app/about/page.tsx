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
      {/* <Hero /> */}
      <WhatWeDo />
      <Vision />

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
        {/* <p className="md:text-[32px] text-xl text-[#191818]">
          We strive to redefine car care by focusing on
        </p> */}
      </div>
      <div className="flex mt-6 flex-col flex-wrap md:flex-row md:items-start items-center justify-center py-4 gap-10">

        <p className=" md:px-20 px-4 font-bold  text-xl ">
        Our primary objective is to establish and maintain the trust of our customers, recognizing it as our foremost goal. Through our unwavering commitment to earning this trust, we strive to deliver exceptional service that goes beyond expectations. We believe that by consistently prioritizing customer trust and providing outstanding service, we can build enduring relationships and foster satisfaction among those we serve.
        </p>
{/*         
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
        </motion.div> */}
      </div>
    </div>
  );
};

const WhatWeDo = () => {
  return (
    <div className="relative z-[8] pt-20  w-full bg-[#D70006] h-screen">
      {/* Background Shadow */}
      <div
        className="absolute inset-0 bg-shadow-image z-[50] bg-cover bg-center"
        style={{ backgroundImage: `url(${shadow.src})` }}
      ></div>

      {/* Car Image */}
      <div className="absolute top-0 z-[30]">
        <img src={car.src} alt="Car" className=" w-full object-cover h-[100dvh]" />
      </div>
      <div className=" py-2 md:py-16 w-full flex flex-col md:items-center md:justify-center px-4 md:px-0 absolute z-[160]">
        <h1 className=" text-3xl md:text-[60px] text-white">What we do ?</h1>
        <div className="  flex justify-center gap-10 px-0 py-4 md:py-20 items-center md:px-20">

          <div className=" flex flex-col gap-4">
            {/* <h1 className=" text-white text-xl    md:text-4xl whitespace-nowrap font-semibold">
              Interior & Exterior Detailing
            </h1> */}
            
            <p className=" text-white font-bold  text-xl">
            At our mobile car wash service, we bring the convenience of a pristine vehicle directly to your doorstep. Our dedicated team of professionals utilizes latest techniques to deliver a thorough and efficient car washing experience. From exterior detailing that restores your vehicle's shine to interior cleaning that leaves every nook spotless, we cater to your car's specific needs. With our commitment to quality, time efficiency, and environmental responsibility, we ensure your car not only looks its best but also receives care that aligns with modern standards. Experience the ease of a superior mobile car wash that transforms your car into a symbol of cleanliness and sophistication.
            </p>
          </div>
         
        </div>
      </div>
    </div>
  );
};

 