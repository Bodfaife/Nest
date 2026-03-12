/**
 * Device Notifications - sends notifications to the device's notification center
 * Works across all platforms using the Notification API + Service Worker
 */

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('🔔 Notifications not supported on this device');
    return false;
  }

  console.log(`🔔 Current notification permission state: ${Notification.permission}`);

  if (Notification.permission === 'granted') {
    console.log('🔔 Notification permission already granted');
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      console.log(`🔔 Notification permission result: ${permission}`);
      return permission === 'granted';
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return false;
    }
  }

  console.warn('🔔 Notification permission was denied by user');
  return false;
}

export async function sendDeviceNotification(options = {}) {
  const {
    title = 'Nest',
    body = '',
    tag = 'nest-notification',
    icon = '/Nest logo.png',
    badge = '/Nest logo.png',
    autoClose = true,
    timeout = 8000,
  } = options;

  if (Notification.permission !== 'granted') {
    console.warn('🔔 Notification permission not granted');
    return null;
  }

  try {
    // Try to use service worker notification (persists in notification center)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration) {
          const notification = await registration.showNotification(title, {
            body,
            tag,
            icon,
            badge,
            requireInteraction: !autoClose, // keeps notification visible if autoClose is false
            actions: [
              { action: 'close', title: 'Dismiss' }
            ],
            // Enhanced styling for notification center
            silent: false,
            vibrate: [200, 100, 200]
          });

          // Auto-close notification after timeout if enabled
          if (autoClose && timeout > 0) {
            setTimeout(() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then((reg) => {
                  if (reg) {
                    reg.getNotifications({ tag }).then((notifications) => {
                      notifications.forEach(n => n.close());
                    });
                  }
                });
              }
            }, timeout);
          }

          console.log(`🔔 Device notification sent via Service Worker: ${title}`);
          return notification;
        }
      } catch (swError) {
        console.warn('⚠️ Service Worker notification failed, trying fallback:', swError.message);
      }
    }

    // Fallback to regular Notification API
    const notification = new Notification(title, {
      body,
      tag,
      icon,
      badge,
      silent: false,
      vibrate: [200, 100, 200]
    });

    if (autoClose && timeout > 0) {
      setTimeout(() => notification.close(), timeout);
    }

    console.log(`🔔 Device notification sent (fallback): ${title}`);
    return notification;
  } catch (e) {
    console.error('Error sending device notification:', e);
    return null;
  }
}

/**
 * Send OTP notification to device
 */
export async function sendOTPNotification(otp, context = 'verify') {
  const contextLabels = {
    'forgotPin': 'Transaction PIN Reset',
    'addCard': 'Card Verification',
    'addBankAccount': 'Bank Account',
    'signup': 'Email Verification',
    'verify': 'Verification'
  };

  const label = contextLabels[context] || 'Verification Code';

  console.log(`🔔 Sending OTP notification for ${label}: ${otp}`);

  return sendDeviceNotification({
    title: `Nest ${label}`,
    body: `Your code: ${otp}`,
    tag: `otp-${context}`,
    autoClose: false, // OTP should stay visible until user interacts
    timeout: 300000 // 5 minutes
  });
}

/**
 * Send transaction notification
 */
export async function sendTransactionNotification(type, amount, status = 'success') {
  const typeLabels = {
    'deposit': 'Deposit',
    'withdraw': 'Withdrawal',
    'save': 'Savings Created',
    'topup': 'Savings Top-up'
  };

  const typeLabel = typeLabels[type] || 'Transaction';
  const statusEmoji = status === 'success' ? '✅' : '❌';
  const statusLabel = status === 'success' ? 'Successful' : 'Failed';
  const numAmount = Number(amount) || 0;

  console.log(`🔔 Sending ${statusLabel} transaction notification for ${typeLabel}: ₦${numAmount.toLocaleString()}`);

  return sendDeviceNotification({
    title: `${statusEmoji} ${typeLabel} ${statusLabel}`,
    body: `Amount: ₦${numAmount.toLocaleString()}`,
    tag: `transaction-${Date.now()}`,
    autoClose: true,
    timeout: 6000
  });
}

/**
 * Send login notification
 */
export async function sendLoginNotification(email) {
  return sendDeviceNotification({
    title: '✅ Login Successful',
    body: `Welcome back, ${email}`,
    tag: 'login-notification',
    autoClose: true,
    timeout: 5000
  });
}

/**
 * Send generic alert notification
 */
export async function sendAlertNotification(title, message) {
  return sendDeviceNotification({
    title: `⚠️ ${title}`,
    body: message,
    tag: `alert-${Date.now()}`,
    autoClose: true,
    timeout: 7000
  });
}
