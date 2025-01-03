import { NextResponse } from "next/server";
import moment from "moment-timezone";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

// Define a strict type for time slots
type TimeSlot = 
  | "9:00-11:00am" 
  | "11:00-01:00pm" 
  | "2:00-4:00pm" 
  | "4:00-6:00pm";

// Predefined time slots with type
const SLOTS: TimeSlot[] = [
  "9:00-11:00am",
  "11:00-01:00pm", 
  "2:00-4:00pm", 
  "4:00-6:00pm"
];

// Mapping of slot start times for filtering past slots
const SLOT_START_TIMES: { [key in TimeSlot]: number } = {
  "9:00-11:00am": 9 * 60,
  "11:00-01:00pm": 11 * 60,
  "2:00-4:00pm": 14 * 60,
  "4:00-6:00pm": 16 * 60,
};

// Generate next week's dates
const generateNextWeekDates = (): string[] => {
  const dates: string[] = [];
  const today = moment.tz("Asia/Kolkata");
  
  for (let i = 0; i < 7; i++) {
    const date = today.clone().add(i, "days");
    
    // Skip days when business is closed (optional)
    if (date.day() !== 3) {
      dates.push(date.format("YYYY-MM-DD"));
    }
  }
  
  return dates;
};

// Filter out past slots for today's date
const filterPastSlotsForToday = (slots: TimeSlot[]): TimeSlot[] => {
  const now = moment.tz("Asia/Kolkata");
  const currentHour = now.hours();
  const currentMinutes = now.minutes();
  const timeInMinutes = currentHour * 60 + currentMinutes;

  return slots.filter((slot) => {
    const slotStartTime = SLOT_START_TIMES[slot];
    return slotStartTime > timeInMinutes;
  });
};

export async function GET(req: unknown, res: unknown) {
  try {
    // Connect to the database
    await connectDB();

    // Generate dates for next week
    const nextWeekDates = generateNextWeekDates();
    
    // Object to store available slots for each date
    const availableSlots: { [key: string]: TimeSlot[] } = {};

    // Check availability for each date
    for (const date of nextWeekDates) {
      // Fetch orders for the specific date
      const bookedOrders = await Order.find({
        date: date,
        timeSlot: { $in: SLOTS },
        paymentStatus: { $nin: ["Pending", "Cancelled"] },
        status: { $nin: ["Rejected"] }
      });

      // Extract booked time slots
      const bookedSlots = bookedOrders.map((order) => order.timeSlot as TimeSlot);

      // Filter out booked slots
      let freeSlots = SLOTS.filter((slot) => !bookedSlots.includes(slot));

      // For today's date, filter out past time slots
      if (date === moment.tz("Asia/Kolkata").format("YYYY-MM-DD")) {
        freeSlots = filterPastSlotsForToday(freeSlots);
      }

      // Only add dates with available slots
      if (freeSlots.length > 0) {
        availableSlots[date] = freeSlots;
      }
    }

    // Check if any slots are available
    if (Object.keys(availableSlots).length === 0) {
      return NextResponse.json(
        { message: "No available slots for the next week" }, 
        { status: 404 }
      );
    }

    // Return the available slots
    return NextResponse.json(availableSlots, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { 
        message: "Error fetching available slots", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}