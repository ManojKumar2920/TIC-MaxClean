import qs from "qs";
import axios, { AxiosRequestConfig } from "axios";

export const sendOrderSMS =  async (order: {
  name: string;
  service: string;
  price: number;
  date: string;
  timeSlot: string;
  phone: string;
  address: string;
  razorpayOrderId: string | undefined;
}, service: any, price: any, date: any, timeSlot: any, phoneNumber: any, address: any, razorpayOrderId: any): Promise<void> => {
  try {
    const data = qs.stringify({
      module: "TRANS_SMS",
      apikey: process.env.TWOFACTOR_API_KEY,
      to: "9597028220,7780275118,9885312902,9515813423,8179987444", // Team numbers
      from: "MAXCLA", // Approved Sender ID
      templatename: "sendOrderDetailsToTeam", // Approved template name
      var1: order.name || "N/A",
      var2: order.service || "N/A",
      var3: order.price || "N/A",
      var4: order.date || "N/A",
      var5: order.timeSlot || "N/A",
      var6: order.phone || "N/A",
      var7: order.address || "N/A",
      var8: order.razorpayOrderId || "N/A",
    });

    const config: AxiosRequestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://2factor.in/API/R1/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    };

    const response = await axios(config);

    if (response.data.Status !== "Success") {
      throw new Error(`SMS API Error: ${response.data.Details}`);
    }

    console.log("SMS notification sent successfully:", response.data);

  } catch (error: any) {
    console.error("Error sending SMS notification:", error?.response?.data || error.message);
    throw new Error("Failed to send SMS notification to the team.");
  }
};

