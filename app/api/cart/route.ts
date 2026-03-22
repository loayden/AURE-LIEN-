import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import products from '@/lib/productsData';
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";
import { paths } from "@/lib/dataPaths";

const dataFilePath = paths.cart;

type CartItem = {
  _id?: string;
  userId: string;
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

function readCart(): CartItem[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }

    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const parsed = JSON.parse(fileData);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(cart, null, 2), 'utf-8');
  } catch {
    // ignore errors
  }
}

// GET: fetch cart items
export async function GET(req: NextRequest) {
  const { userId, isNew } = getOrCreateUserId(req);
  const cart = readCart();

  let items = cart.filter(item => item.userId === userId);
  // Ensure all items have _id and basic product data
  items = items.map(item => {
    const product = products.find((p: { _id: string }) => p._id === item.productId);
    return {
      ...item,
      _id: item._id || product?._id || '',
      // keep any existing name/price/image if we later extend CartItem
    };
  });

  const res = NextResponse.json(
    { items },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
  if (isNew) attachUserCookie(res, userId);
  return res;
}

// POST: add to cart
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, isNew } = getOrCreateUserId(req);
  const cart = readCart();
  const { productId, quantity, size, color } = body as {
    productId?: string;
    quantity?: number;
    size?: string | null;
    color?: string | null;
  };

  if (!productId || typeof productId !== "string" || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
  }

  // Treat same product + same size + same color as the same line item
  const index = cart.findIndex(
    item =>
      item.userId === userId &&
      item.productId === productId &&
      (item.size || null) === (size || null) &&
      (item.color || null) === (color || null)
  );

  if (index !== -1) {
    cart[index].quantity += quantity;
    saveCart(cart);
    const res = NextResponse.json({ item: cart[index] }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } else {
    const product = products.find((p: { _id: string }) => p._id === productId);
    const newItem: CartItem = {
      _id: product?._id || '',
      userId,
      productId,
      quantity,
      size: size || null,
      color: color || null,
    };
    cart.push(newItem);
    saveCart(cart);
    const res = NextResponse.json({ item: newItem }, { status: 201 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  }
}

// PUT: update quantity
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { userId, isNew } = getOrCreateUserId(req);
  const cart = readCart();
  const { productId, quantity, size, color } = body as {
    productId?: string;
    quantity?: number;
    size?: string | null;
    color?: string | null;
  };

  if (!productId || typeof productId !== "string" || typeof quantity !== "number") {
    return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
  }

  const index = cart.findIndex(
    item =>
      item.userId === userId &&
      item.productId === productId &&
      (item.size || null) === (size || null) &&
      (item.color || null) === (color || null)
  );
  if (index === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  cart[index].quantity = quantity;
  saveCart(cart);
  const res = NextResponse.json({ item: cart[index] }, { status: 200 });
  if (isNew) attachUserCookie(res, userId);
  return res;
}

// DELETE: remove item(s)
export async function DELETE(req: NextRequest) {
  const { userId, isNew } = getOrCreateUserId(req);
  let cart = readCart();
  const body = await req.json().catch(() => ({}));
  const { productId, size, color } = (body ?? {}) as {
    productId?: string;
    size?: string | null;
    color?: string | null;
  };

  if (productId) {
    const index = cart.findIndex(
      item =>
        item.userId === userId &&
        item.productId === productId &&
        (size === undefined || (item.size || null) === (size || null)) &&
        (color === undefined || (item.color || null) === (color || null))
    );
    if (index === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    cart.splice(index, 1);
  } else {
    // delete all items for the user
    cart = cart.filter(item => item.userId !== userId);
  }

  saveCart(cart);
  const res = NextResponse.json({ success: true }, { status: 200 });
  if (isNew) attachUserCookie(res, userId);
  return res;
}
