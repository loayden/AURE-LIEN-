import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import productsData from "@/lib/productsData";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;
const CHAT_TIMEOUT_MS = 12000;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 503 }
    );
  }
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const sanitizedMessages = messages
      .slice(-MAX_MESSAGES)
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant" | "system",
        content: String(m.content || "").trim().slice(0, MAX_MESSAGE_LENGTH),
      }))
      .filter((m) => m.content.length > 0);

    if (sanitizedMessages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const productList = productsData
      .slice(0, 80)
      .map((p) => `${p.name} ($${p.price}, id: ${p._id}, category: ${p.category})`)
      .join("\n");

    const systemContent = `You are a luxury fashion stylist for Maison Aurelia. Help the customer with outfit ideas, styling tips, and product recommendations. Only recommend products from this catalog (use the exact product id when suggesting):

${productList}

When suggesting products, respond with a short tip and list 1-4 product names with their ids so the frontend can show them. Format product refs like: [Product Name](id:PRODUCT_ID). Keep replies concise and elegant.`;

    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemContent },
          ...sanitizedMessages,
        ],
        max_tokens: 500,
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Stylist request timed out")), CHAT_TIMEOUT_MS);
      }),
    ]);

    const reply = completion.choices[0]?.message?.content || "I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Failed to get stylist response" },
      { status: 500 }
    );
  }
}
