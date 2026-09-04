import { z } from "zod";

export const bookingSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),

  bookingTime: z
    .object({
      start: z.coerce.date({
        error: "Invalid start time",
      }),
      end: z.coerce.date({
        error: "Invalid end time",
      }),
    })
    .refine((data) => data.end > data.start, {
      message: "End time must be after start time",
      path: ["end"],
    }),
});

export const updateBookingSchema = bookingSchema.pick({
  bookingTime: true,
});

export type BookingBody = z.infer<typeof bookingSchema>;
export type UpdateBookingBody = z.infer<typeof updateBookingSchema>;
