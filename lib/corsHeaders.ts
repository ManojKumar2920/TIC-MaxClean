// 1. First, create lib/corsHeaders.ts
import { NextResponse } from "next/server";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-custom-fingerprint',
  'Access-Control-Expose-Headers': 'x-custom-fingerprint',
  'Access-Control-Max-Age': '86400', // 24 hours
};

export function corsResponse(data: any, status: number) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  });
}

