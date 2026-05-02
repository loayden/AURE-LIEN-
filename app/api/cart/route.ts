import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductById } from "@/lib/getAllProducts";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";
import {
  clearCartByUser,
  getCartByUser,
  setCartByUser,
  type CartItemRecord,
} from "@/lib/cartStorage";

type CartItem = {
  _id?: string;
  userId: string;
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// GET: fetch cart items
export async function GET(req: NextRequest) {
  try {
    const { userId, isNew } = getOrCreateUserId(req);
    const cart = await getCartByUser(userId);
    const products = await getAllProducts();
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const items = cart.map(item => {
      const product = productMap.get(String(item.productId));
      return {
        ...item,
        _id: item._id || product?._id || item.productId,
        name: product?.name ?? "Unknown Product",
        price: product?.price ?? 0,
        image: product?.images?.[0] ?? "/images/placeholder.svg",
        category: product?.category ?? "",
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
  } catch (error) {
    console.error("Cart GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ items: [], error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST: add to cart
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, isNew } = getOrCreateUserId(req);
    const cart = await getCartByUser(userId);
    const { productId, quantity, size, color } = body as {
      productId?: string;
      quantity?: number;
      size?: string | null;
      color?: string | null;
    };

    if (!productId || typeof productId !== "string" || !isPositiveInteger(quantity)) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const availableStock = typeof product.stock === "number" ? product.stock : null;
    if (availableStock === 0) {
      return NextResponse.json({ error: "Product is out of stock" }, { status: 409 });
    }

    const index = cart.findIndex(
      item =>
        item.productId === productId &&
        (item.size || null) === (size || null) &&
        (item.color || null) === (color || null)
    );

    if (index !== -1) {
      const requestedQuantity = cart[index].quantity + quantity;
      if (availableStock !== null && requestedQuantity > availableStock) {
        return NextResponse.json({ error: "Requested quantity exceeds available stock" }, { status: 409 });
      }

      cart[index].quantity += quantity;
      await setCartByUser(userId, cart as CartItemRecord[]);
      const res = NextResponse.json({
        item: {
          ...cart[index],
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] ?? "/images/placeholder.svg",
        },
      }, { status: 200 });
      if (isNew) attachUserCookie(res, userId);
      return res;
    }

    if (availableStock !== null && quantity > availableStock) {
      return NextResponse.json({ error: "Requested quantity exceeds available stock" }, { status: 409 });
    }

    const newItem: CartItem = {
      _id: product._id,
      userId,
      productId,
      quantity,
      size: size || null,
      color: color || null,
    };
    cart.push(newItem);
    await setCartByUser(userId, cart as CartItemRecord[]);
    const res = NextResponse.json({
      item: {
        ...newItem,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ?? "/images/placeholder.svg",
      },
    }, { status: 201 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    console.error("Cart POST error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// PUT: update quantity
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, isNew } = getOrCreateUserId(req);
    const cart = await getCartByUser(userId);
    const { productId, quantity, size, color } = body as {
      productId?: string;
      quantity?: number;
      size?: string | null;
      color?: string | null;
    };

    if (!productId || typeof productId !== "string" || !isPositiveInteger(quantity)) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const availableStock = typeof product.stock === "number" ? product.stock : null;
    if (availableStock !== null && quantity > availableStock) {
      return NextResponse.json({ error: "Requested quantity exceeds available stock" }, { status: 409 });
    }

    const index = cart.findIndex(
      item =>
        item.productId === productId &&
        (item.size || null) === (size || null) &&
        (item.color || null) === (color || null)
    );
    if (index === -1) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    cart[index].quantity = quantity;
    await setCartByUser(userId, cart as CartItemRecord[]);
    const res = NextResponse.json({ item: cart[index] }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    console.error("Cart PUT error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

// DELETE: remove item(s)
export async function DELETE(req: NextRequest) {
  try {
    const { userId, isNew } = getOrCreateUserId(req);
    const cart = await getCartByUser(userId);
    const body = await req.json().catch(() => ({}));
    const { productId, size, color } = (body ?? {}) as {
      productId?: string;
      size?: string | null;
      color?: string | null;
    };

    if (productId) {
      const index = cart.findIndex(
        item =>
          item.productId === productId &&
          (size === undefined || (item.size || null) === (size || null)) &&
          (color === undefined || (item.color || null) === (color || null))
      );
      if (index === -1) return NextResponse.json({ error: "Item not found" }, { status: 404 });

      cart.splice(index, 1);
      await setCartByUser(userId, cart as CartItemRecord[]);
    } else {
      await clearCartByUser(userId);
    }

    const res = NextResponse.json({ success: true }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    console.error("Cart DELETE error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
