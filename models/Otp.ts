import mongoose from 'mongoose';

export interface IOTP extends mongoose.Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema = new mongoose.Schema<IOTP>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: [6, 'OTP must be 6 digits']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 minutes in seconds
  }
});

// Compound index to ensure unique OTP per email
OTPSchema.index({ email: 1, otp: 1 }, { unique: true });

// Automatically remove expired documents
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;