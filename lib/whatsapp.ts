type WhatsAppMessageOptions = {
  to: string;
  body: string;
};

function normalizePhoneNumber(value: string): string {
  const compact = value.replace(/[^\d+]/g, "");
  if (!compact) return "";
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (compact.startsWith("0")) return `+20${compact.slice(1)}`;
  if (compact.startsWith("20")) return `+${compact}`;
  return compact;
}

function maskPhone(value: string): string {
  const compact = value.replace(/\D/g, "");
  if (compact.length <= 4) return "****";
  return `****${compact.slice(-4)}`;
}

export async function sendWhatsAppMessage(options: WhatsAppMessageOptions): Promise<boolean> {
  const token = process.env.WHATSAPP_CLOUD_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const to = normalizePhoneNumber(options.to);
  const body = options.body.trim();

  if (!to || !body) return false;
  if (!token || !phoneNumberId) {
    console.warn(`[WhatsApp] Provider not configured. Skipped message to ${maskPhone(to)}.`);
    return false;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[WhatsApp] Failed for ${maskPhone(to)}: ${response.status} ${errorText.slice(0, 180)}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `[WhatsApp] Failed for ${maskPhone(to)}:`,
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

export function sendWhatsAppMessageAsync(options: WhatsAppMessageOptions): void {
  sendWhatsAppMessage(options).catch(() => {});
}
