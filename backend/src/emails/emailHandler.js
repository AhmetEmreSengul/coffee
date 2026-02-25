import Brevo from "@getbrevo/brevo";
import { ENV } from "../lib/env.js";
import {
  createBookingEmailTemplate,
  createOrderEmailTemplate,
  createPasswordResetEmailTemplate,
  createPasswordResetSuccessEmailTemplate,
} from "./emailTemplate.js";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  ENV.BREVO_API_KEY,
);

export const sendBookingEmail = async (
  email,
  startTime,
  endTime,
  tableInfo,
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
    console.error("Error sending booking email", error.message);
  }
};

export const sendCreateOrderEmail = async (
  email,
  orderNumber,
  orderDate,
  orderTotal,
  orderItems,
  orderNote,
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
    console.error("Error sending order creation email", error.message);
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Time Slot", email: "ahmetemresengul.34@gmail.com" },
      to: [{ email }],
      subject: "Password Reset",
      htmlContent: createPasswordResetEmailTemplate(resetToken),
    });
  } catch (error) {
    console.error("Error sending password reset email", error.message);
  }
};

export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Time Slot", email: "ahmetemresengul.34@gmail.com" },
      to: [{ email }],
      subject: "Password Reset Success",
      htmlContent: createPasswordResetSuccessEmailTemplate(email),
    });
  } catch (error) {
    console.error("Error sending password reset success email", error.message);
  }
};
