import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { clearOrderCustomerData, getOrdersJson } from "@/lib/orderStorage";
import { clearCustomerUserRecords, getUsersJson } from "@/lib/usersJson";
import { buildAdminCustomerIndex } from "@/lib/adminCustomers";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

const CLEAR_CUSTOMER_DATA_CONFIRMATION = "CLEAR CUSTOMER DATA";

function getNewestTimestamp(value: { createdAt: string; lastOrderAt: string }) {
  return new Date(value.lastOrderAt || value.createdAt).getTime();
}

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const [users, orders] = await Promise.all([getUsersJson(), getOrdersJson()]);
    const customerIndex = buildAdminCustomerIndex(users, orders);

    let result = customerIndex.customers.map((customer) => ({ ...customer }));

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const sort = searchParams.get("sort") || "newest";

    if (search) {
      result = result.filter((customer) =>
        [
          customer.name,
          customer.email,
          customer.phone,
          customer.address,
          customer.city,
          customer.country,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      );
    }

    if (sort === "orders") {
      result.sort((a, b) => b.orders - a.orders);
    } else if (sort === "spent") {
      result.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "email") {
      result.sort((a, b) => a.email.localeCompare(b.email));
    } else {
      result.sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a));
    }

    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const confirmation = String(body?.confirmation ?? "").trim();

    if (confirmation !== CLEAR_CUSTOMER_DATA_CONFIRMATION) {
      return NextResponse.json(
        {
          error: `Type ${CLEAR_CUSTOMER_DATA_CONFIRMATION} to clear customer data.`,
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const [userResult, orderResult] = await Promise.all([
      clearCustomerUserRecords(),
      clearOrderCustomerData(),
    ]);

    return NextResponse.json(
      {
        success: true,
        ...userResult,
        ...orderResult,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Admin clear customer data API error:", error);
    return NextResponse.json(
      { error: "Failed to clear customer data" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
