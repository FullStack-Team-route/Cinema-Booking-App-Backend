# Resend Email Setup (FREE - Unlimited!)

## Why Resend?

✅ **Completely FREE** - No limits, no credit card required
✅ **Modern API** - Clean, simple, and fast
✅ **Excellent deliverability** - Built for developers
✅ **Real-time dashboard** - Track every email
✅ **Great for transactional emails** - Password resets, notifications
✅ **Easy setup** - API key only

## Step-by-Step Setup

### 1. Create Free Account

1. Go to **[resend.com](https://resend.com)**
2. Click **"Sign up"** (free, no credit card)
3. Verify your email address
4. You're done! 🎉

### 2. Get Your API Key

1. Login to your Resend dashboard
2. Go to **"API Keys"** tab
3. Click **"Create API Key"**
4. Copy the key (starts with `re_`)

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
# Resend Configuration (FREE & Unlimited!)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Cinema Booking <noreply@yourdomain.com>
```

### 4. Domain Verification (Optional but Recommended)

For better deliverability:

1. Go to **"Domains"** tab
2. Add your domain (e.g., `yourapp.com`)
3. Add the required DNS records
4. Wait for verification (can take a few hours)

### 5. Test Your Setup

```bash
# Send OTP test
curl -X POST http://localhost:5001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com"}'
```

Check your email for the OTP!

## Alternative Setup Methods

### Option 2: Use Their API (Advanced)

If you prefer REST API over SMTP:

```javascript
// You would need to modify emailService.ts to use fetch instead
const response = await fetch("https://api.sendpulse.com/smtp/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(emailData),
});
```

### Option 3: Use Their Web Interface

SendPulse also has a web interface for sending emails manually during development.

## Troubleshooting

**"Authentication failed"**

- Double-check your User ID and Secret
- Make sure your account is verified (email + phone)

**"Domain not verified"**

- Use their default domain for testing: `noreply@yourcompany.sendpulse.com`
- Or verify your own domain

**"Quota exceeded"**

- Free plan: 12,000 emails/month
- Check your usage in the dashboard
- Upgrade to paid plan if needed

**"Emails going to spam"**

- Add SPF/DKIM records for your domain
- Use verified sending domain
- Avoid spam trigger words in subject/content

## SendPulse Features You Get FREE

- ✅ **12,000 emails/month**
- ✅ **SMTP access**
- ✅ **Email templates**
- ✅ **Basic analytics**
- ✅ **List management** (up to 2500 contacts)
- ✅ **Automation workflows**
- ✅ **API access**

## Upgrade Options

When you grow:

- **50,000 emails**: $19/month
- **150,000 emails**: $49/month
- **500,000 emails**: $129/month

## Need Help?

- 📖 [SendPulse SMTP Docs](https://sendpulse.com/integrations/smtp)
- 💬 [SendPulse Support](https://sendpulse.com/support)
- 📧 [SendPulse Academy](https://academy.sendpulse.com/)

---

**🎉 Happy emailing with SendPulse! Your password reset system is ready!**
