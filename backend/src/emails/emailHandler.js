import Brevo from "@getbrevo/brevo";
import { ENV } from "../lib/env.js";
import { createBookingEmailTemplate } from "./emailTemplate.js";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  ENV.BREVO_API_KEY
);

export const sendBookingEmail = async (
  email,
  startTime,
  endTime,
  tableInfo
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
        tableInfo
      ),
    });
  } catch (error) {
    console.error("Error sending booking email", error.message);
  }
};
