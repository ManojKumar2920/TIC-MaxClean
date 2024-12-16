import mongoose, { Document, Schema } from "mongoose";

interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  service: string;
  price: string;
  address: string;
  landmark: string;
  pincode: string;
  date: string;
  timeSlot: string;
  notes: string;
  paymentStatus: string;
  razorpayOrderId: string;
  razorpayPaymentId:string;
  createdAt: Date;
  updatedAt: Date;
}

// Define a mapping of services to their respective prices
const servicePrices: { [key: string]: string } = {
  "Car foam wash": "649",
  "Bike foam wash": "449",
  "Car + Bike combo": "899",
  "Bi Weekly": "1099",
  "Weekly": "2099",
  "Battery jump start": "349",
};


// Define the Order schema
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: false, // Allows multiple orders from the same email
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      enum: Object.keys(servicePrices),
    },
    price: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    landmark: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      validate: {
        validator: (value: string) => {
          return /^[0-9]{6}$/.test(value);
        },
        message: "Please enter a valid 6-digit pincode",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time is required"],
    },
    notes: {
      type: String,
      required: false
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Success", "Cancelled", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: { type: String }, // Add Razorpay order ID field
    razorpayPaymentId: { type: String }, // Add Razorpay payment ID field
  },
  {
    timestamps: true,
  }
);

// Middleware to automatically fetch price based on service
orderSchema.pre<IOrder>("save", function (next) {
  const selectedService = this.service;
  const servicePrice = servicePrices[selectedService];

  if (!servicePrice) {
    const error = new Error(`Invalid service: ${selectedService}`);
    return next(error);
  }

  this.price = servicePrice;
  next();
});

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
