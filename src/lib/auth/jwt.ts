import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "ceosavdouz_local_dev_jwt_secret_key_998_uzb_tashkent";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export const COOKIE_NAME = "ceosavdouz_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  businessId: string;
  businessName: string;
  role: string;
  [key: string]: unknown;
}

/**
 * Sign a new JWT session token
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

/**
 * Verify JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
