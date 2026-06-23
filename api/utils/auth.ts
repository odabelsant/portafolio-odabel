import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev";

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export async function comparePasswords(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
