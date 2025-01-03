import nodemailer from "nodemailer";

// Function to send OTP via email (using Nodemailer)
export async function sendEmailOtp(email: string, otp: string) {
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
    subject: "MaxClean - Email OTP Verification",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MaxClean - Email OTP Verification</title>
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
    .otp-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
      padding: 15px 20px;
      font-size: 22px;
      font-weight: bold;
      color: #D70006;
      background-color: #f9f9f9;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    .otp-box span {
      letter-spacing: 2px;
    }
    .copy-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      background-color: #D70006;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }
    .copy-btn img {
      width: 20px;
      height: 20px;
    }
    .copy-btn:hover {
      background-color: #B40005;
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
      <h1>Email Verification</h1>
    </div>

    <!-- Content -->
    <div class="content">

      <h3>Welcome to MaxClean! Use the OTP below to complete your email verification. The OTP is valid for 10 minutes:</h1>

      <div class="otp-box">
        <span id="otp">${otp}</span>
        
      </div>

      <p>If you did not request this, please ignore this email. For support, contact us at <a href="mailto:maxcleanbusiness@gmail.com">maxcleanbusiness@gmail.com</a>.</p>
      <p>Thank you for choosing MaxClean!</p>
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
