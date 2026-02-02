import { format } from "date-fns";

export function createBookingEmailTemplate(
  email,
  startTime,
  endTime,
  tableInfo,
) {
  const formattedStart = format(
    new Date(startTime),
    "EEEE, MMM d, yyyy, hh:mm a",
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

export function createOrderEmailTemplate(
  orderNumber,
  orderDate,
  orderTotal,
  orderItems,
  orderNote,
) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleString("en-US", options);
  }
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Order Confirmation</title>
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
        Order Confirmed!
      </h1>
    </div>

    <!-- Main Content -->
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.07);">

      <p style="font-size: 18px; color: #8b5e3c;">
        Thank you for your order! Order #${orderNumber}
      </p>

      <p>
        We've received your order and are preparing it with care. 
        You can pick up your order by showing the order number.
      </p>

      <!-- Order Details Box -->
      <div style="background-color: #faf6f1; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #c9a27b;">
        <p style="font-size: 16px; margin: 0 0 10px;"><strong>Order Summary:</strong></p>

        <ul style="padding-left: 18px; margin: 0 0 15px 0; line-height: 1.7;">
          <li><strong>Order Number:</strong> ${orderNumber}</li>
          <li><strong>Order Date:</strong> ${formatDate(orderDate)}</li>
        </ul>

        <!-- Order Items -->
        <div style="margin-top: 20px;">
          <p style="font-size: 15px; margin: 0 0 12px; font-weight: 600;">Items Ordered:</p>
          ${orderItems
            .map(
              (item) => `
            <div style="padding: 12px 0; border-bottom: 1px solid #e8dfd5; display: table; width: 100%;">
              <div style="display: table-row;">
                <div style="display: table-cell; vertical-align: middle; width: 60px; padding-right: 15px;">
                  <img 
                    src="${item.image}" 
                    alt="${item.title}"
                    style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;"
                  />
                </div>
                <div style="display: table-cell; vertical-align: middle;">
                  <strong style="color: #4a3f35; font-size: 15px;">${item.title}</strong>
                  <div style="font-size: 13px; color: #9b7c63; margin-top: 3px; text-transform: capitalize;">
                    ${item.type}
                  </div>
                  ${item.quantity > 1 ? `<span style="color: #9b7c63; font-size: 13px;">Qty: ${item.quantity}</span>` : ""}
                </div>
                <div style="display: table-cell; vertical-align: middle; text-align: right; white-space: nowrap; font-weight: 600; color: #8b5e3c;">
                  ${(item.price * item.quantity).toFixed(2)}₺
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <!-- Order Total -->
        <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #c9a27b;">
          <div style="display: table; width: 100%;">
            <div style="display: table-row; font-size: 18px;">
              <div style="display: table-cell;"><strong>Total:</strong></div>
              <div style="display: table-cell; text-align: right;"><strong style="color: #8b5e3c;">${parseFloat(orderTotal).toFixed(2)}₺</strong></div>
            </div>
          </div>
        </div>

        ${
          orderNote
            ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #fff9f0; border-radius: 8px; border: 1px dashed #c9a27b;">
          <p style="margin: 0; font-size: 14px;"><strong>Order Note:</strong></p>
          <p style="margin: 8px 0 0; font-size: 14px; color: #6b5d52;">${orderNote}</p>
        </div>
        `
            : ""
        }
      </div>

      <p>
        If you have any questions about your order, feel free to reach out to us anytime.
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
