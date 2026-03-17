import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const USER_ID_COOKIE = "cc_uid";

type UserIdResult = { userId: string; isNew: boolean };

export function getOrCreateUserId(req: NextRequest): UserIdResult {
  const existing = req.cookies.get(USER_ID_COOKIE)?.value;
  if (existing) return { userId: existing, isNew: false };
  return { userId: randomUUID(), isNew: true };
}

export function attachUserCookie(res: NextResponse, userId: string) {
  res.cookies.set({
    name: USER_ID_COOKIE,
    value: userId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function jsonWithUserCookie<T>(
  req: NextRequest,
  body: T,
  init?: ResponseInit
): { res: NextResponse; userId: string } {
  const { userId, isNew } = getOrCreateUserId(req);
  const res = NextResponse.json(body, init);
  if (isNew) attachUserCookie(res, userId);
  return { res, userId };
}
