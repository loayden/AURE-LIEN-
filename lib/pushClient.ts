"use client";

/** Opt the current device into push notifications (needs VAPID_PUBLIC_KEY + granted permission). */
export async function enablePushNotifications(): Promise<{ ok: boolean; message: string }> {
  try {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      return { ok: false, message: "Push is not supported on this device." };
    }
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
    if (!vapidKey) return { ok: false, message: "Push notifications are not configured." };
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return { ok: false, message: "Notification permission was not granted." };
    const registration = await navigator.serviceWorker.ready;
    const base64ToUint8 = (base64: string) => {
      const padding = "=".repeat((4 - (base64.length % 4)) % 4);
      const raw = window.atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
      return Uint8Array.from([...raw].map((ch) => ch.charCodeAt(0)));
    };
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8(vapidKey),
    });
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
    if (!res.ok) return { ok: false, message: "Could not save push subscription." };
    return { ok: true, message: "Push notifications enabled." };
  } catch {
    return { ok: false, message: "Could not enable push notifications." };
  }
}
