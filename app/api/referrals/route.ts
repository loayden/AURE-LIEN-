import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Referral from "@/models/Referral";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function makeCode(): string {
  return `BOUT-${Math.random().toString(36).slice(2, 8).toUpperCase().replace(/[^A-Z0-9]/g, "X")}`;
}

/** GET: my referral code (creates one on first call) + conversion count. */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ code: null, converted: 0 }, { headers: NO_STORE });
  }
  try {
    await connectDB();
    let row = await Referral.findOne({ referrerUserId: auth.userId, referredEmail: "" }).lean() as unknown as {
      code?: string;
    } | null;
    if (!row) {
      const created = await Referral.create({
        code: makeCode(),
        referrerUserId: auth.userId,
        referredEmail: "",
        status: "issued",
      });
      row = { code: (created as unknown as { code: string }).code };
    }
    const converted = await Referral.countDocuments({ referrerUserId: auth.userId, status: "converted" });
    return NextResponse.json({ code: row?.code ?? null, converted }, { headers: NO_STORE });
  } catch (error) {
    // Unique-code retry once on collision.
    try {
      await connectDB();
      const created = await Referral.create({ code: makeCode(), referrerUserId: auth!.userId, referredEmail: "", status: "issued" });
      const converted = await Referral.countDocuments({ referrerUserId: auth!.userId, status: "converted" });
      return NextResponse.json({ code: (created as unknown as { code: string }).code, converted }, { headers: NO_STORE });
    } catch {
      console.error("Referral code error:", error instanceof Error ? error.message : String(error));
      return NextResponse.json({ code: null, converted: 0 }, { headers: NO_STORE });
    }
  }
}
