"use server";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (userId === 'guest') {
    const guestUser = {
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '000-000-0000',
      address: '123 Guest St, Guest City, GC 12345'
    };
    return NextResponse.json(guestUser, { status: 200 });
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}