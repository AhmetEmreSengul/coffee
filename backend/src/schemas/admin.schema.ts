import { z } from "zod";

export const verifyBookingSchema = z.object({
  bookingId: z.string().min(1, "Id is required"),
  token: z.string().min(1, "Token is required"),
});

export const coffeeItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["Hot", "Cold"]),
  price: z.number().min(1, "Price is required"),
  image: z.string().min(1, "Image is required"),
  description: z.string().min(1, "Description is required"),
});

export type VerifyBookingBody = z.infer<typeof verifyBookingSchema>;
export type CoffeeRequestBody = z.infer<typeof coffeeItemSchema>;