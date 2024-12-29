import { NextResponse } from "next/server";
import { createMocks } from "node-mocks-http";
import { GET } from "@/app/api/hello/route";

describe("GET /api/hello", () => {
  it("should return hello world message", async () => {
    const { req } = createMocks({
      method: "GET",
    });

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "Hello, World!" });
  });
});
