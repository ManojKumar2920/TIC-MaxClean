import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

export const sendOrderSMS = async (
  name: string,
  service: string,
  price: number,
  date: string,
  timeSlot: string,
  razorpayOrderId: string | undefined
): Promise<void> => {
  const smsApiKey = process.env.TWOFACTOR_API_KEY; // Add your API key to the environment variables

  // SMS content template
  const smsContent = `
Hello ${name},

Thank you for your order with MaxClean! Here are your order details:

Service: ${service}
Price: ₹${price}
Date: ${date}
Time Slot: ${timeSlot}
Order ID: ${razorpayOrderId}

If you have questions, contact us at maxcleanbusiness@gmail.com. Thank you for choosing MaxClean!

Team MaxClean
  `.trim();

  const phoneNumbers = ["7780275118", "9885312902", "9515813423", "8179987444"];
  const toField = phoneNumbers.join(",");

  // Prepare the data for the SMS API

  const data = qs.stringify({
    module: "TRANS_SMS",
    apikey: smsApiKey,
    to: toField,
    from: "MAXCLN",
    message: smsContent,
  });

  // Axios configuration
  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://2factor.in/API/V1/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  try {
    // Send the SMS
    await axios(config);
    console.log("Order confirmation SMS sent successfully.");
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send order confirmation SMS.");
  }
};
