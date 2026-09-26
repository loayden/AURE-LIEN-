import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "productId required"),
  quantity: z.number().int().min(1).max(99),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export const saveOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Order must contain at least one item").max(50),
  total: z.number().min(0),
  customerInfo: z.object({
    email: z.string().email("Valid email required"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),
    address: z.string().min(1, "Address required"),
    apartment: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    newsletter: z.boolean().optional(),
    shippingMethod: z.string().optional(),
    shippingCost: z.number().optional(),
  }).superRefine((info, ctx) => {
    if (!info.name && !info.firstName && !info.lastName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Customer name required", path: ["name"] });
    }
  }),
  paymentMethod: z.enum(["cod", "card", "cash_on_delivery"]).optional(),
  idempotencyKey: z.string().max(64).optional(),
  couponCode: z.string().max(32).optional(),
  giftWrap: z.boolean().optional(),
  giftMessage: z.string().max(500).optional(),
  loyaltyPoints: z.number().int().min(0).max(100000).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
  totp: z.string().max(10).optional(),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name required").max(120),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  confirmPassword: z.string().optional(),
  accountIntent: z.enum(["buyer", "partner", "both"]).optional(),
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords do not match", path: ["confirmPassword"] });
  }
});

export function zodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid request";
}
