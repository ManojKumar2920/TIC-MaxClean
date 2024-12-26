import React from 'react'
import { useState } from 'react';


const Faq = () => {
    const faqs = [
      {
        question: "How can I get the best deal on car services for my vehicle?",
        answer:
          "To be updated and get the best deals regarding car wash and other services, do follow us on Instagram, X and other social media platforms",
      },
      {
        question:
          "Will I know the cost upfront before booking a service with Maxclean?",
        answer:
          "Yes! Being transparent with pricing and services is in our DNA. Check out our pricing page for more details regarding available services and prices",
      },
      {
        question:
          "How much time will it take to get my car washed?",
        answer:
          "Typically 45 minutes - 75 minutes based on the size of the car. Most hatchbacks take 45 minutes, sedans/mini SUV’s take around 60 minutes, SUV’s, MUV’s and minivans take 75 minutes",
      },
      {
        question: "Does Maxclean come fully equipped with water and electricity?",
        answer:
          "Yes!! We get our own water and electricity for the best car wash experience for the customer",
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
            +91-8179987444
          </a>
        </div>
      </div>
    );
  };
export default Faq