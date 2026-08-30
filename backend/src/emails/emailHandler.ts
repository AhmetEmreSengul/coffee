import Brevo from "@getbrevo/brevo";
import { ENV } from "../lib/env.js";
import {
  createBookingEmailTemplate,
  createOrderEmailTemplate,
  createPasswordResetEmailTemplate,
  createPasswordResetSuccessEmailTemplate,
} from "./emailTemplate.js";
import { OrderPayload } from "../controllers/order.controller.js";

const apiInstance = new Brevo.TransactionalEmailsApi();

if (!ENV.BREVO_API_KEY) throw new Error("BREVO_API_KEY must be set");

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  ENV.BREVO_API_KEY,
);

export const sendBookingEmail = async (
  email: string,
  startTime: Date,
  endTime: Date,
  tableInfo: number,
) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Time Slot", email: "ahmetemresengul.34@gmail.com" },
      to: [{ email }],
      subject: "Booking Confirmation",
      htmlContent: createBookingEmailTemplate(
        email,
        startTime,
        endTime,
        tableInfo,
      ),
    });
  } catch (error) {
    console.error("Error sending booking email", (error as Error).message);
  }
};

export const sendCreateOrderEmail = async (
  email : string,
  orderNumber : string,
  orderDate : string,
  orderTotal : number,
  orderItems : Pick<OrderPayload, "orderItems">,
  orderNote : string,
) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Time Slot", email: "ahmetemresengul.34@gmail.com" },
      to: [{ email }],
      subject: "Order Confirmation",
      htmlContent: createOrderEmailTemplate(
        orderNumber,
        orderDate,
        orderTotal,
        orderItems,
        orderNote,
      ),
    });
  } catch (error) {
    console.error("Error sending order creation email", (error as Error).message);
  }
};

export const sendPasswordResetEmail = async (email : string, resetToken : string) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Time Slot", email: "ahmetemresengul.34@gmail.com" },
      to: [{ email }],
      subject: "Password Reset",
      htmlContent: createPasswordResetEmailTemplate(resetToken),
    });
  } catch (error) {
    console.error("Error sending password reset email", (error as Error).message);
  }
};

export const sendPasswordResetSuccessEmail = async (email : string) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Time Slot", email: "ahmetemresengul.34@gmail.com" },
      to: [{ email }],
      subject: "Password Reset Success",
      htmlContent: createPasswordResetSuccessEmailTemplate(email),
    });
  } catch (error) {
    console.error("Error sending password reset success email", (error as Error).message);
  }
};
