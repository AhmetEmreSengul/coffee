import { z } from "zod";

const orderSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  type: z.enum(["Hot", "Cold"]),
  price: z.number().min(1, "Price is required"),
  image: z.string().min(1, "Image is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(10, "Quantity limit exceeded"),
});

export const createOrderBody = z.object({
  orderItems: z.array(orderSchema).min(1, "At least one item is required"),
  orderNote: z.string().optional().default("No order note provided."),
});

export type CreateOrderBody = z.infer<typeof createOrderBody>;
