import { GET } from '@/app/api/available-slots/route';
import { NextResponse } from 'next/server';
import moment from 'moment-timezone';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

// Mock the external dependencies
jest.mock('@/lib/db');
jest.mock('@/models/Order');
jest.mock('next/server', () => ({
    NextResponse: {
      json: jest.fn().mockImplementation((data: any, options: any) => ({
        data, // Add data to the mock response
        status: options?.status || 200, // Set status to options or default to 200
        ...options, // Spread other options
      })),
    },
  }));
  
jest.mock('moment-timezone', () => ({
  tz: jest.fn()
}));

describe('Available Slots API', () => {
  // Create a mock moment object with required methods
  const mockMomentObj = {
    format: jest.fn(),
    clone: jest.fn(),
    add: jest.fn(),
    day: jest.fn(),
    hours: jest.fn(),
    minutes: jest.fn()
  };
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup the mock moment object
    mockMomentObj.format.mockReturnValue('2024-12-29');
    mockMomentObj.clone.mockReturnValue(mockMomentObj);
    mockMomentObj.add.mockReturnValue(mockMomentObj);
    mockMomentObj.day.mockReturnValue(0); // Sunday
    mockMomentObj.hours.mockReturnValue(8);
    mockMomentObj.minutes.mockReturnValue(0);
    
    // Mock moment.tz to return our mock moment object
    (moment.tz as unknown as jest.Mock).mockReturnValue(mockMomentObj);
    
    // Mock the database connection
    (connectDB as jest.Mock).mockResolvedValue(undefined);
    
    // Mock NextResponse.json
    (NextResponse.json as jest.Mock).mockImplementation((data, options) => ({
      json: () => data,
      status: options?.status || 200,
      ...options,
    }));
  });

  it('should return available slots for the next week', async () => {
    // Mock Order.find to return no bookings
    (Order.find as jest.Mock).mockResolvedValue([]);

    const response = await GET({}, {});

    // Verify database connection was attempted
    expect(connectDB).toHaveBeenCalled();

    // Verify the response structure
    expect(response.status).toBe(200);
    expect(response.json()).toEqual(expect.any(Object));
    
    // Verify moment.tz was called with correct timezone
    expect(moment.tz).toHaveBeenCalledWith('Asia/Kolkata');
  });

  it('should filter out booked slots', async () => {
    // Mock some booked slots
    const bookedOrders = [
      { timeSlot: '2:00-4:00pm' },
      { timeSlot: '4:00-6:00pm' },
    ];
    (Order.find as jest.Mock).mockResolvedValue(bookedOrders);

    const response = await GET({}, {});

    expect(response.status).toBe(200);
    
    // Check that booked slots are not included
    Object.values(response.json()).forEach(slots => {
      expect(slots).not.toContain('2:00-4:00pm');
      expect(slots).not.toContain('4:00-6:00pm');
    });
  });

  it('should filter out past slots for today', async () => {
    // Mock current time to be 12:00pm
    mockMomentObj.hours.mockReturnValue(12);
    mockMomentObj.minutes.mockReturnValue(0);
    
    (Order.find as jest.Mock).mockResolvedValue([]);

    const response = await GET({}, {});
    const responseData = await response.json();
    const todaySlots = responseData[mockMomentObj.format()];
    
    // Morning slots should be filtered out
    expect(todaySlots).not.toContain('9:00-11:00am');
    expect(todaySlots).not.toContain('11:00-01:00pm');
    
    // Afternoon slots should be available
    expect(todaySlots).toContain('2:00-4:00pm');
    expect(todaySlots).toContain('4:00-6:00pm');
  });

  it('should return 404 when no slots are available', async () => {
    // Mock all slots as booked
    const bookedOrders = [
      { timeSlot: '9:00-11:00am' },
      { timeSlot: '11:00-01:00pm' },
      { timeSlot: '2:00-4:00pm' },
      { timeSlot: '4:00-6:00pm' },
    ];
    (Order.find as jest.Mock).mockResolvedValue(bookedOrders);

    const response = await GET({}, {});
    expect(response.status).toBe(404);
    const responseJson = await response.json();
    expect(responseJson.message).toBe('No available slots for the next week');
  });

  it('should handle database errors', async () => {
    // Mock database error
    const dbError = new Error('Database connection failed');
    (connectDB as jest.Mock).mockRejectedValue(dbError);

    const response = await GET({}, {});
    expect(response.status).toBe(500);
    const responseJson = await response.json();
    expect(responseJson.message).toBe('Error fetching available slots');
    expect(responseJson.error).toBe('Database connection failed');
  });

});