 


"use client";
import React from "react";
import Navbar from "@/components/NavBar";
import Banner from "@/assets/Banner.png";
import one from "@/assets/home1.png";
import two from "@/assets/home2.png";
import three from "@/assets/home3.png";
import eyeleft from "@/assets/eyeleft.png";
import eyeright from "@/assets/eyeright.png";
import star from "@/assets/star.png";
import Mobilenav from "../components/MobileNavbar";

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
      {/* <Numbers /> */}
      <Faq />
      <Footer />
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
      controls={false}
      preload="auto"
      poster={Banner.src}
      className="absolute inset-0 h-full w-full object-cover"
      onLoadedMetadata={(e) => {
        const video = e.target as HTMLVideoElement;
        video.play().catch(error => {
          console.log("Auto-play failed:", error);
        });
      }}
    >
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
              Create an account or log in to get started with our services.
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
              Provide your vehicle details and preferences for a personalized wash.
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
              Hit on schedule wash and relax while we restore your car’s shine!
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
        {/* <img src={eyeleft.src} className="  md:w-1/3 h-full" alt="" />
        <img src={eyeright.src} className=" md:w-1/3 h-full" alt="" /> */}
      </div>
      <div className=" text-center   md:px-0 px-2 md:mt-20">
        <h1 className=" md:text-[70px] text-4xl text-white md:leading-[80px]">
          We get our own electricity and water{" "}
          <br className="  md:block hidden" />
          to ensure highest quality car wash{" "}
          <br className="  md:block hidden" />
          experience
        </h1>
      </div>
      <Link href={"/schedule"}> 
      <div className="  pt-[70px] flex items-center justify-center text-center md:rounded-[2px] rounded-lg overflow-hidden">
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
import Footer from "@/components/Footer";
// import { Link } from "react-router-dom";

const Testmonials = () => {
  const testimonials = [
    {
      rating: 5,
      title: "Amazing Job!",
      text: "Max clean did an amazing job with foam cleaning for my car. The team was professional, efficient, and exceeded my expectations. I highly recommend them.",
      author: "TechCarGeek",
      date: "27/06/2024",
    },
    {
      rating: 5,
      title: "Amazing Support!",
      text: "The customer support team is fantastic. They resolved my issue promptly and went above and beyond to help. Highly recommended.",
      author: "CarEnthusiast",
      date: "22/11/2024",
    },
    {
      rating: 5,
      title: "Professional and Punctual!",
      text: "Convenient and on time! MAXCLEAN sent a professional to my location with in no time when I called them and they cleaned every corner of my car in short time!",
      author: "AutoPro",
      date: "27/10/2024",
    },
    {
      rating: 5,
      title: "Simply the Best!",
      text: "Maxclean sets the standard for excellence. Reliable, efficient, and easy to use. I can't recommend it enough.",
      author: "GarageGuru",
      date: "16/08/2024",
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
              {/* <h1>{testimonial.author}</h1> */}
              <p>{testimonial.date}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// const Numbers = () => {
//   // Track when the section is in view
//   const { ref, inView } = useInView({
//     triggerOnce: true, // Trigger only once
//     threshold: 0.5, // Trigger when 50% of the section is visible
//   });

//   return (
//     <div
//       ref={ref}
//       className="items-center flex flex-wrap py-40 gap-20 flex-col justify-center w-full text-white bg-[#D70006]"
//     >
//       <h1 className="text-5xl md:text-[80px] text-center">By the Numbers</h1>
//       <div className="w-full flex-wrap flex flex-col items-center gap-6 justify-center">
//         {/* Highlighted Section */}
//         <div className="flex rounded-[30px] md:flex-row flex-col md:flex-nowrap flex-wrap items-center justify-center md:px-4 md:py-0 py-4 md:gap-10 bg-black w-[80%]">
//           <h1 className="md:text-[90px] text-[70px]">
//             {inView ? <CountUp start={0} end={2342} duration={2.5} /> : 0}
//           </h1>
//           <p className="text-2xl md:text-[46px] md:text-left text-center md:leading-[46px]">
//             mobile app <br className="md:block hidden" />
//             installations
//           </p>
//         </div>

//         {/* Other Numbers */}
//         <div className="flex-wrap md:flex-nowrap flex justify-around gap-6 w-[80%]">
//           {/* Shop Owners Card 1 */}
//           <div className="md:py-0 pb-4 bg-black w-full rounded-[30px] text-center">
//             <h1 className="md:text-[90px] text-[70px]">
//               {inView ? <CountUp start={0} end={1564} duration={2.5} /> : 0}
//             </h1>
//             <h2 className="text-[20px] -mt-6">shop owners</h2>
//           </div>

//           {/* Shop Owners Card 2 */}
//           <div className="md:py-0 pb-4 text-center rounded-[30px] bg-black w-full">
//             <h1 className="md:text-[90px] text-[70px]">
//               {inView ? <CountUp start={0} end={1564} duration={2.5} /> : 0}
//             </h1>
//             <h2 className="text-[20px] -mt-6">shop owners</h2>
//           </div>

//           {/* Shop Owners Card 3 */}
//           <div className="md:py-0 pb-4 bg-black text-center rounded-[30px] w-full">
//             <h1 className="md:text-[90px] text-[70px]">
//               {inView ? <CountUp start={0} end={1564} duration={2.5} /> : 0}
//             </h1>
//             <h2 className="text-[20px] -mt-6 md:mb-4 mb-0">shop owners</h2>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
