import { randomUUID } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const DEVICE_COOKIE = "bout_device_id";

export function getOrCreateDeviceId(req: NextRequest): { deviceId: string; isNew: boolean } {
  const existing = req.cookies.get(DEVICE_COOKIE)?.value?.trim();
  if (existing) return { deviceId: existing, isNew: false };
  return { deviceId: randomUUID(), isNew: true };
}

export function attachDeviceCookie(res: NextResponse, deviceId: string) {
  if (!deviceId) return;

  res.cookies.set({
    name: DEVICE_COOKIE,
    value: deviceId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
