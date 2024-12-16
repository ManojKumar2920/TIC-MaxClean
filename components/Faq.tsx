import React from 'react'
import { useState } from 'react';


const Faq = () => {
    const faqs = [
      {
        question: "How can I get the best deal on car services for my vehicle?",
        answer:
          "You can check for offers and promotions on the Maxclean website or app.",
      },
      {
        question:
          "Will I know the cost upfront before booking a service with Maxclean?",
        answer:
          "Yes, Maxclean provides a detailed estimate before confirming your booking.",
      },
      {
        question:
          "How quickly can I diagnose an unknown issue with my car using Maxclean?",
        answer:
          "Maxclean offers quick diagnostics through its app and website for faster assistance.",
      },
      {
        question: "Can I request repairs through the Maxclean website?",
        answer:
          "Yes, you can schedule repairs directly through the Maxclean website or app.",
      },
    ];
  
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
    const toggleFaq = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <div className="py-20 px-40  flex  flex-col  md:px-20     items-center gap-4 ">
        <h1 className="text-[40px]   md:text-[90px] md:whitespace-normal whitespace-nowrap       font-normal text-center">
          Frequently asked <br  className=' block md:hidden'/> <span className="text-[#FF0000]">Questions</span>
        </h1>
        <div className="mt-10 space-y-8 md:px-32 px-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-300/50 pb-4 cursor-pointer"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-[22px]  font-medium">{faq.question}</h2>
                <button className="text-2xl font-bold">
                  {openIndex === index ? "-" : "+"}
                </button>
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12  flex border md:gap-0 gap-4   md:flex-row flex-col  border-gray-300/20  rounded-md  md:w-[80%]  px-4   py-4 items-center  justify-between   ">
          <p className="text-black  text-center">
            Cant find what youre looking for? <br className=" md:block hidden" />
            Contact us here:
          </p>
          <a
            href="tel:+919876543210"
            className="text-[#FF0000] border  whitespace-nowrap  rounded-lg px-8 py-2 font-bold text-lg"
          >
            +91 9876543210
          </a>
        </div>
      </div>
    );
  };
export default Faq