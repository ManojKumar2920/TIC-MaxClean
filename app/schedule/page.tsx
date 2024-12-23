"use client";
import React from "react";
import dark from "@/assets/dark.png";
import bubble from "@/assets/pixelcut-export.png";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import Navbar from "@/components/NavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import Image from "next/image";

const ScheduleWash = () => {
  return (
    <div className="w-full overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <MobileNavbar />
      {/* <Hero /> */}
      <Booking />
      <Faq />
      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
      {/* <Footer /> */}
      {/* <Footer /> */}
    </div>
  );
};


export default ScheduleWash;

const Hero = () => {
  return (
    <div
      id="hero-section"
      className="relative h-screen  bg-cover w-full text-white   flex items-center justify-center"
      style={{ backgroundImage: `url(${bubble.src})` }}
    >
      <Image
        src={dark.src}
        alt=""
        className="w-full h-full object-cover -z-[1]"
      />
      <div className=" text-center  flex flex-col gap-6 items-center mt-10 absolute ">
        <h1 className=" font-medium md:text-[65px] text-6xl md:leading-[74px] ">
          Car wash at your <br className=" md:block hidden" />
          Doorstep?
        </h1>
        <p className=" font-medium text-[20px] leading-[30px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor <br />
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis 
        </p>
        <div className=" shadow-2xl w-fit flex items-center justify-center text-center rounded-[10px] overflow-hidden">
          <button className="bg-[#D70006] text-white w-full px-8 py-4  font-semibold overflow-hidden">
            SCHEDULE WASH
          </button>
          <button className="bg-black text-white text-center font-semibold flex items-center justify-center px-8 py-4 w-[20%] whitespace-nowrap ">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

type AvailableSlots = {
  [date: string]: string[]; // date as string, and slots as an array of strings
};

const Booking = () => {
  const servicePrices: { [key: string]: string } = {
    "Car foam wash": "679",
    "Car + Bike combo": "899",
    "Bi Weekly": "1199",
    "Weekly": "2199",
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setPrice(servicePrices[service] || ""); // Set price based on the selected service
  };

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSlotChange = (e: any) => {
    setSelectedSlot(e.target.value);
    const [date, slot] = e.target.value.split("|");
    setSelectedDate(date);
    console.log("Selected Date:", date);
    console.log("Selected Slot:", slot);
  };

  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");

  const [slotsError, setSlotsError] = useState("");

  const [availableSlots, setAvailableSlots] = useState<{
    [date: string]: string[];
  }>({});

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch("/api/available-slots");
        const data = await response.json();

        // Check if slots are actually available
        const hasAvailableSlots = Object.values(
          data as Record<string, string[]>
        ).some((slots) => slots.length > 0);

        if (!hasAvailableSlots) {
          setSlotsError(
            "No available slots at the moment. Please try another date."
          );
        }

        setAvailableSlots(data);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setSlotsError(
          "Unable to fetch available slots. Please try again later."
        );
        toast.error("Error fetching available slots.");
      }
    };

    fetchAvailableSlots();
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/user"); // The API route to get user details
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        setUserDetails({
          name: data.user.firstName + " " + (data.user.lastName || ""),
          email: data.user.email,
          phoneNumber: data.user.phoneNumber || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Unable to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // if (!availableSlots || Object.keys(availableSlots).length === 0) {
  //   return <div></div>;
  // }

  const initiatePayment = async (orderId: string) => {
    try {
      // Step 1: Make the request to the backend to create the Razorpay order
      const response = await fetch(`/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId, // Pass the MongoDB orderId to backend
        }),
      });

      console.log(orderId)
  
      const orderResult = await response.json();
      console.log("Order Result:", orderResult); // Log the response to ensure correct data
  
      if (!response.ok) {
        throw new Error(orderResult.message || "Failed to create order");
      }
  
      const { orderId: razorpayOrderId, key } = orderResult; // Extract Razorpay orderId and key
      if (!razorpayOrderId || !key) {
        console.error("Order ID or key is missing in Razorpay response");
        return;
      }
  
      console.log("Razorpay Order ID:", razorpayOrderId); 

  
      const options = {
        key,
        amount: parseInt(price) * 100, 
        currency: "INR",
        name: "MaxClean",
        description: `${selectedService} Service`,
        order_id: razorpayOrderId, 
        handler: async (response: any) => {
          console.log("Razorpay response:", response); 

          // Step 3: Verify payment after successful payment
          const verifyResponse = await fetch("/api/payment/verify-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId, // MongoDB orderId for verification
            }),
          });
  
          const verifyResult = await verifyResponse.json();
          console.log("Verify Order Result:", verifyResult); // Log the verification result
  
          if (verifyResponse.ok) {
            toast.success("Payment successful!");
            resetForm();
          } else {
            toast.error(verifyResult.message || "Payment verification failed");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phoneNumber,
        },
        theme: {
          color: "#D70006",
        },
        modal: {
          ondismiss: async () => {
            // Handle cancellation scenario
            const response = await fetch("/api/payment/cancel-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId
              }),
            });
  
            const data = await response.json();
            console.log("Cancel Order Result:", data);
  
            if (response.ok) {
              toast.info("Payment was cancelled.");
              resetForm();
            } else {
              toast.error("Failed to update payment status.");
            }
          },
        },
      };
  
      // Open Razorpay payment modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      setError(error instanceof Error ? error.message : "Payment initiation failed");
    }
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = [];
    if (!userDetails.name.trim()) validationErrors.push("Name is required");
    if (!selectedService)
      validationErrors.push("Service selection is required");
    if (!selectedSlot) validationErrors.push("Time slot is required");
    if (!address.trim()) validationErrors.push("Address is required");
    if (!pincode.trim()) validationErrors.push("Pincode is required");

    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    try {
      const orderData = {
        name: userDetails.name.trim(),
        email: userDetails.email.trim(),
        phoneNumber: userDetails.phoneNumber.trim(),
        service: selectedService,
        price,
        address: address.trim(),
        landmark: landmark.trim(),
        pincode: pincode.trim(),
        date: selectedDate,
        timeSlot: selectedSlot,
        notes: notes.trim(),
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        await initiatePayment(data.orderId);
      } else {
        toast.error(data.message || "Order Confirmation failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Optional reset form function
  const resetForm = () => {
    setSelectedService("");
    setPrice("");
    setSelectedSlot("");
    setSelectedDate("");
    setAddress("");
    setLandmark("");
    setPincode("");
    setNotes("");
  };

  return (
    <div className="py-20 mt-10 w-full flex flex-col h-full items-center gap-14">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="md:text-[60px] text-5xl text-center">
        Book an appointment <span className="text-[#D70006]">now</span>
      </h1>
      <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full md:w-1/2"
        >
          <div className="flex flex-col items-center md:flex-row gap-6 w-full">
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Name*"
            />
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Email*"
            />
          </div>
          <div className="flex flex-col items-center md:flex-row gap-6 w-full">
            <input
              type="text"
              value={userDetails.phoneNumber}
              onChange={(e) =>
                setUserDetails({ ...userDetails, phoneNumber: e.target.value })
              }
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Mobile Number*"
            />
            <select
              value={selectedService}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="block outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
            >
              <option value="" disabled>
                Select a Service*
              </option>
              {Object.keys(servicePrices).map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center md:flex-row gap-6 w-full">
            <input
              type="text"
              value={price}
              readOnly
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%] cursor-not-allowed"
              placeholder="Price*"
            />
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Pincode*"
            />
          </div>
          <select
            id="timeSlot"
            className="block bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-full outline-gray-500 rounded-[8px]"
            value={selectedSlot ? `${selectedDate}|${selectedSlot}` : ""}
            onChange={(e) => {
              if (e.target.value) {
                const [date, slot] = e.target.value.split("|");
                setSelectedDate(date);
                setSelectedSlot(slot);
              } else {
                setSelectedDate("");
                setSelectedSlot("");
              }
            }}
          >
            <option value="" disabled>
              Choose a time slot
            </option>
            {Object.keys(availableSlots).length === 0 ? (
              <option disabled>No slots available</option>
            ) : (
              Object.keys(availableSlots).map(
                (date) =>
                  availableSlots[date].length > 0 && (
                    <optgroup key={date} label={date}>
                      {availableSlots[date].map((slot) => (
                        <option
                          key={`${date}|${slot}`}
                          value={`${date}|${slot}`}
                        >
                          {slot}
                        </option>
                      ))}
                    </optgroup>
                  )
              )
            )}
          </select>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-[#F7F8FA] w-[90%] md:w-full px-4 py-4 outline-gray-500 rounded-[8px]"
            placeholder="Address*"
          />
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="bg-[#F7F8FA] w-[90%] md:w-full px-4 py-4 outline-gray-500 rounded-[8px]"
            placeholder="Landmark*"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-[#F7F8FA] mt-2 w-[90%] md:w-full px-4 py-4 h-60 outline-gray-500 rounded-[8px]"
            placeholder="Additional Notes (optional)"
          ></textarea>

          {error && <div className="text-red-500">{error}</div>}

          <button
            type="submit"
            className="text-white text-xl w-[90%] md:w-full mt-2 bg-black whitespace-nowrap rounded-[8px] py-3"
          >
            Book Order
          </button>
        </form>

        {/* Sidebar */}
        <div className="hidden md:flex flex-col gap-10 py-14 px-8 bg-[#D70006] text-white rounded-[20px] w-full md:w-1/3">
          <div>
            <h1 className="text-3xl mb-2">Address</h1>
            <p>Hyderabad, India</p>
          </div>
          <div>
            <h1 className="text-3xl mb-2">Contact</h1>
            <p>
              Phone: <a href="tel:+91-8179987444">+91-8179987444 </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:maxcleanbusiness@gmail.com">
                maxcleanbusiness@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h1 className="text-3xl mb-2">Timings</h1>
            <p>Monday - Friday: 10:00 AM to 6:00 PM</p>
            <p>Saturday & Sunday: 10:00 AM to 3:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};
