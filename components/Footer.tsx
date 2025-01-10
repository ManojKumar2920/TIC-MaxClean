import React from "react";
import logo from "@/assets/logo.png";
import x from "@/assets/x.png";
import fb from "@/assets/fb.png";
import insta from "@/assets/insta.png";
import { BiLogoGmail as MailIcon } from "react-icons/bi";
import { FaLinkedinIn as Linkedin } from "react-icons/fa6";
import { BsTwitterX as XIcon } from "react-icons/bs";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black z-[180] text-white   pt-10 pb-3  w-full ">
      {/* QR Code and Download Section */}

      {/* Footer Bottom Section */}
      <div className="bg-black flex flex-col  md:gap-8 gap-10 item-start md:items-center  md:px-16  px-4    pb-10 pt-10">
        <Link href={"/"}>
          <h1 className="text-6xl font-bold helvetica">
            MAX<span className="text-red-500">CLEAN</span>
          </h1>
        </Link>
        <div className="container text-center md:flex  md:justify-between md:items-start">
          <div className="mb-4 md:mb-0">
            <h3 className="text-[24px] text-left font-bold text-[#D70006]">
              CALL US ANYTIME
            </h3>
            <p className="text-gray-400 text-lg font-medium text-left">
              <a href="tel:+918179987444" className="hover:underline">
                +91-8179987444
              </a>
            </p>


          </div>
          <div className="mb-4 md:mb-0  md:flex hidden    flex-col   items-center text-center">
            <div className=" text-white/70 flex gap-20  md:text-center text-left items-start justify-center text-[16px] mt-2">
              <div className="   items-center  flex gap-6">
                <Link href={"/privacy"} className=" cursor-pointer">
                  Privacy Policy
                </Link>
                <Link href={"/terms"} className=" cursor-pointer">
                  Terms of Service
                </Link>
              </div>

              {/* <div className="  flex flex-col  gap-2 items-start">
                <Link href={"/schedule"} className=" cursor-pointer">
                  Schedule Wash
                </Link>
              </div> */}
            </div>
          </div>

          <div className="mb-4 md:mb-0  md:hidden flex     flex-col   ">
            <div className=" text-white/70 flex  flex-col  gap-4  text-[14px] mt-2">
              <div className="  flex gap-6 items-center ">
                <div className="   items-start flex-col flex gap-1">
                  <Link href={"/privacy"} className=" cursor-pointer">
                    Privacy Policy
                  </Link>
                  <Link href={"/terms"} className=" cursor-pointer">
                    Terms of Service
                  </Link>
                </div>
              </div>
              {/* <div className="   flex flex-col  gap-1 items-start">
                <Link href={"/schedule"} className=" cursor-pointer">
                  Schedule Wash
                </Link>
              </div> */}
            </div>
          </div>

          <div>
            {/* <Link
              href={"/schedule"}
              className=" w-fit flex  items-center justify-center mt-4 md:mt-0 text-center rounded-[10px]  overflow-hidden"
            >
              <button className="bg-[#D7000680]  text-white md:text-[18px] text-xs w-[80%] px-5 md:py-5 py-3  font-semibold overflow-hidden">
                SCHEDULE WASH
              </button>
              <button className="bg-white text-black md:text-[18px] text-xs h-fit   text-center font-semibold flex py-3 items-center justify-center px-5 md:py-5 w-[20%] whitespace-nowrap ">
                +
              </button>
            </Link> */}
            <div className="flex md:justify-center items-center  mt-6 md:mt-6 gap-6">
              <Link
                href={
                  "https://www.instagram.com/maxcleanindia/profilecard/?igsh=dXR4emQzNXk2Mjdn"
                }
              >
                <img src={insta.src} alt="" className=" w-5 h-full" />
              </Link>
              <Link href={"https://x.com/mxclen?s=11"}>
                <XIcon className=" w-5 h-full" />
              </Link>
              {/* <Link href={'https://www.facebook.com/maxcleanindia'}><img src={fb.src} alt="" className=" w-3  h-full" /></Link> */}
              {/* <Link href={'https://www.linkedin.com/in/karthik-vallabhaneni-05b07733b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'}><Linkedin className=" w-5 h-full" /></Link> */}
              <Link href={"https://wa.me/8179987444"}>
                <WhatsappIcon className=" w-6 h-full" />
              </Link>
              <Link href={"mailto:maxcleanbusiness@gmail.com"}>
                <MailIcon className=" w-6 h-full" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-black md:gap-0 gap-2  md:mb-0 mb-2 md:flex-row flex-col flex justify-center  px-4 w-full md:px-28  py-4 ">
        {/* <p className=" text-white/70 ">
          Designed by{" "}
          <span className="text-[#d70007e9] font-bold">TIC Global</span>
        </p> */}
        <p className="text-white/70  md:text-[14px]">
          © {new Date().getFullYear()} <Link href={'/'}>Maxclean</Link>. All rights reserved..!
        </p>
      </div>
    </footer>
  );
};

export default Footer;
