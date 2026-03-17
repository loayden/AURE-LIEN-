import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import productsData from "@/lib/productsData";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

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

    const productList = productsData
      .slice(0, 80)
      .map((p) => `${p.name} ($${p.price}, id: ${p._id}, category: ${p.category})`)
      .join("\n");

    const systemContent = `You are a luxury fashion stylist for Maison Aurelia. Help the customer with outfit ideas, styling tips, and product recommendations. Only recommend products from this catalog (use the exact product id when suggesting):

${productList}

When suggesting products, respond with a short tip and list 1-4 product names with their ids so the frontend can show them. Format product refs like: [Product Name](id:PRODUCT_ID). Keep replies concise and elegant.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ],
      max_tokens: 500,
    });

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
