import { verify, JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const verifyToken = (token: string): JwtPayload => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
  }

  try {
    const decoded = verify(token, ACCESS_TOKEN_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};
