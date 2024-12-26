import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

export const sendOrderSMS = async (
  name: string,
  service: string,
  price: number,
  date: string,
  timeSlot: string,
  phone: string,
  address: string,
  razorpayOrderId: string | undefined
): Promise<void> => {
  const smsApiKey = process.env.TWOFACTOR_API_KEY;

  const smsContent = `
    Hello ${name},
    Thank you for your order with MaxClean!
    Service: ${service}, Price: ₹${price}, Date: ${date}, Time Slot: ${timeSlot}, Order ID: ${razorpayOrderId}.
    If you have questions, contact us at maxcleanbusiness@gmail.com. Team MaxClean!
  `.trim();
  
  const phoneNumbers = ["7780275118", "9885312902", "9515813423", "8179987444"];
  const toField = phoneNumbers.join(",");

  const data = qs.stringify({
    module: "TRANS_SMS",
    apikey: smsApiKey,
    to: toField,
    from: "MAXCLA",
    templatename: "sendOrderDetailsToTeam",
        var1: name,
        var2: service,
        var3: price,
        var4: date,
        var5: timeSlot,
        var6: razorpayOrderId,
        var7: phone,
        var8: address,
  });

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
    const response = await axios(config);
    console.log("API Response:", response.data);
    console.log("Order confirmation SMS sent successfully.");
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send order confirmation SMS.");
  }
};
