"use client";
import MobileNavbar from "@/components/MobileNavbar";
import Navbar from "@/components/NavBar";
import React from "react";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div className="w-full bg-[#ECEFF3] overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <MobileNavbar />
      <div className="w-full mt-10 bg-[#ECEFF3] px-4 md:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl text-center font-bold text-[#D70006] mb-8">Terms and Conditions</h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-700 mb-6 text-lg">
              For the purpose of these Terms and Conditions, The term "we", "us",
              "our" used anywhere on this page shall mean MAXCLEAN SERVICES PRIVATE
              LIMITED, whose registered/operational office is Nizampet Hyderabad
              TELANGANA 500090. "you", "your", "user", "visitor" shall mean any
              natural or legal person who is visiting our website and/or agreed to
              purchase from us.
            </p>
            <h2 className="text-2xl font-semibold text-[#D70006] mb-4">Your Agreement</h2>
            <p className="text-gray-700 mb-4 text-lg">
              Your use of the website and/or purchase from us are governed by
              following Terms and Conditions:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li className="text-lg">
                The content of the pages of this website is subject to change
                without notice.
              </li>
              <li className="text-lg">
                Neither we nor any third parties provide any warranty or guarantee
                as to the accuracy, timeliness, performance, completeness or
                suitability of the information and materials found or offered on
                this website for any particular purpose.
              </li>
              <li className="text-lg">
                Your use of any information or materials on our website and/or
                product pages is entirely at your own risk, for which we shall not
                be liable.
              </li>
              <li className="text-lg">
                Our website contains material which is owned by or licensed to us.
                This material includes, but is not limited to, the design, layout,
                look, appearance and graphics.
              </li>
              <li className="text-lg">
                Unauthorized use of this website may give rise to a claim for
                damages and/or be a criminal offense.
              </li>
              <li className="text-lg">
                From time to time, our website may also include links to other
                websites. These links are provided for your convenience to provide
                further information.
              </li>
              <li className="text-lg">
                You may not create a link to this website from another website or
                document without MAXCLEAN SERVICES PRIVATE LIMITED's prior written
                consent.
              </li>
              <li className="text-lg">
                Any dispute arising out of use of our website and/or purchase with
                us and/or any engagement with us is subject to the laws of India.
              </li>
              <li className="text-lg">
                We shall be under no liability whatsoever in respect of any loss or
                damage arising directly or indirectly out of the decline of
                authorization for any transaction.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
