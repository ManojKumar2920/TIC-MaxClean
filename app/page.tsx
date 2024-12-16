 


"use client";
import React from "react";
import Navbar from "@/components/NavBar";
import Banner from "@/assets/Banner.png";
import one from "@/assets/home1.png";
import two from "@/assets/home2.png";
import three from "@/assets/home3.png";
import eyeleft from "@/assets/eyeleft.png";
import eyeright from "@/assets/eyeright.png";
import qr from "@/assets/qr.png";
import app from "@/assets/app.png";
import goo from "@/assets/goo.png";
// // import dots from "../assets/dots.png";
import logo from "@/assets/logo.png";
import x from "@/assets/x.png";
import fb from "@/assets/fb.png";
import insta from "@/assets/insta.png";
import git from "@/assets/git.png";
import star from "@/assets/star.png";
import dots from "@/assets/dots.png";
// // import maxcleanVideo from "../assets/Maxclean.webm";
// import { useState } from "react";
import Mobilenav from "../components/MobileNavbar";
// import Footer from "./Footer";
import CountUp from "react-countup";
import Link from"next/link"

import { useInView } from "react-intersection-observer";
import Faq from "@/components/Faq";
export default function Home() {
  return (
    <div className="w-full overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <Mobilenav />
      <Hero />
      <Steps />
      <ThridSection />
      <Testmonials />
      <Numbers />
      <Faq />
      <Footer />
      {/* <Footer /> */}
    </div>
  );
};
 
 const Video: React.FC = () => {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={Banner.src}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source
        src="https://ik.imagekit.io/7da6fpjdo/Maxclean.webm/ik-video.mp4?updatedAt=1733564402262"
        type="video/webm"
      />
      <source
        src="https://ik.imagekit.io/7da6fpjdo/Maxclean.webm/ik-video.mp4?updatedAt=1733564402262"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
};


const Hero = () => {
  return (
    <div className="relative insta h-screen w-screen flex items-center px-10 text-white">
      <Video />
      <div className=" z-10 flex flex-col gap-4 md:items-end items-center md:absolute bottom-20 right-20">
        <h1 className=" md:font-medium  font-medium md:text-[65px] md:leading-[74px]  text-6xl  text-center md:text-right">
          Quick Car Wash in <br className=" md:block hidden" />
          Hyderabad at your Doorstep
        </h1>
        <Link href={"/schedule"}> 
        <div className="w-fit flex items-center justify-center text-center rounded-[10px] overflow-hidden">
          <button className="bg-[#D70006] text-white w-[80%] px-5 py-3 font-semibold overflow-hidden">
            SCHEDULE WASH
          </button>
          <button className="bg-black text-white text-center font-semibold flex items-center justify-center px-5 py-3 w-[20%] whitespace-nowrap">
            +
          </button>
        </div>
        </Link>
      </div>
      <div className="absolute inset-0 bg-black opacity-10" />
    </div>
  );
};
const Steps = () => {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.2, // Trigger animation when 20% of the section is visible
  });

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center text-black w-full py-24 gap-10 bg-white"
    >
      <h2 className="md:text-[80px] md:leading-[70px] text-6xl tracking-tight font-medium md:font-normal text-center mb-6">
        Book our services in <br className=" " />
        <span className="text-[#F1002E] md:text-[80px] text-6xl md:leading-[90px]">
          3 Easy{" "}
        </span>
        Steps
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 max-w-5xl">
        {/* Step 1 */}
        <div
          className={`bg-[#D70006] hover:scale-105 cursor-pointer text-white rounded-[30px] overflow-hidden flex flex-col justify-between shadow-lg text-center transition-all duration-700 ${
            sectionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex px-6 py-8 gap-2">
            <div className="text-[84px] -mt-8">1</div>
            <div className="flex flex-col">
              <h3 className="text-[20px] text-left font-medium">
                Signup/ Login
              </h3>
              <p className="text-sm text-left">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </p>
            </div>
          </div>
          <div>
            <img src={one.src} alt="Schedule a Wash" className="rounded-lg" />
          </div>
        </div>

        {/* Step 2 */}
        <div
          className={`bg-[#D70006]  hover:scale-105 cursor-pointer text-white rounded-[30px] overflow-hidden flex flex-col justify-between shadow-lg text-center transition-all duration-700 delay-150 ${
            sectionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex px-6 py-8 gap-2">
            <div className="text-[84px] -mt-8">2</div>
            <div className="flex flex-col">
              <h3 className="text-[20px] text-left font-medium">
                Fill Our Form
              </h3>
              <p className="text-sm text-left">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </p>
            </div>
          </div>
          <div>
            <img src={two.src} alt="Schedule a Wash" className="rounded-lg" />
          </div>
        </div>

        {/* Step 3 */}
        <div
          className={`bg-[#D70006]  hover:scale-105 cursor-pointer text-white rounded-[30px] overflow-hidden flex flex-col justify-between shadow-lg text-center transition-all duration-700 delay-300 ${
            sectionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex px-6 py-8 gap-2">
            <div className="text-[84px] -mt-8">3</div>
            <div className="flex flex-col">
              <h3 className="text-[20px] text-left font-medium">
                Schedule a Wash
              </h3>
              <p className="text-sm text-left">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </p>
            </div>
          </div>
          <div>
            <img src={three.src} alt="Schedule a Wash" className="rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};
const ThridSection = () => {
  return (
    <div className=" bg-black   py-10       h-screen   flex flex-col items-center justify-center">
      <div className=" flex  md:-mt-10 mt-20   items-center md:px-0 px-20 w-screen  justify-center">
        <img src={eyeleft.src} className="  md:w-1/3 h-full" alt="" />
        <img src={eyeright.src} className=" md:w-1/3 h-full" alt="" />
      </div>
      <div className=" text-center absolute   md:px-0 px-2 md:mt-20">
        <h1 className=" md:text-[70px] text-4xl text-white md:leading-[80px]">
          We get our own electricity and water{" "}
          <br className="  md:block hidden" />
          to ensure highest quality car wash{" "}
          <br className="  md:block hidden" />
          experience
        </h1>
      </div>
      <Link href={"/schedule"}> 
      <div className="    mt-32 flex items-center justify-center text-center md:rounded-[2px] rounded-lg overflow-hidden">
        <button className="bg-[#D70006] text-white w-[80%] px-5 py-3  font-semibold overflow-hidden">
          SCHEDULE WASH
        </button>
        <button className="bg-white text-black text-center font-semibold flex items-center justify-center px-6 py-3 w-[20%] whitespace-nowrap ">
          +
        </button>
      </div>
      </Link>
    </div>
  );
};

import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

const Testmonials = () => {
  const testimonials = [
    {
      rating: 5,
      title: "Quick and big Savings!",
      text: "Maxclean Diagnose My Issue feature is a game-changer. Identify problems in minutes and save both time and money. User-friendly and revolutionary.",
      author: "TechCarGeek",
      date: "12/10/2022",
    },
    {
      rating: 5,
      title: "Amazing Support!",
      text: "The customer support team is fantastic. They resolved my issue promptly and went above and beyond to help. Highly recommended.",
      author: "CarEnthusiast",
      date: "01/15/2023",
    },
    {
      rating: 5,
      title: "Efficient and Reliable!",
      text: "This tool saved me hours of troubleshooting. It's intuitive and delivers results quickly. A must-have for professionals.",
      author: "AutoPro",
      date: "02/20/2023",
    },
    {
      rating: 5,
      title: "Simply the Best!",
      text: "Maxclean sets the standard for excellence. Reliable, efficient, and easy to use. I can't recommend it enough.",
      author: "GarageGuru",
      date: "03/10/2023",
    },
    // Add more testimonials if needed...
  ];

  // const visibleCards = 4; // Number of visible cards at a time

  // Duplicate testimonials for seamless looping
  const loopTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="py-24 h-full flex flex-col items-center gap-10 bg-[#ECEFF3] w-screen overflow-hidden">
      <h1 className="text-6xl text-center md:text-[90px]">
        What our <span className="text-[#F1002E]">clients say</span>
      </h1>
      <motion.div
        className="flex gap-2 w-full"
        initial={{ x: 0 }}
        animate={{
          x: `-${(100 / loopTestimonials.length) * testimonials.length}%`,
        }}
        transition={{
          ease: "linear",
          duration: 10,
          repeat: Infinity,
        }}
      >
        {loopTestimonials.map((testimonial, index) => (
          <div
            key={index}
            className="px-10 py-10 rounded-[30px] flex flex-col justify-between w-[20rem] md:w-[24rem] h-[28rem] md:h-[32rem] bg-white shrink-0"
          >
            <div className="flex flex-col gap-4">
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <img
                    src={star.src} // Replace with your star image path
                    key={i}
                    className="w-6"
                    alt="Star"
                  />
                ))}
              </div>
              <h1 className="md:text-[28px] text-xl">{testimonial.title}</h1>
              <p className="md:text-lg  opacity-80">{testimonial.text}</p>
            </div>
            <div>
              <h1>{testimonial.author}</h1>
              <p>{testimonial.date}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Numbers = () => {
  // Track when the section is in view
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger only once
    threshold: 0.5, // Trigger when 50% of the section is visible
  });

  return (
    <div
      ref={ref}
      className="items-center flex flex-wrap py-40 gap-20 flex-col justify-center w-full text-white bg-[#D70006]"
    >
      <h1 className="text-5xl md:text-[80px] text-center">By the Numbers</h1>
      <div className="w-full flex-wrap flex flex-col items-center gap-6 justify-center">
        {/* Highlighted Section */}
        <div className="flex rounded-[30px] md:flex-row flex-col md:flex-nowrap flex-wrap items-center justify-center md:px-4 md:py-0 py-4 md:gap-10 bg-black w-[80%]">
          <h1 className="md:text-[90px] text-[70px]">
            {inView ? <CountUp start={0} end={2342} duration={2.5} /> : 0}
          </h1>
          <p className="text-2xl md:text-[46px] md:text-left text-center md:leading-[46px]">
            mobile app <br className="md:block hidden" />
            installations
          </p>
        </div>

        {/* Other Numbers */}
        <div className="flex-wrap md:flex-nowrap flex justify-around gap-6 w-[80%]">
          {/* Shop Owners Card 1 */}
          <div className="md:py-0 pb-4 bg-black w-full rounded-[30px] text-center">
            <h1 className="md:text-[90px] text-[70px]">
              {inView ? <CountUp start={0} end={1564} duration={2.5} /> : 0}
            </h1>
            <h2 className="text-[20px] -mt-6">shop owners</h2>
          </div>

          {/* Shop Owners Card 2 */}
          <div className="md:py-0 pb-4 text-center rounded-[30px] bg-black w-full">
            <h1 className="md:text-[90px] text-[70px]">
              {inView ? <CountUp start={0} end={1564} duration={2.5} /> : 0}
            </h1>
            <h2 className="text-[20px] -mt-6">shop owners</h2>
          </div>

          {/* Shop Owners Card 3 */}
          <div className="md:py-0 pb-4 bg-black text-center rounded-[30px] w-full">
            <h1 className="md:text-[90px] text-[70px]">
              {inView ? <CountUp start={0} end={1564} duration={2.5} /> : 0}
            </h1>
            <h2 className="text-[20px] -mt-6 md:mb-4 mb-0">shop owners</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

 const Footer = () => {
  return (
    <footer className=" text-white  w-full pt-8">
      {/* QR Code and Download Section */}
      <div
        className="text-center relative      py-32  bg-[#D70006]"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${dots.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5, // Adjust this value for desired opacity
            zIndex: -1,
          }}
        />
        {/* <img src={dots} alt="Dots" className="w-full   " /> */}
        <div className="flex justify-center mb-4">
          <img src={qr.src} alt="QR Code" className="w-36 rounded-lg h-36" />
        </div>
        <h2 className="md:text-[90px] md:whitespace-nowrap  whitespace-nowrap font-normal mb-4 text-4xl md:leading-[90px]">
          Download today, <br /> use as needed!
        </h2>
        <div className="flex mt-10 justify-center md:px-0 px-6 flex-col md:flex-row gap-4">
          <button className="bg-black  h-18 whitespace-nowrap md:text-[32px] font-normal justify-center text-white px-6 py-2 rounded-[16px] flex items-center">
            <img src={app.src} alt="App Store" className="md:h-8 mr-2 h-10" />
            App Store
          </button>
          <button className="bg-black   h-18 whitespace-nowrap md:text-[32px] font-normal justify-center text-white px-6 py-2 rounded-[16px] flex items-center">
            <img src={goo.src} alt="Google Play" className="md:h-6 h-10 mr-2" />
            Google Play
          </button>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-black flex flex-col  md:gap-8 gap-10 item-start md:items-center  md:px-16  px-4     pb-10 pt-16">
        <img src={logo.src} className=" w-56" alt="" />
        <div className="container mx-auto text-center md:flex  md:justify-between md:items-start">
          <div className="mb-4 md:mb-0">
            <h3 className="text-[24px] text-left font-bold text-[#D70006]">
              CALL US ANYTIME
            </h3>
            <p className="text-gray-400 text-lg font-medium  text-left">
              +91-8179004144
            </p>
            <h3 className="text-[24px] font-bold text-[#D70006] text-left mt-4">
              VISIT OUR LOCATION
            </h3>
            <p className="text-gray-400 text-lg font-medium  text-left">
              Hyderabad, India
            </p>
          </div>
          <div className="mb-4 md:mb-0  md:flex hidden    flex-col   items-center text-center">
            <div className=" text-white/70 flex gap-20  md:text-center text-left items-start justify-center text-[16px] mt-2">
              <div className="   items-start flex-col flex gap-2">
                <h1 className=" cursor-pointer">Privacy Policy</h1>
                <h1 className=" cursor-pointer">Terms of Service</h1>
              </div>
              <div className=" flex  flex-col items-start gap-2">
                <h1 className=" cursor-pointer">Shop Owners</h1>
                <h1 className=" cursor-pointer">Licences</h1>
              </div>
              <div className="  flex flex-col  gap-2 items-start">
                <h1 className=" cursor-pointer">Changelog</h1>
                <h1 className=" cursor-pointer">Schedule Wash</h1>
              </div>
            </div>
          </div>

          <div className="mb-4 md:mb-0  md:hidden flex     flex-col   ">
            <div className=" text-white/70 flex  flex-col  gap-4  text-[14px] mt-2">
              <div className="  flex gap-6 items-center ">
                <div className="   items-start flex-col flex gap-1">
                  <h1 className=" cursor-pointer">Privacy Policy</h1>
                  <h1 className=" cursor-pointer">Terms of Service</h1>
                </div>
                <div className=" flex  flex-col items-start gap-1">
                  <h1 className=" cursor-pointer">Shop Owners</h1>
                  <h1 className=" cursor-pointer">Licences</h1>
                </div>
              </div>
              <div className="   flex flex-col  gap-1 items-start">
                <h1 className=" cursor-pointer">Changelog</h1>
                <h1 className=" cursor-pointer">Schedule Wash</h1>
              </div>
            </div>
          </div>

            <Link href={"/schedule"}> 
          <div>
            <div className=" w-fit flex  items-center justify-center mt-4 md:mt-0 text-center rounded-[10px]  overflow-hidden">
              <button className="bg-[#D7000680]  text-white md:text-[18px] text-xs w-[80%] px-5 md:py-5 py-3  font-semibold overflow-hidden">
                SCHEDULE WASH
              </button>
              <button className="bg-white text-black md:text-[18px] text-xs h-fit   text-center font-semibold flex py-3 items-center justify-center px-5 md:py-5 w-[20%] whitespace-nowrap ">
                +
              </button>
            </div>
            <div className="flex md:justify-end items-center  mt-6 md:mt-6 gap-6">
              <img src={x.src} className=" w-5 h-full" alt="" />
              <img src={fb.src} alt="" className=" w-3  h-full" />
              <img src={insta.src} alt="" className=" w-5 h-full" />
              <img src={git.src} alt="" className=" w-5  h-full" />
            </div>
          </div>
          </Link>
        </div>
      </div>
      <div className=" bg-black md:gap-0 gap-2  md:flex-row flex-col flex justify-between  px-4 w-full md:px-28  py-4 ">
        <p className=" text-white/70 ">
          Designed by{" "}
          <span className="text-[#d70007e9] font-bold">TIC Global</span>
        </p>
        <p className="text-white/70  md:text-[14px]">
          © 2023 Maxclean. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
