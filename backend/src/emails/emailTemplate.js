import { format } from "date-fns";

export function createBookingEmailTemplate(
  email,
  startTime,
  endTime,
  tableInfo
) {
  const formattedStart = format(
    new Date(startTime),
    "EEEE, MMM d, yyyy, hh:mm a"
  );
  const formattedEnd = format(new Date(endTime), "hh:mm a");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Coffee Shop Booking</title>
  </head>

  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f3ee; padding: 20px; color: #4a3f35; max-width: 600px; margin: 0 auto;">

    <!-- Header -->
    <div style="background: linear-gradient(to right, #c9a27b, #9f755b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/924/924514.png" 
        alt="Coffee Logo"
        style="width: 80px; height: 80px; margin-bottom: 15px;"
      />
      <h1 style="color: white; font-size: 26px; margin: 0; font-weight: 600;">
        Your Table is Booked!
      </h1>
    </div>

    <!-- Main Content -->
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.07);">

      <p style="font-size: 18px; color: #8b5e3c;">
        Hello we created your booking under ${email}, your table is T${tableInfo}
      </p>

      <p>
        Thank you for booking a table at our coffee shop! We’re excited to welcome you—
        your spot is officially reserved.
      </p>

      <!-- Booking Details Box -->
      <div style="background-color: #faf6f1; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #c9a27b;">
        <p style="font-size: 16px; margin: 0 0 10px;"><strong>Your Booking Details:</strong></p>

        <ul style="padding-left: 18px; margin: 0; line-height: 1.7;">
          <li><strong>Start Time:</strong> ${formattedStart}</li>
          <li><strong>End Time:</strong> ${formattedEnd}</li>
          <li><strong>Entry QR Code:</strong> Scan on arrival</li>
        </ul>
      </div>

      <!-- QR Code -->
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 14px; color: #9b7c63; margin-top: 10px;">
          You can get your QR Code by visiting <a href = "https://timeslot-dtqf.onrender.com/my-bookings">Here</a>
        </p>
      </div>

      <p>
        If you need to modify or cancel your booking, you can do so anytime from your account dashboard.
      </p>

      <p style="margin-top: 25px; margin-bottom: 0;">
        Warm regards,<br />
        <strong>Time Slot ☕</strong>
      </p>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #b5a89f; font-size: 12px;">
      <p>© 2025 Time Slot Cafe. All rights reserved.</p>
      <p>
        <a href="#" style="color: #9f755b; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #9f755b; text-decoration: none; margin: 0 10px;">Terms</a>
        <a href="#" style="color: #9f755b; text-decoration: none; margin: 0 10px;">Contact</a>
      </p>
    </div>

  </body>
  </html>
  `;
}
