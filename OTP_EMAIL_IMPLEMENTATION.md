# OTP & Recovery Phrase Notes

The app no longer sends OTP codes or recovery phrases via email. Delivery
and display are handled entirely on the device instead of relying on an
external service.

## Current implementation

- `generateOTP`, `storeOTP`, and `verifyOTP` form the core one‑time code logic.
- `notifyOTP(otp, context)` dispatches an **in‑app alert banner** at the
  bottom of the screen containing the code (uses the shared `AppAlert`
  component so it matches the app colours).
- Recovery phrases are shown directly on the `RecoveryPhraseScreen`.

## Screens updated

- **PinScreen** (forgot PIN) calls `notifyOTP` instead of emailing.
- **AddPaymentSourceScreen** & **AddBankAccountScreen** generate OTPs and send
  them via `notifyOTP`.
- **OTPInputScreen** text and descriptions reference the bottom‑of‑screen alert
  and instruct users to look for the banner rather than external notifications.

## Notes

The previous `sendOTPEmail` and `sendRecoveryPhraseEmail` exports still
exist in `src/lib/otpGenerator.js` for legacy compatibility but are not
used anywhere in the application. The `.env` file no longer requires any
EmailJS keys, and the `EMAILJS_SETUP.md` documentation can be ignored or
deleted.

This shift simplifies deployment and removes the dependency on email
services. OTPs remain valid for five minutes and are stored only in
`localStorage`.

