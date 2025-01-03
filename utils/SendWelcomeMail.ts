import nodemailer from "nodemailer";
import axios from "axios";

// Function to send OTP via email (using Nodemailer)
export async function sendWelcomeMail(email: string, name: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAILER_ID,
      pass: process.env.NODE_MAILER_SECRET, // Use environment variables for production
    },
  });

  const mailOptions = {
    from: process.env.NODE_MAILER_ID,
    to: email,
    subject: `Hurray!!! Welcome to MaxClean Fam ${name}!`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MaxClean!</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: black;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }
      .header .span-logo {
        color: #D70006;
      }
    .header img {
      max-width: 120px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px;
      color: #333333;
    }
    .content h2 {
      color: #D70006;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .content p {
      line-height: 1.8;
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #6b7280;
      background-color: #f9f9f9;
    }
    .footer a {
      color: #D70006;
      text-decoration: none;
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
      <h1>Welcome to MaxClean!</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Dear ${name},</h2>
      <p>Welcome to MaxClean! We are thrilled to have you on board. Your account has been successfully created, and you're all set to experience our premium cleaning services.</p>
      <p>Here’s what you can do next:</p>
      <ul>
        <li>Browse and book cleaning services.</li>
        <li>Get exclusive offers and promotions.</li>
      </ul>

      <p>To get started, simply <a href="https://www.themaxclean.com/signin" style="color: #D70006;">log in to your account</a> and explore.</p>

      <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:maxcleanbusiness@gmail.com">maxcleanbusiness@gmail.com</a>.</p>

      <p>We look forward to serving you with the best cleaning experience!</p>
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

  await transporter.sendMail(mailOptions);
}
