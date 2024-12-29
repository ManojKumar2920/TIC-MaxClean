import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createMocks } from "node-mocks-http";
import { GET } from "@/app/api/user/route";
import User from "@/models/User";
import connectDB from "@/lib/db";

jest.mock("next/headers", () => ({
  cookies: jest.fn()
}));

jest.mock("@/lib/db", () => jest.fn());

jest.mock("@/models/User", () => ({
  findOne: jest.fn()
}));

describe("GET /api/user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no refresh token found", async () => {
    const { req } = createMocks({
      method: "GET"
    });

    (cookies as jest.Mock).mockReturnValue({
      get: () => null
    });

    const response = await GET(req as NextRequest);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized: No refresh token found" });
  });

  it("should return 401 if refresh token is invalid", async () => {
    const { req } = createMocks({
      method: "GET"
    });

    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: "invalid-token" }),
      delete: jest.fn()
    });

    const response = await GET(req as NextRequest);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized: Invalid refresh token" });
  });

  it("should return 401 if user not found", async () => {
    const { req } = createMocks({
      method: "GET"
    });

    const mockToken = "valid-token";
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: mockToken })
    });

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userId: "123",
      email: "test@example.com"
    }));

    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const response = await GET(req as NextRequest);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized: User not found" });
  });

  it("should return user data and set new access token if valid refresh token", async () => {
    const { req } = createMocks({
      method: "GET"
    });

    const mockToken = "valid-token";
    const mockDate = new Date("2024-12-29T09:22:12.629Z");
    const mockUser = {
      _id: "123",
      firstName: "John",
      lastName: "Doe", 
      email: "test@example.com",
      phoneNumber: "1234567890",
      role: "user",
      createdAt: mockDate,
      updatedAt: mockDate
    };

    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: mockToken })
    });

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userId: mockUser._id,
      email: mockUser.email
    }));

    jest.spyOn(jwt, "sign").mockImplementation(() => "new-access-token");

    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    const response = await GET(req as NextRequest);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      user: {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        phoneNumber: mockUser.phoneNumber,
        role: mockUser.role,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      }
    });
    expect(response.headers.get("Authorization")).toBe("Bearer new-access-token");
  });

  it("should return 500 if unexpected error occurs", async () => {
    const { req } = createMocks({
      method: "GET"
    });

    (cookies as jest.Mock).mockImplementation(() => {
      throw new Error("Database connection failed");
    });

    const response = await GET(req as NextRequest);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({
      message: "Internal server error",
      error: "Database connection failed"
    });
  });
});
