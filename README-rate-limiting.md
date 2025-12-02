# Rate Limiting & Anti-Spam Protection

## Overview

The password reset system includes comprehensive rate limiting to prevent spam and abuse.

## Rate Limits

### 1. OTP Request Limits

- **Maximum 3 OTP requests per hour** per email address
- **2-minute cooldown** between consecutive OTP requests
- **Purpose**: Prevents email spam and server abuse

### 2. OTP Verification Limits

- **Maximum 3 verification attempts** per OTP code
- **OTP locked** after 3 failed attempts
- **Purpose**: Prevents brute force attacks

## Implementation Details

### Database Schema Extensions

```javascript
const OtpSchema = {
  // ... existing fields
  attempts: Number, // Failed verification attempts (max 3)
  lastAttemptAt: Date, // Timestamp of last verification attempt
  // ... existing fields
};
```

### Request Flow with Rate Limiting

```
User requests OTP
    ↓
Check hourly limit (max 3/hour)
    ↓
Check cooldown (2 minutes)
    ↓
Send OTP or return error
```

```
User verifies OTP
    ↓
Check if OTP valid
    ↓
If invalid: increment attempts
    ↓
If attempts >= 3: lock OTP
    ↓
Return result
```

## Error Responses

### HTTP 429 - Too Many Requests

**Hourly limit exceeded:**

```json
{
  "statusMsg": "fail",
  "message": "Too many OTP requests. Please wait 1 hour before requesting another OTP."
}
```

**Cooldown active:**

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

### HTTP 400 - Bad Request

**Invalid OTP with attempts remaining:**

```json
{
  "statusMsg": "fail",
  "message": "Invalid OTP. 2 attempts remaining."
}
```

## Security Benefits

### Prevents Common Attacks

- **Email spam**: Limited OTP requests per hour
- **Brute force**: Limited verification attempts
- **Server abuse**: Cooldown periods prevent rapid requests

### User Experience

- **Clear error messages**: Users know why requests are blocked
- **Time-based limits**: Fair usage for legitimate users
- **Progressive feedback**: Shows remaining attempts

## Configuration

### Time Limits (configurable)

```javascript
const HOURLY_LIMIT = 3; // OTP requests per hour
const COOLDOWN_MINUTES = 2; // Minutes between requests
const MAX_ATTEMPTS = 3; // Verification attempts per OTP
const OTP_EXPIRY = 10; // Minutes
```

### Database Indexes

```javascript
// For rate limiting queries
OtpSchema.index({ email: 1, createdAt: 1 });
OtpSchema.index({ email: 1, used: 1, expiresAt: 1 });

// For TTL cleanup
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

## Monitoring

### Check Current Usage

```javascript
// Count OTPs sent in last hour for an email
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
const recentOtps = await Otp.countDocuments({
  email: "user@example.com",
  createdAt: { $gte: oneHourAgo },
});
```

### Check Failed Attempts

```javascript
// Find OTPs with failed attempts
const problematicOtps = await Otp.find({
  attempts: { $gte: 1 },
});
```

## Best Practices

### For Production

1. **Monitor usage patterns** regularly
2. **Adjust limits** based on traffic
3. **Add IP-based limiting** if needed
4. **Implement progressive delays** for repeated failures

### For Development

1. **Use shorter limits** for testing
2. **Log rate limit hits** for debugging
3. **Test edge cases** thoroughly

## Alternative Approaches

### Redis-based Rate Limiting

For more advanced rate limiting, consider using Redis:

- Faster than database queries
- More flexible limit windows
- Distributed rate limiting

### External Services

- **Cloudflare Rate Limiting**
- **AWS WAF**
- **Akamai Bot Manager**

---

**🎯 This system provides robust protection against spam while maintaining good user experience.**
