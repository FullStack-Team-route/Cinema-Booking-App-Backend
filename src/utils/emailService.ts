import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Create Gmail transporter with explicit settings for cloud hosting
const createTransporter = () => {
  console.log("[EMAIL] Creating transporter with explicit SMTP settings...");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App Password, not regular password
    },
    // Timeout settings for cloud environments
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    // Pool connections
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    // Debug
    logger: process.env.NODE_ENV !== "production",
    debug: process.env.NODE_ENV !== "production",
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  console.log("========== EMAIL SERVICE DEBUG ==========");
  console.log("[EMAIL] Starting email send process...");
  console.log("[EMAIL] To:", options.to);
  console.log("[EMAIL] Subject:", options.subject);
  console.log("[EMAIL] NODE_ENV:", process.env.NODE_ENV);

  try {
    // Validate configuration
    console.log("[EMAIL] Checking GMAIL_USER...");
    if (!process.env.GMAIL_USER) {
      console.error("[EMAIL] ERROR: GMAIL_USER is not configured!");
      throw new Error("GMAIL_USER is not configured. Set your Gmail address");
    }
    console.log("[EMAIL] GMAIL_USER configured:", process.env.GMAIL_USER);

    console.log("[EMAIL] Checking GMAIL_APP_PASSWORD...");
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error("[EMAIL] ERROR: GMAIL_APP_PASSWORD is not configured!");
      throw new Error(
        "GMAIL_APP_PASSWORD is not configured. Generate an App Password from Gmail",
      );
    }
    console.log(
      "[EMAIL] GMAIL_APP_PASSWORD configured: ****" +
        process.env.GMAIL_APP_PASSWORD?.slice(-4),
    );

    console.log("[EMAIL] Creating transporter...");
    const transporter = createTransporter();
    console.log("[EMAIL] Transporter created successfully");

    const fromEmail =
      options.from ||
      process.env.EMAIL_FROM ||
      `Cinema Booking <${process.env.GMAIL_USER}>`;
    console.log("[EMAIL] From email:", fromEmail);

    const mailOptions = {
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };
    console.log("[EMAIL] Mail options prepared, attempting to send...");

    const result = await transporter.sendMail(mailOptions);

    console.log("[EMAIL] ✅ Email sent successfully!");
    console.log("[EMAIL] Message ID:", result.messageId);
    console.log("[EMAIL] Response:", result.response);
    console.log("[EMAIL] Accepted:", result.accepted);
    console.log("[EMAIL] Rejected:", result.rejected);
    console.log("==========================================");

    // Close the transporter
    transporter.close();
  } catch (error: any) {
    console.error("[EMAIL] ❌ ERROR sending email:");
    console.error("[EMAIL] Error name:", error.name);
    console.error("[EMAIL] Error message:", error.message);
    console.error("[EMAIL] Error code:", error.code);
    console.error("[EMAIL] Error command:", error.command);
    console.error("[EMAIL] Full error:", error);
    console.log("==========================================");
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendOtpEmail = async (
  email: string,
  otp: string,
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset OTP</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f8f9fa; }
        .otp-code {
          background: #e2e8f0;
          border: 2px dashed #4a5568;
          padding: 15px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
          margin: 20px 0;
        }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { color: #e53e3e; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Cinema Booking System</h1>
          <h2>Password Reset</h2>
        </div>

        <div class="content">
          <h3>Hello!</h3>
          <p>You have requested to reset your password. Use the OTP code below to proceed:</p>

          <div class="otp-code">${otp}</div>

          <p class="warning">⚠️ This code will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>

          <p>Best regards,<br>Cinema Booking Team</p>
        </div>

        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset OTP - Cinema Booking",
    html,
  });
};

// دالة إضافية لإرسال تأكيد الحجز
export const sendBookingConfirmation = async (
  email: string,
  bookingDetails: {
    movieTitle: string;
    showtime: string;
    auditorium: string;
    seats: string[];
    totalPrice: number;
    bookingId: string;
  },
): Promise<void> => {
  const { movieTitle, showtime, auditorium, seats, totalPrice, bookingId } =
    bookingDetails;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2d3748; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f8f9fa; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .booking-details h3 { margin-top: 0; color: #2d3748; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #38a169; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .success { color: #38a169; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Cinema Booking</h1>
          <h2>Booking Confirmation</h2>
        </div>

        <div class="content">
          <h3>🎉 Your booking has been confirmed!</h3>
          <p>Thank you for choosing our cinema. Here are your booking details:</p>

          <div class="booking-details">
            <h3>Booking #${bookingId}</h3>
            <div class="detail-row">
              <span><strong>Movie:</strong></span>
              <span>${movieTitle}</span>
            </div>
            <div class="detail-row">
              <span><strong>Showtime:</strong></span>
              <span>${showtime}</span>
            </div>
            <div class="detail-row">
              <span><strong>Auditorium:</strong></span>
              <span>${auditorium}</span>
            </div>
            <div class="detail-row">
              <span><strong>Seats:</strong></span>
              <span>${seats.join(", ")}</span>
            </div>
            <div class="detail-row total">
              <span><strong>Total Price:</strong></span>
              <span>$${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <p class="success">Please arrive 15 minutes before showtime for the best experience.</p>
          <p>For any questions, contact our support team.</p>

          <p>Best regards,<br>Cinema Booking Team</p>
        </div>

        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Booking Confirmation - ${movieTitle}`,
    html,
  });
};

// دالة لإرسال إشعار إلغاء الحجز
export const sendBookingCancellation = async (
  email: string,
  bookingDetails: {
    movieTitle: string;
    bookingId: string;
    refundAmount?: number;
  },
): Promise<void> => {
  const { movieTitle, bookingId, refundAmount } = bookingDetails;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Cancellation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #e53e3e; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f8f9fa; }
        .refund-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38a169; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { color: #e53e3e; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Cinema Booking</h1>
          <h2>Booking Cancellation</h2>
        </div>

        <div class="content">
          <h3>Your booking has been cancelled</h3>
          <p>We're sorry to hear that you had to cancel your booking. Here are the details:</p>

          <div class="booking-details">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Movie:</strong> ${movieTitle}</p>
          </div>

          ${
            refundAmount
              ? `
          <div class="refund-info">
            <h4>Refund Information</h4>
            <p>A refund of <strong>$${refundAmount.toFixed(
              2,
            )}</strong> has been processed and will appear in your original payment method within 3-5 business days.</p>
          </div>
          `
              : ""
          }

          <p>If you have any questions about this cancellation or need assistance with a new booking, please don't hesitate to contact our support team.</p>

          <p>Best regards,<br>Cinema Booking Team</p>
        </div>

        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Booking Cancellation - ${movieTitle}`,
    html,
  });
};
