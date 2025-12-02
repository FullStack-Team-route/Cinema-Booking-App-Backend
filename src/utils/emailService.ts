import { Resend } from "resend";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured. Get it from https://resend.com"
      );
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Cinema Booking <noreply@yourdomain.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("Email sent successfully:", result.data?.id);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendOtpEmail = async (
  email: string,
  otp: string
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
