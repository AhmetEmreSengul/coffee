import { z } from "zod";

const stripeItemSchema = z.object({
  id: z.string().min(1, "Id is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").max(10, "Quantity limit exceeded"),
});

export const createPaymentSchema = z.object({
  items: z.array(stripeItemSchema).min(1, "At least one item is required"),
});

export type CreatePaymentBody = z.infer<typeof createPaymentSchema>;