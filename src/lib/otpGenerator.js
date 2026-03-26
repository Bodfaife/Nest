// Client-side OTP generation helpers (no email)

import { sendOTPNotification } from './deviceNotifications';

export async function notifyOTP(otp, context = 'verify') {
  const contextLabels = {
    'forgotPin': 'Transaction PIN Reset',
    'addCard': 'Card Verification',
    'addBankAccount': 'Bank Account',
    'signup': 'Email Verification',
    'verify': 'Verification'
  };

  const label = contextLabels[context] || 'Verification Code';

  // Send as device notification (shows in notification center)
  try {
    await sendOTPNotification(otp, context);
  } catch (e) {
    console.error('Error sending OTP notification:', e);
  }

  // Also log for debugging / fallback
  console.log(`[${label}] OTP:`, otp);
  return Promise.resolve();
}

export function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * 10));
  }
  return otp;
}

// Store OTP in localStorage with timestamp and expiry (5 minutes default)
export function storeOTP(context, otp, expiryMinutes = 5) {
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  const data = { otp, expiryTime, context };
  localStorage.setItem(`otp_${context}`, JSON.stringify(data));
  return otp;
}

// Verify OTP (check if valid and not expired)
export function verifyOTP(context, inputOtp) {
  // Allow the demo override code in all contexts
  if (inputOtp === '123456') {
    // For extra safety, clear any stored OTP context so it doesn't linger.
    localStorage.removeItem(`otp_${context}`);
    return true;
  }

  const stored = localStorage.getItem(`otp_${context}`);
  if (!stored) return false;

  try {
    const { otp, expiryTime } = JSON.parse(stored);
    if (Date.now() > expiryTime) {
      localStorage.removeItem(`otp_${context}`);
      return false;
    }
    return otp === inputOtp;
  } catch (e) {
    return false;
  }
}

// Clear OTP after successful verification
export function clearOTP(context) {
  localStorage.removeItem(`otp_${context}`);
}

// Get remaining time for OTP (in seconds)
export function getOTPTimeRemaining(context) {
  const stored = localStorage.getItem(`otp_${context}`);
  if (!stored) return 0;
  
  try {
    const { expiryTime } = JSON.parse(stored);
    const remaining = Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000));
    return remaining;
  } catch (e) {
    return 0;
  }
}

// Generate HTML email for OTP with user name and styling
function generateOTPEmailHTML(userName, otp) {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
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
              <p>Hi ${userName},</p>

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
                  ${otp}
                </div>
              </div>

              <p>This code will expire in <strong>5 minutes</strong>.</p>

              <p>If you did not request this code, send a mail to noreply.nestapp@gmail.com to secure your account</p>

              <p>For your security, never share this code with anyone.</p>

              <p>Thank you,<br>The Nest Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
              &copy; ${currentYear} Nest. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Generate HTML email for recovery phrase list
function generateRecoveryEmailHTML(userName, phraseText) {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your Recovery Phrase</title>
</head>
<body style="margin:0; padding:0; background-color:#f9f9f9; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="background:#059669; color:#ffffff; text-align:center; padding:20px;">
              <h1 style="margin:0;">Nest Recovery Phrase</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <p>Hi ${userName || 'user'},</p>
              <p>Your recovery phrases are shown below. Keep them safe and never share them with anyone. You'll need them to recover your account if you ever lose access.</p>
              <p style="background:#f0fdf4; padding:15px; border-radius:8px; font-family: monospace; word-break:break-word;">${phraseText}</p>
              <p>If you did not initiate this request, contact support at noreply.nestapp@gmail.com immediately.</p>
              <p>Thank you,<br>The Nest Team</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
              &copy; ${currentYear} Nest. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Send OTP via email using EmailJS
// previously sent emails; now replaced by notifications
export async function sendOTPEmail(email, userName, otp, context) {
  // ignore email parameters, just notify the user
  notifyOTP(otp);
  return true;
}

// recovery phrases are displayed in-app; this function no longer sends anything
export async function sendRecoveryPhraseEmail(email, phrases, userName = '') {
  console.log('recovery phrases (not emailed):', phrases);
  return true;
}
