/**
 * Minimal error monitoring + event tracking.
 * No external keys required: logs to console, persists server-side when Mongo is configured.
 */

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  console.error("[monitor]", message, { ...context, stack: stack?.slice(0, 2000) });
}

export async function trackServerEvent(input: {
  event: string;
  path?: string;
  productId?: string;
  userId?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { hasConfiguredMongoUri } = await import("@/lib/mongoEnv");
    if (!hasConfiguredMongoUri()) return;
    const connectDB = (await import("@/lib/connectDB")).default;
    const AnalyticsEvent = (await import("@/models/AnalyticsEvent")).default;
    await connectDB();
    await AnalyticsEvent.create({
      event: String(input.event).slice(0, 80),
      path: String(input.path ?? "").slice(0, 500),
      productId: String(input.productId ?? "").slice(0, 200),
      userId: String(input.userId ?? "").slice(0, 200),
      value: Number(input.value ?? 0) || 0,
      metadata: input.metadata ?? {},
    });
  } catch (error) {
    console.warn("trackServerEvent failed:", error instanceof Error ? error.message : String(error));
  }
}
