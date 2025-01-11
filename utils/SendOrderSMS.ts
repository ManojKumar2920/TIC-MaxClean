import qs from "qs";
import axios, { AxiosRequestConfig } from "axios";

export const sendOrderSMS = async (order: {
  name: string;
  service: string;
  price: number;
  date: string;
  timeSlot: string;
  phone: string;
  address: string;
  razorpayOrderId: string | undefined;
  landmark: string;
  pincode: string;
}): Promise<void> => {
  try {
    const data = qs.stringify({
      module: "TRANS_SMS",
      apikey: process.env.TWOFACTOR_API_KEY,
      to: "9597028220,7780275118,9885312902,9515813423,8179987444", // Team numbers
      from: "MAXCLA", // Approved Sender ID
      templatename: "sendOrderDetailsToTeam", // Approved template name
      var1: order.name || "", 
      var2: order.address || "",
      var3: order.landmark || "", 
      var4: order.pincode || "",
      var5: order.phone || "",
      var6: order.date || "",
      var7: order.timeSlot || "",
      var8: order.service || "",
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
