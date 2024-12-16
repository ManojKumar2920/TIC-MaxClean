"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/NavBar";
import MobileNavbar from "@/components/MobileNavbar";
import Banner from "@/assets/reviewBanner.png";
import face1 from "@/assets/face1.png";
import wheel from "@/assets/wheel.png";
import clean from "@/assets/clean.png";
import whyface from "@/assets/whyface.png";
// import logo from "@/assets/logo.png";
// import x from "@/assets/x.png";
// import fb from "@/assets/fb.png";
// import insta from "@/assets/insta.png";
// import git from "@/assets/git.png";
import Footer from "@/components/Footer";
// import CountUp from "react-countup";
import Link from "next/link";

const Review = () => {
  return (
    <div className="w-full overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <MobileNavbar />
      <Hero />
      <UserReviews />
      <WhyChoose />
      <Footer />
    </div>
  );
};

export default Review;

const Hero = () => {
  return (
    <div
      className="relative h-screen w-screen bg-cover flex items-center px-10 bg-center text-white"
      style={{ backgroundImage: `url(${Banner.src})` }}
    >
      <div className="  flex flex-col gap-4 items-center md:items-end md:absolute bottom-20 right-20">
        <h1 className=" font-medium text-6xl md:text-[100px] md:leading-[74px] text-center  md:text-right">
          Why Choose Maxclean
        </h1>
        <p className=" md:text-right   text-center text-xl md:text-[20px] font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor <br /> incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis 
        </p>
        <Link href={"/schedule"}>
          <div className=" w-fit flex items-center justify-center text-center rounded-[10px] overflow-hidden">
            <button className="bg-[#D70006] text-white w-[80%] px-5 py-3  font-semibold overflow-hidden">
              SCHEDULE WASH
            </button>
            <button className="bg-black text-white text-center font-semibold flex items-center justify-center px-5 py-3 w-[20%] whitespace-nowrap ">
              +
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

import { motion } from "framer-motion";

const UserReviews = () => {
  const [isInView, setIsInView] = useState(false);
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 } // Adjust the threshold as needed
    );

    if (reviewSectionRef.current) {
      observer.observe(reviewSectionRef.current);
    }

    return () => {
      if (reviewSectionRef.current) {
        observer.unobserve(reviewSectionRef.current);
      }
    };
  }, []);
  return (
    <div
      className="w-full bg-black text-white py-20 flex flex-col items-center justify-center"
      ref={reviewSectionRef}
    >
      <h1 className="text-6xl md:px-0 px-6 md:text-[80px]">
        Maxclean’s <span className="text-[#D70006]">Reviews</span>
      </h1>
      <div className="md:w-[80%] w-full mt-10 md:h-[90vh] md:mt-40 flex flex-col items-center gap-4">
        <div className="w-full md:relative flex flex-row md:flex-col gap-4">
          <ReviewCard direction="right" isInView={isInView} />
          <ReviewCard12 direction="left" isInView={isInView} />
          <ReviewCard1 direction="right" isInView={isInView} />
          <ReviewCard2 direction="left" isInView={isInView} />
          <ReviewCard3 direction="right" isInView={isInView} />

          <ReviewCardM />
          <ReviewCardM />
          <ReviewCardM />
          <ReviewCardM />
          <ReviewCardM />
        </div>
      </div>
    </div>
  );
};

const cardVariants = {
  hidden: (direction: string) => ({
    opacity: 0,
    x: direction === "right" ? 100 : -100,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

const ReviewCard = ({
  direction,
  isInView,
}: {
  direction: string;
  isInView: boolean;
}) => {
  return (
    <motion.div
      className="hidden md:flex absolute left-1/3 z-[5] backdrop-blur-md scale-90 top-[23rem] shadow-2xl bg-[#e3e4e9aa] text-black w-[40%] px-4 py-4 gap-4 rounded-[18px]"
      variants={cardVariants}
      custom={direction}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <img src={face1.src} className="w-14 h-14" alt="" />
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold">Martin Gofffutry</h1>
        <h1 className="text-[14px] font-semibold text-[#B9B9B9]">
          From Google reviews
        </h1>
        <p className="text-[14px] mt-3">
          Dico is finally addressing a long-time problem we had when building
          UIs. Its ease of use and workflow seem really intuitive. Promising!
        </p>
        <p className="text-[#B9B9B9] mt-4 ml-4 font-semibold">
          Maxclean user, 2021.03.02
        </p>
      </div>
    </motion.div>
  );
};

// Similarly update ReviewCard12, ReviewCard1, ReviewCard2, and ReviewCard3 components
const ReviewCard12 = ({
  direction,
  isInView,
}: {
  direction: string;
  isInView: boolean;
}) => {
  return (
    <motion.div
      className="hidden md:flex absolute left-52 scale-90 top-[19rem] z-[3]  backdrop-blur-md shadow-2xl bg-[#9EA1A8] text-black w-[40%] px-6 py-6 gap-4 rounded-[18px]"
      variants={cardVariants}
      custom={direction}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <img src={face1.src} className="w-14 h-14" alt="" />
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold">Theddddo Champion</h1>
        <h1 className="text-[14px] font-semibold text-[#B9B9B9]">
          From Google reviews
        </h1>
        <p className="text-[14px] mt-3">
          Dico is finally addressing a long-time problem we had when building
          UIs. Its ease of use and workflow seem really intuitive. Promising!
        </p>
        <p className="text-[#B9B9B9] mt-4 ml-4 font-semibold">
          Maxclean user, 2021.03.02
        </p>
      </div>
    </motion.div>
  );
};

const ReviewCard1 = ({
  direction,
  isInView,
}: {
  direction: string;
  isInView: boolean;
}) => {
  return (
    <motion.div
      className="hidden md:flex absolute left-44 top-24 z-[4] shadow-2xl bg-[#f7f6fbf7] text-black w-[40%] px-6 py-6 gap-4 rounded-[18px]"
      variants={cardVariants}
      custom={direction}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <img src={face1.src} className="w-14 h-14" alt="" />
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold">Theo Champion</h1>
        <h1 className="text-[14px] font-semibold text-[#B9B9B9]">
          From Google reviews
        </h1>
        <p className="text-[14px] mt-3">
          Dico is finally addressing a long-time problem we had when building
          UIs. Its ease of use and workflow seem really intuitive. Promising!
        </p>
        <p className="text-[#B9B9B9] mt-4 ml-4 font-semibold">
          Maxclean user, 2021.03.02
        </p>
      </div>
    </motion.div>
  );
};

const ReviewCard2 = ({
  direction,
  isInView,
}: {
  direction: string;
  isInView: boolean;
}) => {
  return (
    <motion.div
      className="hidden md:flex absolute right-44 z-[10] -top-14 shadow-2xl bg-[#F7F6FB] text-black w-[40%] px-6 py-6 gap-4 rounded-[18px]"
      variants={cardVariants}
      custom={direction}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <img src={face1.src} className="w-14 h-14" alt="" />
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold">Martin Goutry</h1>
        <h1 className="text-[14px] font-semibold text-[#B9B9B9]">
          From Google reviews
        </h1>
        <p className="text-[14px] mt-3">
          Dico is finally addressing a long-time problem we had when building
          UIs. Its ease of use and workflow seem really intuitive. Promising!
        </p>
        <p className="text-[#B9B9B9] mt-4 ml-4 font-semibold">
          Maxclean user, 2021.03.02
        </p>
      </div>
    </motion.div>
  );
};

const ReviewCard3 = ({
  direction,
  isInView,
}: {
  direction: string;
  isInView: boolean;
}) => {
  return (
    <motion.div
      className="hidden md:flex absolute right-20 z-[20] top-40 shadow-2xl bg-[#FFFFFF] text-black w-[40%] px-6 py-6 gap-4 rounded-[18px]"
      variants={cardVariants}
      custom={direction}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <img src={face1.src} className="w-14 h-14" alt="" />
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold">Agnes Remi</h1>
        <h1 className="text-[14px] font-semibold text-[#B9B9B9]">
          From Google reviews
        </h1>
        <p className="text-[14px] mt-3">
          Dico is finally addressing a long-time problem we had when building
          UIs. Its ease of use and workflow seem really intuitive. Promising!
        </p>
        <p className="text-[#B9B9B9] mt-4 ml-4 font-semibold">
          Maxclean user, 2021.03.02
        </p>
      </div>
    </motion.div>
  );
};

const WhyChoose = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter85k, setCounter85k] = useState(0);
  const [counter50k, setCounter50k] = useState(0);

  // Intersection Observer to trigger counting when the section is in the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect after it's visible once
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is in view
    );

    const element = document.getElementById("why-choose-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Counter increment effect for both counters
  useEffect(() => {
    if (isVisible) {
      // For counter 85k
      const interval85k = setInterval(() => {
        setCounter85k((prev) => (prev < 85 ? prev + 1 : 85));
      }, 30); // Speed of increment for 85k

      // For counter 50k
      const interval50k = setInterval(() => {
        setCounter50k((prev) => (prev < 50 ? prev + 1 : 50));
      }, 50); // Speed of increment for 50k

      // Clear intervals when the counting is done
      return () => {
        clearInterval(interval85k);
        clearInterval(interval50k);
      };
    }
  }, [isVisible]); // Only re-run when visibility changes

  return (
    <div
      id="why-choose-section"
      className="w-full bg-[#ECEFF3] text-black py-20 flex flex-col items-center justify-center"
    >
      <h1 className="md:px-0 px-6 text-6xl text-center md:text-[80px]">
        Why choose <span className="text-[#D70006]">us</span>
      </h1>
      <div className="md:flex-row flex-col py-20 flex items-center justify-center gap-8 w-full px-6 md:px-40">
        <div className="flex items-start justify-center gap-10">
          <div className="flex flex-col items-center justify-center">
            <img
              src={wheel.src}
              className="rounded-full h-[350px] object-cover w-full"
              alt=""
            />
            <div className="bg-black border-t-4 -mt-10 justify-center gap-10 w-[90%] px-2 flex items-center py-3 rounded-xl">
              <div className="flex -space-x-5 overflow-hidden">
                <img
                  className="inline-block h-12 w-12 rounded-full ring-white"
                  src={whyface.src}
                  alt=""
                />
                <img
                  className="inline-block h-12 w-12 rounded-full ring-white"
                  src={whyface.src}
                  alt=""
                />
                <img
                  className="inline-block h-12 w-12 rounded-full ring-white"
                  src={whyface.src}
                  alt=""
                />
              </div>
              <div className="text-white items-start justify-center flex flex-col leading-3">
                <h1 className="text-3xl">4.9 star</h1>
                <h1 className="text-[16px]">Reviews</h1>
              </div>
            </div>
          </div>

          <img
            src={clean.src}
            className="hidden md:block h-full object-cover w-[40%]"
            alt=""
          />
        </div>
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-[20px] border-b pb-6 md:pb-4 border-[#938E8E] w-fit">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, <br /> sed
            do eiusmod tempor Lorem ipsum dolor sit amet.
          </h1>
          <div className="w-fit gap-10 md:gap-20 flex">
            <div className="border-r pr-10 md:pr-32 border-[#938E8E]">
              <h1 className="text-[40px] font-medium">{counter85k}k +</h1>
              <h2 className="text-[#5D5656] text-[20px]">Total car washed</h2>
            </div>
            <div>
              <h1 className="text-[40px] font-medium">{counter50k}k</h1>
              <h2 className="text-[#5D5656] text-[20px]">Happy Clients</h2>
            </div>
          </div>
          <hr className="border-0.5 hidden md:block border-[#938E8E] w-[90%]" />
          <div className="text-[20px] flex flex-col gap-4 text-[#4B4545]">
            {/* Icons with text */}
            {[
              "Lorem ipsum dolor sit amet, consectetur",
              "Lorem ipsum dolor sit amet, consectetur",
              "Lorem ipsum dolor sit amet, consectetur",
            ].map((text, index) => (
              <div className="flex items-center gap-4" key={index}>
                <svg
                  width="23"
                  height="19"
                  viewBox="0 0 23 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.4699 2.38624L8.37829 18.6035C8.25349 18.7484 8.0833 18.8302 7.90554 18.8308C7.72778 18.8314 7.55717 18.7508 7.43163 18.6067L0.223814 10.4088C0.0972322 10.2662 0.0257436 10.0714 0.0252195 9.86795C0.0246957 9.66461 0.0951801 9.46941 0.221024 9.32575L1.1516 8.25479C1.2764 8.11006 1.44659 8.02818 1.62435 8.02758C1.80211 8.02698 1.97272 8.10771 2.09827 8.2516L7.88859 14.8373L20.5843 0.226445C20.8473 -0.0670096 21.2665 -0.0684229 21.531 0.223253L22.4671 1.30317C22.5938 1.44596 22.6652 1.64067 22.6657 1.84404C22.6662 2.04741 22.5958 2.24259 22.4699 2.38624Z"
                    fill="#D70006"
                  />
                </svg>
                <h1>{text}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewCardM = () => {
  return (
    <>
      <div>
        <div className="flex md:hidden w-[80vw] z-[5] backdrop-blur-md shadow-2xl bg-[#e3e4e9aa] text-black px-5 py-5 gap-4 rounded-[18px] animate-marquee">
          <img src={face1.src} className="w-8 h-8" alt="" />
          <div className="flex flex-col gap-1 w-full">
            <h1 className="text-[18px] font-semibold">Martin Gofffutry</h1>
            <h1 className="text-[12px] font-semibold text-[#B9B9B9]">
              From Google reviews
            </h1>
            <p className="text-[12px] w-full mt-3">
              Dico is finally addressing a long time problem we had when
              building UIs. It’s ease of use and workflow seems really
              intuitive. Promising!
            </p>
            <p className="text-[#B9B9B9] mt-4 ml-4 font-semibold">
              Maxclean user, 2021.03.02
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
