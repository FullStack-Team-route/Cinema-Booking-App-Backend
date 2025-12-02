# Password Reset with OTP

## Overview

The password reset system uses OTP (One-Time Password) sent via email to securely reset user passwords.

## API Endpoints

### 1. Forgot Password - Send OTP

```
POST /api/auth/forgot-password
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "statusMsg": "success",
  "message": "OTP sent to your email successfully"
}
```

### 2. Verify OTP

```
POST /api/auth/verify-otp
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "statusMsg": "success",
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

### 3. Reset Password

```
POST /api/auth/reset-password
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "statusMsg": "success",
  "message": "Password reset successfully"
}
```

**Note:** OTP is no longer required in reset-password since it's already verified in step 2.

## Email Configuration

### 🚀 **Recommended: Resend (FREE - Unlimited for personal use!)**

Resend is the easiest and most modern email service - completely free!

#### Quick Setup:

1. Go to **[resend.com](https://resend.com)**
2. Sign up with your email (free, no credit card)
3. Verify your email
4. Get your API key from the dashboard
5. Add to `.env`:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Cinema Booking <noreply@yourdomain.com>
```

---

### Alternative: SendGrid (FREE - 100 emails/day)

SendGrid is also great for development and small projects!

#### Step 1: Create Free SendGrid Account

1. Go to https://sendgrid.com
2. Sign up for a free account (no credit card required)
3. Verify your email address

#### Step 2: Create API Key

1. Login to your SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **"Create API Key"**
4. Choose **"Full Access"** or **"Restricted Access"** (enable Mail Send)
5. **Copy the API Key** (you won't see it again!)

#### Step 3: Configure Environment Variables

Add to your `.env` file:

```env
# SendGrid Configuration (FREE: 100 emails/day)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key-here
SENDGRID_API_KEY=your-sendgrid-api-key-here
```

#### Alternative: Gmail (Less Reliable)

If you prefer Gmail, you'll need 2FA and an App Password:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
```

## OTP Features

- **6-digit numeric code**
- **Expires in 10 minutes**
- **One-time use only**
- **Invalidated on password reset**
- **Automatic cleanup** (MongoDB TTL index)

## Security Features

- **Current password verification** required for reset
- **OTP must be verified** before password reset (verified OTP presence checked automatically)
- **New password validation** (minimum 6 characters, different from current)
- **Email normalization** and validation
- **Rate limiting implemented** - prevents spam and abuse
- **OTP attempt limiting** - maximum 3 verification attempts per OTP
- **Cooldown periods** - 2 minutes between OTP requests, 1 hour max per email

## Database Schema

```javascript
const OtpSchema = {
  email: String,
  otp: String,
  expiresAt: Date, // TTL index - auto delete after 10 minutes
  used: Boolean, // True when used for password reset
  verified: Boolean, // True when OTP is successfully verified
  attempts: Number, // Failed verification attempts (max 3)
  lastAttemptAt: Date, // Timestamp of last verification attempt
  createdAt: Date,
  updatedAt: Date,
};
```

## Usage Flow

1. User requests password reset → Email with OTP sent
2. User enters OTP → OTP verified (marked as verified) but not used yet
3. User enters current + new password → Password updated and OTP marked as used (OTP not required in request)
4. OTP becomes invalid after use

## Rate Limiting & Anti-Spam Protection

### OTP Request Limits

- **Maximum 3 OTP requests per hour** per email address
- **2-minute cooldown period** between consecutive OTP requests
- **Prevents email spam** and abuse of the system

### OTP Verification Limits

- **Maximum 3 verification attempts** per OTP code
- **OTP becomes locked** after 3 failed attempts
- **Must request new OTP** if verification attempts are exceeded

### Rate Limiting Error Responses

**Too many OTP requests (hourly limit):**

```json
{
  "statusMsg": "fail",
  "message": "Too many OTP requests. Please wait 1 hour before requesting another OTP."
}
```

**Too frequent requests (cooldown):**

```json
{
  "statusMsg": "fail",
  "message": "OTP already sent recently. Please wait 2 minutes before requesting another."
}
```

**Too many verification attempts:**

```json
{
  "statusMsg": "fail",
  "message": "Too many failed attempts. Please request a new OTP."
}
```

**Invalid OTP with attempts remaining:**

```json
{
  "statusMsg": "fail",
  "message": "Invalid OTP. X attempts remaining."
}
```

## Error Responses

All endpoints return consistent error format:

```json
{
  "statusMsg": "fail",
  "message": "Error description"
}
```
