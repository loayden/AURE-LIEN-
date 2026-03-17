import { NextRequest, NextResponse } from "next/server";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";

export async function GET(req: NextRequest) {
  const { userId, isNew } = getOrCreateUserId(req);
  const res = NextResponse.json({ userId }, { status: 200 });
  if (isNew) attachUserCookie(res, userId);
  return res;
}

