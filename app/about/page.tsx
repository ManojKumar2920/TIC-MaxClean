"use client";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/NavBar";
import MobileBav from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import aboutBanner from "@/assets/about.png";
import shadow from "@/assets/aboutfooter.png";
import car from "@/assets/aboutfooter1.png";
import card from "@/assets/about3.png";
import v1 from "@/assets/v1.png";
import v2 from "@/assets/v2.png";
import v3 from "@/assets/v3.png";

const About = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Navbar />
      <MobileBav />
      <WhatWeDo />
      <Vision />
      <Footer />
    </div>
  );
};

const Vision = () => {
  const sectionRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [controls]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-16 lg:px-24 bg-[#ECEFF3] w-full"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl lg:text-[80px] text-center font-bold mb-8 md:mb-12">
          Our <span className="text-[#FF0000]">Vision</span>
        </h2>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-base md:text-xl text-center font-semibold leading-relaxed">
            Our primary objective is to establish and maintain the trust of our
            customers, recognizing it as our foremost goal. Through our
            unwavering commitment to earning this trust, we strive to deliver
            exceptional service that goes beyond expectations. We believe that
            by consistently prioritizing customer trust and providing
            outstanding service, we can build enduring relationships and foster
            satisfaction among those we serve.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const WhatWeDo = () => {
  return (
    <section className="relative bg-[#D70006] overflow-hidden w-full p-10 lg:p-0">
      <div className="absolute inset-0 bg-black/40 z-20" />

      <div className="absolute inset-0 z-10">
        <Image
          src={car.src}
          alt="Background Car"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 z-10">
        <Image
          src={shadow.src}
          alt="Shadow Overlay"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-30 h-full container mx-auto px-4 lg:px-8">
        <div className="flex flex-col h-full justify-center items-center text-white pt-10 md:pt-0">
          <div className="flex flex-col md:flex-row items-center lg:gap-16 gap-8 max-w-6xl p-2 lg:py-20 lg:mt-10">
            <div className=" flex items-center flex-col">
              <h2 className="text-3xl md:text-5xl lg:text-[60px] font-bold mb-8 md:mb-12">
                What we do?
              </h2>
              <div className="max-w-2xl">
                <p className="text-sm md:text-lg lg:text-xl text-center md:text-left leading-relaxed">
                  At our mobile car wash service, we bring the convenience of a
                  pristine vehicle directly to your doorstep. Our dedicated team
                  of professionals utilizes latest techniques to deliver a
                  thorough and efficient car washing experience. From exterior
                  detailing that restores your vehicle's shine to interior
                  cleaning that leaves every nook spotless, we cater to your
                  car's specific needs. With our commitment to quality, time
                  efficiency, and environmental responsibility, we ensure your
                  car not only looks its best but also receives care that aligns
                  with modern standards. Experience the ease of a superior
                  mobile car wash that transforms your car into a symbol of
                  cleanliness and sophistication.
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <Image
                src={card.src}
                alt="Car Wash Service"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
