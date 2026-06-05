export type PaymobSetupStatus = {
  configured: boolean;
  missing: string[];
};

type PaymobCheckoutInput = {
  amountEgp: number;
  applicationId: string;
  planId: string;
  planName: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    city?: string;
    streetAddress?: string;
  };
  returnUrl: string;
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function getPublicKey(): string {
  return cleanString(process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY || process.env.PAYMOB_PUBLIC_KEY);
}

function getIntegrationId(): string {
  return cleanString(process.env.PAYMOB_CARD_INTEGRATION_ID || process.env.PAYMOB_INTEGRATION_ID);
}

export function getPaymobSetupStatus(): PaymobSetupStatus {
  const missing: string[] = [];
  if (!cleanString(process.env.PAYMOB_SECRET_KEY)) missing.push("PAYMOB_SECRET_KEY");
  if (!getPublicKey()) missing.push("PAYMOB_PUBLIC_KEY or NEXT_PUBLIC_PAYMOB_PUBLIC_KEY");
  if (!getIntegrationId()) missing.push("PAYMOB_CARD_INTEGRATION_ID or PAYMOB_INTEGRATION_ID");
  if (getIntegrationId() && !Number.isFinite(Number(getIntegrationId()))) {
    missing.push("numeric PAYMOB_CARD_INTEGRATION_ID or PAYMOB_INTEGRATION_ID");
  }
  return { configured: missing.length === 0, missing };
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = cleanString(name).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Boutique", lastName: "Partner" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "Partner" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

export async function createPaymobPartnerCheckout(input: PaymobCheckoutInput) {
  const setup = getPaymobSetupStatus();
  if (!setup.configured) {
    const error = new Error(`Paymob is not configured: ${setup.missing.join(", ")}`);
    error.name = "PaymobConfigurationError";
    throw error;
  }

  const secretKey = cleanString(process.env.PAYMOB_SECRET_KEY);
  const publicKey = getPublicKey();
  const integrationId = Number(getIntegrationId());
  const amount = Math.max(100, Math.round(Number(input.amountEgp || 0) * 100));
  const { firstName, lastName } = splitName(input.customer.name);
  const endpoint = cleanString(process.env.PAYMOB_INTENTION_ENDPOINT) || "https://accept.paymob.com/v1/intention/";

  const payload = {
    amount,
    currency: "EGP",
    payment_methods: [integrationId],
    items: [
      {
        name: input.planName,
        amount,
        description: `BOUT boutique partner subscription - ${input.planName}`,
        quantity: 1,
      },
    ],
    billing_data: {
      first_name: firstName,
      last_name: lastName,
      email: cleanString(input.customer.email) || "partner@bout.local",
      phone_number: cleanString(input.customer.phone),
      apartment: "NA",
      floor: "NA",
      street: cleanString(input.customer.streetAddress) || "NA",
      building: "NA",
      shipping_method: "NA",
      postal_code: "NA",
      city: cleanString(input.customer.city) || "Cairo",
      country: "EG",
    },
    extras: {
      applicationId: input.applicationId,
      planId: input.planId,
      returnUrl: input.returnUrl,
      product: "boutique_partner_subscription",
    },
    redirection_url: input.returnUrl,
    notification_url: cleanString(process.env.PAYMOB_WEBHOOK_URL) || undefined,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${secretKey}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = cleanString(data?.message || data?.error) || "Paymob checkout creation failed";
    throw new Error(message);
  }

  const clientSecret = cleanString(data?.client_secret || data?.clientSecret);
  if (!clientSecret) {
    throw new Error("Paymob response did not include a client secret");
  }

  const checkoutBase = cleanString(process.env.PAYMOB_CHECKOUT_URL) || "https://accept.paymob.com/unifiedcheckout/";
  const redirectUrl = `${checkoutBase}?publicKey=${encodeURIComponent(publicKey)}&clientSecret=${encodeURIComponent(clientSecret)}`;

  return {
    redirectUrl,
    clientSecret,
    intentionId: cleanString(data?.id || data?.intention_id || data?.intentionId),
  };
}
