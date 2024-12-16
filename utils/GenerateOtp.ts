// Function to generate a 6-digit OTP
export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  