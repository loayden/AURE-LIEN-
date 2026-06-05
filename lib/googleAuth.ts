import { createRemoteJWKSet, jwtVerify } from "jose";

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

export type GoogleProfile = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
};

function getGoogleClientId(): string {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error("Google sign-in is not configured");
  }
  return clientId;
}

export async function verifyGoogleCredential(credential: string): Promise<GoogleProfile> {
  const token = String(credential ?? "").trim();
  if (!token) throw new Error("Missing Google credential");

  const { payload } = await jwtVerify(token, GOOGLE_JWKS, {
    audience: getGoogleClientId(),
  });

  if (!GOOGLE_ISSUERS.includes(String(payload.iss))) {
    throw new Error("Invalid Google token issuer");
  }
  if (payload.email_verified !== true) {
    throw new Error("Google email is not verified");
  }

  const sub = String(payload.sub ?? "").trim();
  const email = String(payload.email ?? "").toLowerCase().trim();
  if (!sub || !email) throw new Error("Google token is missing identity fields");

  return {
    sub,
    email,
    name: String(payload.name ?? "").trim() || email.split("@")[0],
    picture: String(payload.picture ?? "").trim() || undefined,
  };
}
