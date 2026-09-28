import PushSubscription from "@/models/PushSubscription";

export type PushPayload = { title: string; body: string; url?: string };

/**
 * Send a web-push notification. Requires VAPID keys + web-push installed.
 * No-op (false) when unconfigured. Removes dead (410/404) subscriptions.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<boolean> {
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim() || "mailto:support@bout.local";
  if (!publicKey || !privateKey || !userId) return false;
  let subs: Array<{ endpoint: string; p256dh: string; auth: string }>;
  try {
    subs = (await PushSubscription.find({ userId }).lean()) as unknown as Array<{
      endpoint: string;
      p256dh: string;
      auth: string;
    }>;
  } catch {
    return false;
  }
  if (subs.length === 0) return false;
  try {
    const { default: webpush } = await import("web-push");
    webpush.setVapidDetails(subject, publicKey, privateKey);
    let sent = 0;
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title: payload.title, body: payload.body, url: payload.url ?? "/orders" })
        );
        sent++;
      } catch (error) {
        const status = Number((error as { statusCode?: number })?.statusCode ?? 0);
        if (status === 404 || status === 410) {
          await PushSubscription.deleteOne({ endpoint: sub.endpoint }).catch(() => undefined);
        }
      }
    }
    return sent > 0;
  } catch {
    return false;
  }
}
