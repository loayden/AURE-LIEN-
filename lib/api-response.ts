import { NextResponse } from "next/server";

/**
 * Consistent API response helpers for AURELIA backend
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
