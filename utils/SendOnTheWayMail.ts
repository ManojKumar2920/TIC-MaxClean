import nodemailer from "nodemailer";

export const sendOntheWayMail = async (
  name: string,
  email: string,
  service: string,
  price: number,
  date: string,
  timeSlot: string,
  razorpayOrderId: string | undefined
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAILER_ID,
      pass: process.env.NODE_MAILER_SECRET,
    },
  });

  const mailOptions = {
    from: process.env.NODE_MAILER_ID, // Sender email
    to: email, // Recipient email
    subject: "Your Order is On the Way - Washer En Route",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order On the Way</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header img {
      max-width: 150px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .content h2 {
      color: #D70006;
      font-size: 22px;
    }
    .content p {
      line-height: 1.6;
      margin: 10px 0;
    }
    .details {
      margin-top: 20px;
      border: 1px solid #dddddd;
      border-radius: 8px;
      padding: 15px;
      background-color: #f9f9f9;
    }
    .details h3 {
      margin-top: 0;
      color: #333333;
    }
    .details p {
      margin: 5px 0;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777777;
      background-color: #f1f1f1;
    }
    .footer a {
      color: #D70006;
      text-decoration: none;
    }
    .header .span-logo {
        color: #D70006;
      }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>
        MAX<span class="span-logo">CLEAN</span>
      </h1>
      <h1>Your Order is On the Way</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Dear ${name},</h2>
      <p>Good news! Your order has been accepted and is now on its way to your doorstep. Our washer is en route to deliver top-notch service.</p>
      <p>Here are the details of your order:</p>

      <div class="details">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${razorpayOrderId}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Total Price:</strong> ₹${price}</p>
        <p><strong>Scheduled Date:</strong> ${date}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
      </div>

      <p>Our team is on the way to serve you. If you need assistance or have any questions, feel free to contact us at <a href="mailto:maxcleanbusiness@gmail.com">maxcleanbusiness@gmail.com</a>.</p>
      <p>Thank you for choosing MaxClean! We look forward to serving you soon.</p>
      <p>Best regards,<br>Team MaxClean</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2024 MaxClean. All rights reserved.</p>
      <p>Need help? <a href="mailto:maxcleanbusiness@gmail.com">Contact Us</a></p>
    </div>
  </div>
</body>
</html>
`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Order on the way email sent successfully.");
  } catch (error) {
    console.error("Error sending order on the way email:", error);
  }
};
