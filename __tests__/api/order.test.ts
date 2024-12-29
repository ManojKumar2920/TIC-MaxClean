import { NextResponse } from 'next/server';
import { POST, GET, PATCH } from '@/app/api/order/route';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { sendAcceptMail } from '@/utils/SendAcceptMail';
import { sendRejectMail } from '@/utils/SendRejectMail';
import { sendOntheWayMail } from '@/utils/SendOnTheWayMail';
import { verifyAuth } from '@/utils/VerifyAuth';

// Mock dependencies
jest.mock('@/lib/db');
jest.mock('@/models/Order');
jest.mock('@/models/User');
jest.mock('next/headers');
jest.mock('jsonwebtoken');
jest.mock('@/utils/SendAcceptMail');
jest.mock('@/utils/SendRejectMail');
jest.mock('@/utils/SendOnTheWayMail');

describe('Order API Routes', () => {
  const mockUser = {
    _id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'user'
  };

  // Mongoose model instance with save method
  const createMockOrderModel = (status = 'Pending') => ({
    _id: 'order123',
    userId: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    service: 'Car foam wash',
    price: 679,
    address: '123 Main St',
    pincode: '12345',
    date: '2024-12-30',
    timeSlot: '10:00 AM',
    status,
    save: jest.fn().mockImplementation(function(this: any) {
      return Promise.resolve(this);
    }),
    toObject: function(this: any) {
      const obj = { ...this } as { [key: string]: any };
      delete obj.save;
      delete obj.toObject;
      return obj;
    }
  });

  // Plain object for response comparison
  const createMockOrderResponse = (status = 'Pending') => ({
    _id: 'order123',
    userId: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    service: 'Car foam wash',
    price: 679,
    address: '123 Main St',
    pincode: '12345',
    date: '2024-12-30',
    timeSlot: '10:00 AM',
    status
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockCookies = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' })
    };
    (cookies as jest.Mock).mockReturnValue(mockCookies);

    (verify as jest.Mock).mockImplementation(() => ({
      userId: 'user123',
      email: 'john@example.com'
    }));

    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser)
    }));

    (connectDB as jest.Mock).mockResolvedValue(undefined);
  });

  describe('verifyAuth', () => {
    it('should successfully verify authentication', async () => {
      const result = await verifyAuth();
      expect(result).toEqual({
        user: {
          userId: mockUser._id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          role: mockUser.role
        }
      });
    });

    it('should return error when no refresh token found', async () => {
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(null)
      });
      const result = await verifyAuth();
      expect(result).toEqual({
        error: 'Unauthorized: No refresh token found.',
        status: 401
      });
    });
  });

  describe('POST /api/orders', () => {
    const validOrderData = {
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      service: 'Car foam wash',
      address: '123 Main St',
      pincode: '12345',
      date: '2024-12-30',
      timeSlot: '10:00 AM',
      paymentStatus: 'pending'
    };

    beforeEach(() => {
      (Order.create as jest.Mock).mockResolvedValue(createMockOrderModel());
    });

    it('should create a new order successfully', async () => {
      const response = await POST(new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(validOrderData)
      }));
      
      const responseData = await response.json();
      
      expect(response.status).toBe(201);
      expect(responseData).toEqual({
        message: 'Order created successfully.',
        order: createMockOrderResponse(),
        orderId: 'order123'
      });
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = { ...validOrderData, name: '' };
      
      const response = await POST(new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      }));
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(() => {
      (Order.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([createMockOrderResponse()])
      });
    });

    it('should return all orders for admin users', async () => {
      const mockAdminUser = { ...mockUser, role: 'admin' };
      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockAdminUser)
      }));

      const response = await GET({});
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({ orders: [createMockOrderResponse()] });
    });

    it('should return user-specific orders for regular users', async () => {
      const response = await GET({});
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({ orders: [createMockOrderResponse()] });
      expect(Order.find).toHaveBeenCalledWith({ userId: mockUser._id });
    });
  });

  describe('PATCH /api/orders', () => {
    const updateData = {
      orderId: 'order123',
      newStatus: 'Accepted',
      message: 'Order accepted'
    };

    beforeEach(() => {
      const mockOrder = createMockOrderModel();
      (Order.findById as jest.Mock).mockImplementation(() => ({
        ...mockOrder,
        save: jest.fn().mockImplementation(function(this: any) {
          this.status = updateData.newStatus;
          return Promise.resolve(this);
        })
      }));
    });

    it('should update order status successfully for admin', async () => {
      const mockAdminUser = { ...mockUser, role: 'admin' };
      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockAdminUser)
      }));

      const response = await PATCH(new Request('http://localhost', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      }));

      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        message: 'Order status updated successfully.',
        order: createMockOrderResponse('Accepted')
      });
      expect(sendAcceptMail).toHaveBeenCalled();
    });

    it('should return 403 for non-admin users', async () => {
      const response = await PATCH(new Request('http://localhost', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      }));

      expect(response.status).toBe(403);
    });

    it('should return 400 for invalid status', async () => {
      const mockAdminUser = { ...mockUser, role: 'admin' };
      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockAdminUser)
      }));

      const response = await PATCH(new Request('http://localhost', {
        method: 'PATCH',
        body: JSON.stringify({ ...updateData, newStatus: 'InvalidStatus' })
      }));

      expect(response.status).toBe(400);
    });
  });
});