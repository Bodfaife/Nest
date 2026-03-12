# EmailJS Setup Guide for OTP Emails (Deprecated)

> **Note:** Email delivery has been removed from the app. This document is left
> for archival purposes only and can be ignored or deleted.

This app uses **EmailJS** to send OTP (One-Time Password) verification codes directly from the browser without requiring a backend server.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Once logged in, you'll see your **Public Key** in the Account > API Keys section

## Step 2: Set Up an Email Service

EmailJS supports multiple email providers:

### Option A: Using Gmail (Recommended for testing)
1. In EmailJS Dashboard, go to **Email Services**
2. Click "Add Service" and select **Gmail**
3. Email: Your Gmail address
4. Password: Use an [App Password](https://support.google.com/accounts/answer/185833) (not your regular password)
   - Enable 2FA on your Google account first
   - Generate an app-specific password in Google Account settings
   - Use that app password in EmailJS
5. Copy your **Service ID** (format: `service_xxx`)

### Option B: Using SendGrid
1. Create a [SendGrid account](https://sendgrid.com/)
2. Generate an API key
3. In EmailJS, add SendGrid as a service
4. Copy your **Service ID**

## Step 3: Create an OTP Email Template

1. In EmailJS Dashboard, go to **Email Templates**
2. Click "Create New Template"
3. Use this template code:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f9f9f9; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#059669; color:#ffffff; text-align:center; padding:20px;">
              <h1 style="margin:0;">Nest Verification Code</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <p>Hi {{user_name}},</p>
              <p>Your one-time verification code. Use the code below to continue:</p>
              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <div style="
                  display:inline-block;
                  padding:15px 30px;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:6px;
                  background:#ecfdf5;
                  color:#059669;
                  border-radius:8px;
                ">
                  {{otp_code}}
                </div>
              </div>
              <p>This code will expire in <strong>5 minutes</strong>.</p>
              <p>If you did not request this code, please ignore this email or secure your account immediately by sending a mail to noreply.nestapp@gmail.com</p>
              <p>For your security, never share this code with anyone.</p>
              <p>Thank you,<br>The Nest Team</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
              &copy; {{current_year}} Nest. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

4. Set up template variables:
   - `user_name`: User's full name
   - `otp_code`: The 6-digit OTP code
   - `current_year`: Current year (auto-filled)

5. Save the template and copy your **Template ID** (format: `template_xxx`)

## Step 4: Configure Environment Variables

Update `.env` file in the project root with your credentials:

```env
# EmailJS Configuration
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
```

## Step 5: Test the OTP Email Flow

1. Start the development server: `npm start`
2. Navigate to forgot PIN flow
3. Click "Forgot PIN" on the PIN entry screen
4. You should receive an email with the OTP code
5. Enter the code to verify

## Troubleshooting

### Email not sending?
- Check that your Service ID, Template ID, and Public Key are correct in `.env`
- Verify the email service credentials (Gmail app password, SendGrid API key)
- Check EmailJS Dashboard > Logs for error messages

### Template variables not substituting?
- Ensure template variable names match exactly in the template:
  - `{{user_name}}`
  - `{{otp_code}}`
  - `{{current_year}}`

### Gmail showing "App password not accepted"?
- Enable 2-Factor Authentication on your Google Account first
- Then generate a new App Password
- Use the full 16-character app password

## Production Deployment

For production:
1. Update `.env` with production EmailJS credentials
2. Consider using a more robust email service (SendGrid, AWS SES)
3. Add rate limiting to prevent OTP spam
4. Store OTP hashes instead of plain text (optional security enhancement)

## Security Notes

- OTPs are stored in localStorage (5-minute expiry)
- Never share your Public Key publicly
- Keep Service IDs and Template IDs confidential
- Use app-specific passwords, never store your primary account password
