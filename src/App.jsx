import React, { useEffect, useState } from "react";
import { CurrencyProvider } from "./context/CurrencyContext";

// Onboarding Screens
import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import RecoveryPhraseScreen from "./screens/RecoveryPhraseScreen";
import RegistrationSplashScreen from "./screens/RegistrationSplashScreen";
import CreateTransactionPinScreen from "./screens/CreateTransactionPinScreen";
import CreateSavingsPromptScreen from "./screens/CreateSavingsPromptScreen";
import CreateSavingsFormBioScreen from "./screens/CreateSavingsFormBioScreen";
import CreateSavingsFormSavingsScreen from "./screens/CreateSavingsFormSavingsScreen";

// Main App Screens
import BottomNav from "./components/BottomNav";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SavingsScreen from "./screens/SavingsScreen";
import DepositScreen from "./screens/DepositScreen";
import WithdrawScreen from "./screens/WithdrawScreen";
import ConfirmPaymentScreen from "./screens/ConfirmPaymentScreen";
import PinScreen from "./screens/PinScreen";
import PaymentProcessingScreen from "./screens/PaymentProcessingScreen";
import TransactionResultScreen from "./screens/TransactionResultScreen";
import TransactionReceiptScreen from "./screens/TransactionReceiptScreen";
import TransactionsHistoryScreen from "./screens/TransactionHistoryScreen";
import SavingsDetailScreen from "./screens/SavingsDetailScreen";
import DownloadStatementScreen from "./screens/DownloadStatementScreen";

// Profile Sub-Screens
import NotificationsScreen from "./screens/NotificationsScreen";
import SecurityPrivacyScreen from "./screens/SecurityPrivacyScreen";
import PersonalInformationScreen from "./screens/PersonalInformationScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import SavedCardsScreen from "./screens/SavedCardsScreen";
import SavedAccountsScreen from "./screens/SavedAccountsScreen";

// Payment & Card Screens
import AddPaymentSourceScreen from "./screens/AddPaymentSourceScreen";
import CardVerificationScreen from "./screens/CardVerificationScreen";
import SaveCardDetailsScreen from "./screens/SaveCardDetailsScreen";
import CardPaymentMethodScreen from "./screens/CardPaymentMethodScreen";
import CardPaymentOTPScreen from "./screens/CardPaymentOTPScreen";
import CardPaymentProcessingScreen from "./screens/CardPaymentProcessingScreen";
import BankTransferPaymentScreen from "./screens/BankTransferPaymentScreen";
import BankTransferInstructionsScreen from "./screens/BankTransferInstructionsScreen";

// Bank Account Screens
import AddBankAccountScreen from "./screens/AddBankAccountScreen";
import BankAccountSuccessScreen from "./screens/BankAccountSuccessScreen";

// Savings Lock Screens
import LockSavingsMethodScreen from "./screens/LockSavingsMethodScreen";

// Account Management Screens
import ResetPINScreen from "./screens/ResetPINScreen";
import CloseAccountScreen from "./screens/CloseAccountScreen";

// Recovery Screens
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ForgotTransactionPinScreen from "./screens/ForgotTransactionPinScreen";
import RecoveryPhraseVerificationScreen from "./screens/RecoveryPhraseVerificationScreen";
import CreateNewPasswordScreen from "./screens/CreateNewPasswordScreen";
import PasswordResetSuccessScreen from "./screens/PasswordResetSuccessScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

// Receipt & Utilities
import NestTransactionReceiptPDF from "./screens/NestTransactionReceiptPDF";
import { generateReference } from "./helpers/reference";
import { generateRecoveryPhrase } from "./helpers/generateRecoveryPhrase";
import { useRef } from "react";
import { debug } from './helpers/debug';
import api from './helpers/apiClient';

function App() {
  // ===== Core Navigation State =====
  const [currentScreen, setCurrentScreen] = useState("Splash");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // ===== User & Authentication =====
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed) {
      debug.log("📱 App init: Found saved user account with", parsed.email ? "email" : "phone", parsed.email || parsed.phone);
    }
    return parsed;
  });

  // ===== Balance & Transactions =====
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("balance");
    return saved ? parseFloat(saved) : 0;
  });
  const [savingsBalance, setSavingsBalance] = useState(() => {
    const saved = localStorage.getItem("savingsBalance");
    return saved ? parseFloat(saved) : 0;
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // ===== Payment Flow State =====
  const [pendingPayment, setPendingPayment] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [requirePin, setRequirePin] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [depositMode, setDepositMode] = useState("start"); // start | topup

  // ===== Card Linking State =====
  const [bankCards, setBankCards] = useState(() => {
    const cards = localStorage.getItem("bankCards");
    return cards ? JSON.parse(cards) : [];
  });
  const [cardBeingLinked, setCardBeingLinked] = useState(null);
  const [cardLinkingStep, setCardLinkingStep] = useState("add"); // add | verify | save | success

  // ===== Bank Accounts State =====
  const [bankAccounts, setBankAccounts] = useState(() => {
    const accounts = localStorage.getItem("bankAccounts");
    return accounts ? JSON.parse(accounts) : [];
  });
  const [swRegistration, setSwRegistration] = useState(null);
  const reminderTimerRef = useRef(null);

  // ===== Savings & Subscription State =====
  const [savingsPlanData, setSavingsPlanData] = useState(null);
  const [savingsFlowScreen, setSavingsFlowScreen] = useState(() => {
    const saved = localStorage.getItem("savingsFlowScreen");
    return saved || null;
  });
  const hasActiveSavings = Boolean(user?.savingsPlan && user.savingsPlan.isActive);

  // ===== Savings Lock State =====
  const [lockSavingsStep, setLockSavingsStep] = useState(null);
  const [lockSavingsMethod, setLockSavingsMethod] = useState(null);

  // ===== Payment Feature Flags =====
  const [showBankTransferInstructions, setShowBankTransferInstructions] = useState(false);
  const [showCardPaymentOTP, setShowCardPaymentOTP] = useState(false);
  const [showCardPaymentProcessing, setShowCardPaymentProcessing] = useState(false);
  const [selectedCardForPayment, setSelectedCardForPayment] = useState(null);

  // ===== Profile State =====
  const [profileSection, setProfileSection] = useState(null); // null | 'notifications' | 'security' | 'personal'
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const [newBankAccountData, setNewBankAccountData] = useState(null); // Account data after successful addition
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [profilePicture, setProfilePicture] = useState(() => {
    const picture = localStorage.getItem("profilePicture");
    return picture || null;
  });
  const [dangerZoneAction, setDangerZoneAction] = useState(null); // null | 'resetPin' | 'closeAccount'

  // ===== Navigation Context =====
  const [openedFrom, setOpenedFrom] = useState(null);
  const [returnToProfileSubScreen, setReturnToProfileSubScreen] = useState(null); // null | 'SavedCards' | 'SavedAccounts'
  const [bankTransferStep, setBankTransferStep] = useState(null);

  // ===== Signup OTP State =====
  const [signupEmail, setSignupEmail] = useState("");
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  // ===== Persistence =====
  useEffect(() => {
    // Register service worker to enable notifications where possible
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        setSwRegistration(reg);
      }).catch(() => {});
    }

    // On app load, schedule any pending savings reminder saved previously
    const nextTop = localStorage.getItem('nextTopup');
    if (nextTop) {
      try {
        const ts = parseInt(nextTop, 10);
        schedulePendingReminder(ts);
      } catch (e) {}
    }
    const u = localStorage.getItem("user");
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setUser(parsed);
      } catch (e) {}
    }
    const savingsFlowScreenSaved = localStorage.getItem("savingsFlowScreen");
    const savingsPlanDataSaved = localStorage.getItem("savingsPlanData");
    if (savingsFlowScreenSaved) setSavingsFlowScreen(savingsFlowScreenSaved);
    if (savingsPlanDataSaved) setSavingsPlanData(JSON.parse(savingsPlanDataSaved));

    // Attempt silent refresh on load and populate current user
    (async () => {
      try {
        await api.refresh();
        const me = await api.getMe();
        if (me) {
          setUser(me);
          localStorage.setItem('user', JSON.stringify(me));
        }
      } catch (e) {
        // ignore - remain unauthenticated
      }
    })();
  }, []);

  useEffect(() => {
    // Log on user login/logout
    if (user) {
      debug.log("👤 User authenticated:", user.email || user.phone);
    } else {
      debug.log("👤 User logged out or not authenticated");
    }
  }, [user]);

  // Expose a test function to window for debugging
  React.useEffect(() => {
    window.debugLocalStorage = () => {
      debug.log("🔍 === LOCALSTORAGE DEBUG ===");
      const user = localStorage.getItem("user");
      debug.log("user:", user ? JSON.parse(user) : null);
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (key !== "user") {
          debug.log(`${key}:`, value?.substring(0, 100) + (value?.length > 100 ? "..." : ""));
        }
      }
      debug.log("🔍 === END DEBUG ===");
    };
    debug.log("💡 Tip: Run window.debugLocalStorage() in console to see all localStorage data");
  }, []);

  useEffect(() => {
    // Clean up reminder timer on unmount
    return () => {
      if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
    };
  }, []);

  // Redirect to add payment source/account when missing before confirmation
  useEffect(() => {
    if (currentScreen === 'ConfirmPayment' && pendingPayment) {
      if (pendingPayment.paymentMethod === 'card' && !pendingPayment.selectedCard) {
        setOpenedFrom('ConfirmPayment');
        setCurrentScreen('AddPaymentSource');
      } else if (pendingPayment.paymentMethod === 'bank' && !pendingPayment.selectedAccount) {
        setOpenedFrom('ConfirmPayment');
        setCurrentScreen('AddBankAccount');
      }
    }
  }, [currentScreen, pendingPayment]);

  const showNotification = async (title, body) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
      try { await Notification.requestPermission(); } catch (e) { return; }
    }
    if (Notification.permission !== 'granted') return;

    if (swRegistration && swRegistration.showNotification) {
      try {
        swRegistration.showNotification(title, { body });
        return;
      } catch (e) {}
    }

    // Fallback to page Notification
    try { new Notification(title, { body }); } catch (e) {}
  };

  const MAX_TIMEOUT = 2147483647; // max setTimeout (~24.8 days)

  const schedulePendingReminder = (timestamp) => {
    const now = Date.now();
    const ms = timestamp - now;
    if (ms <= 0) {
      // overdue - notify immediately and compute next
      showNotification('Time to top up', 'It\'s time to top up your savings.');
      // remove stored pending and let next schedule be set by subsequent saves
      localStorage.removeItem('nextTopup');
      return;
    }

    const delay = Math.min(ms, MAX_TIMEOUT);
    if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
    reminderTimerRef.current = setTimeout(() => {
      showNotification('Time to top up', 'It\'s time to top up your savings.');
      localStorage.removeItem('nextTopup');
    }, delay);
  };

  const scheduleSavingsReminder = (form) => {
    if (!form || !form.reminder) return;
    const now = new Date();
    let next = new Date(now.getTime());
    const freq = (form.frequency || '').toLowerCase();
    if (freq === 'daily') next.setDate(next.getDate() + 1);
    else if (freq === 'weekly') next.setDate(next.getDate() + 7);
    else if (freq === 'monthly') next.setMonth(next.getMonth() + 1);
    else next.setDate(next.getDate() + 1);

    const ts = next.getTime();
    localStorage.setItem('nextTopup', String(ts));
    schedulePendingReminder(ts);
  };

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("bankCards", JSON.stringify(bankCards));
    localStorage.setItem("bankAccounts", JSON.stringify(bankAccounts));
    localStorage.setItem("balance", String(balance));
    localStorage.setItem("savingsBalance", String(savingsBalance));
    if (savingsFlowScreen) localStorage.setItem("savingsFlowScreen", savingsFlowScreen);
    if (savingsPlanData) localStorage.setItem("savingsPlanData", JSON.stringify(savingsPlanData));
    if (profilePicture) localStorage.setItem("profilePicture", profilePicture);
  }, [user, transactions, bankCards, bankAccounts, profilePicture, balance, savingsBalance, savingsFlowScreen, savingsPlanData]);

  // ===== Auto-Mature Savings =====
  useEffect(() => {
    if (!user?.savingsPlan?.isActive) return;
    const now = new Date();
    const withdrawalDate = new Date(user.savingsPlan.withdrawalDate);
    if (now >= withdrawalDate) {
      setUser(prev => ({
        ...prev,
        savingsPlan: { ...prev.savingsPlan, isActive: false },
      }));
    }
  }, [user]);

  // ===== Navigation Helpers =====
  const openScreen = (screen, data = null, fromScreen = null) => {
    const previousScreen = fromScreen || currentScreen;
    
    if (screen === "Notifications") {
      setProfileSection("notifications");
      return;
    }
    if (screen === "SecurityPrivacy") {
      setProfileSection("security");
      return;
    }
    if (screen === "PersonalInformation") {
      setProfileSection("personal");
      return;
    }
    if (screen === "SavedCards") {
      setShowSavedCards(true);
      return;
    }
    if (screen === "SavedAccounts") {
      setShowSavedAccounts(true);
      return;
    }
    if (screen === "TransactionHistory") {
      setOpenedFrom(previousScreen);
      setCurrentScreen("TransactionHistory");
      return;
    }
    if (screen === "DownloadStatement") {
      setOpenedFrom(previousScreen);
      setCurrentScreen("DownloadStatement");
      return;
    }
    if (screen === "Deposit") {
      setOpenedFrom(previousScreen);
      setDepositMode(hasActiveSavings ? "topup" : "start");
      setCurrentScreen("Deposit");
      return;
    }
    if (screen === "AddBankAccount") {
      setOpenedFrom(previousScreen);
      setCurrentScreen("AddBankAccount");
      return;
    }
    if (screen === "TransactionReceipt") {
      setOpenedFrom(previousScreen);
      setSelectedTransaction(data);
      setCurrentScreen("TransactionReceipt");
      return;
    }
    // Default: set openedFrom for all other screens
    setOpenedFrom(previousScreen);
    setCurrentScreen(screen);
  };

  const goHome = () => {
    setCurrentScreen("Main");
    setActiveTab("home");
    setShowBankTransferInstructions(false);
    setShowCardPaymentOTP(false);
    setShowCardPaymentProcessing(false);
    setPendingPayment(null);
    setOpenedFrom(null);
  };

  const handleBack = () => {
    // If we came from a profile sub-screen, return to it
    if (returnToProfileSubScreen === "SavedCards") {
      setCurrentScreen("Main");
      setShowSavedCards(true);
      setReturnToProfileSubScreen(null);
      setOpenedFrom(null);
      return;
    }
    if (returnToProfileSubScreen === "SavedAccounts") {
      setCurrentScreen("Main");
      setShowSavedAccounts(true);
      setReturnToProfileSubScreen(null);
      setOpenedFrom(null);
      return;
    }
    
    // Otherwise, use normal openedFrom navigation
    if (openedFrom && openedFrom !== "Main") {
      setCurrentScreen(openedFrom);
      setOpenedFrom(null);
    } else {
      goHome();
    }
  };

  const handleBackFromContextScreen = () => {
    if (openedFrom === "Main" || openedFrom === "HomeScreen") {
      goHome();
      setOpenedFrom(null);
    } else if (openedFrom) {
      setCurrentScreen(openedFrom);
      setOpenedFrom(null);
    } else {
      goHome();
    }
  };

  const handleLogout = () => {
    // Call backend to clear refresh token cookie, then clear client state
    (async () => {
      try { await api.logout(); } catch (e) { /* ignore */ }
      setUser(null);
      setCurrentScreen("SignIn");
    })();
  };

  // ===== Transaction Helpers =====
  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const handlePinSuccess = () => {
    setRequirePin(false);
    
    if (pendingPayment) {
      if (pendingPayment.type === "withdraw") {
        setPendingAction(null);
        setCurrentScreen("PaymentProcessing");
      } else if (pendingPayment.paymentMethod === 'bank') {
        setPendingAction(null);
        setShowBankTransferInstructions(true);
      } else if (pendingPayment.paymentMethod === 'card') {
        setPendingAction(null);
        setShowCardPaymentOTP(true);
      }
    } else if (typeof pendingAction === "function") {
      pendingAction();
    }
    
    setPendingAction(null);
  };

  const processTransaction = (pendingPayment) => {
    const amount = Number(pendingPayment.amount);
    let txType = pendingPayment.type;
    let newBalance = balance;
    let newSavingsBalance = savingsBalance;

    if (txType === "save") {
      if (user?.savingsPlan && user.savingsPlan.isActive) {
        txType = "topup";
      }
    }

    if (txType === "save") {
      newBalance = balance + amount;
      newSavingsBalance = savingsBalance + amount;
      setUser(prev => {
        if (prev?.savingsPlan?.isActive) return prev;
        return {
          ...prev,
          savingsPlan: {
            isActive: true,
            startDate: pendingPayment.startDate,
            withdrawalDate: pendingPayment.withdrawalDate,
            durationMonths: pendingPayment.durationMonths,
            amountPerInterval: pendingPayment.amountPerInterval,
            frequency: pendingPayment.frequency || null,
            targetAmount: pendingPayment.targetAmount || null,
          },
        };
      });
      try { scheduleSavingsReminder(pendingPayment); } catch (e) {}
      localStorage.removeItem("savedBioForm");
      localStorage.removeItem("savedSavingsForm");
      localStorage.removeItem("savingsPlanData");
      localStorage.removeItem("savingsFlowScreen");
      setSavingsPlanData(null);
      setSavingsFlowScreen(null);
    } else if (txType === "topup") {
      newBalance = balance + amount;
      newSavingsBalance = savingsBalance + amount;
    } else if (txType === "withdraw") {
      newBalance = Math.max(0, balance - amount);
      if (savingsBalance >= amount) {
        newSavingsBalance = Math.max(0, savingsBalance - amount);
        
        // If all savings have been withdrawn, reset the savings plan
        if (newSavingsBalance === 0) {
          setUser(prev => ({
            ...prev,
            savingsPlan: null
          }));
          setSavingsPlanData(null);
          localStorage.removeItem("savingsPlanData");
          localStorage.removeItem("savedBioForm");
          localStorage.removeItem("savedSavingsForm");
        }
      } else {
        newSavingsBalance = savingsBalance;
      }
    } else if (txType === "deposit") {
      newBalance = balance + amount;
      newSavingsBalance = savingsBalance;
    }

    setBalance(newBalance);
    setSavingsBalance(newSavingsBalance);

    const tx = {
      id: Date.now(),
      reference: generateReference(),
      type: txType,
      amount,
      date: new Date().toISOString(),
      status: "success",
      paymentMethod: pendingPayment.source === "Bank Transfer" ? "bank" : "card",
      paymentSource: pendingPayment.source,
      paymentDestination: pendingPayment.destination, // Add destination for withdrawals
      balanceAfter: newBalance,
    };

    addTransaction(tx);
    setTransactionResult(tx);
    setPendingPayment(null);
    setCurrentScreen("TransactionResult");
  };

  // ===== Main Render =====
  return (
    <CurrencyProvider>
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        {/* ===== ONBOARDING SCREENS ===== */}
        {currentScreen === "Splash" && (
          <SplashScreen onFinish={() => setCurrentScreen(user ? "Main" : "SignIn")} />
        )}

        {currentScreen === "SignIn" && (
          <SignInScreen
            onSignIn={(u) => {
              setUser(u);
              goHome();
            }}
            onNavigateToSignUp={() => {
              setOpenedFrom("SignIn");
              setCurrentScreen("SignUp");
            }}
            onNavigateToForgotPassword={() => {
              setOpenedFrom("SignIn");
              setCurrentScreen("ForgotPassword");
            }}
          />
        )}

        

        {currentScreen === "OTPVerification" && (
          <OTPVerificationScreen
            darkMode={darkMode}
            email={signupEmail}
            onBack={() => {
              setOpenedFrom("OTPVerification");
              setCurrentScreen("SignUp");
            }}
            onVerify={() => {
              setOpenedFrom("OTPVerification");
              setCurrentScreen("RecoveryPhrase");
            }}
            onResendOTP={() => debug.log("OTP resent to", signupEmail)}
          />
        )}

        {currentScreen === "RecoveryPhrase" && (
          <RecoveryPhraseScreen 
            phrases={user?.recoveryPhrase || []}
            onContinue={() => setCurrentScreen("CreatePin")} 
          />
        )}

        {currentScreen === "CreatePin" && (
          <CreateTransactionPinScreen
            darkMode={darkMode}
            onBack={() => setCurrentScreen("RecoveryPhrase")}
            onPinCreated={(newPin) => {
              // Save PIN to localStorage and user object
              localStorage.setItem("userPin", newPin);
              const updatedUser = { ...user, transactionPin: newPin };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
              // Continue to registration splash which shows account number
              setCurrentScreen("RegistrationSplash");
            }}
          />
        )}

        {currentScreen === "RegistrationSplash" && (
          <RegistrationSplashScreen 
            user={user} 
            onDone={(accountNumber) => {
              setUser(prev => ({ ...prev, accountNumber }));
              setCurrentScreen("CreateSavingsPrompt");
            }} 
          />
        )}

        {currentScreen === "CreateSavingsPrompt" && (
          <CreateSavingsPromptScreen 
            onCreate={() => setCurrentScreen("CreateSavingsBio")}
            onStart={() => setCurrentScreen("CreateSavingsBio")}
            onSkip={() => goHome()}
          />
        )}

        {currentScreen === "CreateSavingsBio" && (
          <CreateSavingsFormBioScreen onNext={() => setCurrentScreen("CreateSavingsDetails")} />
        )}

        {currentScreen === "CreateSavingsDetails" && (
          <CreateSavingsFormSavingsScreen 
            onSubmit={(formData) => {
              setSavingsPlanData(formData);
              // schedule reminder if user asked for it
              try { scheduleSavingsReminder(formData); } catch (e) {}
              setOpenedFrom("CreateSavingsDetails");
              setCurrentScreen("Deposit");
            }} 
          />
        )}

        {/* ===== RECOVERY SCREENS ===== */}
        {currentScreen === "ForgotPassword" && (
          <ForgotPasswordScreen
            darkMode={darkMode}
            user={user}
            onBack={() => {
              setOpenedFrom("ForgotPassword");
              setCurrentScreen("SignIn");
            }}
            onVerifyEmail={() => {
              setOpenedFrom("ForgotPassword");
              setCurrentScreen("RecoveryPhraseVerification");
            }}
          />
        )}

        {currentScreen === "RecoveryPhraseVerification" && (
          <RecoveryPhraseVerificationScreen
            darkMode={darkMode}
            recoveryPhrases={user?.recoveryPhrase || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).recoveryPhrase : [])}
            onBack={() => {
              setOpenedFrom("RecoveryPhraseVerification");
              setCurrentScreen("ForgotPassword");
            }}
            onVerified={() => {
              setOpenedFrom("RecoveryPhraseVerification");
              setCurrentScreen("CreateNewPassword");
            }}
          />
        )}

        {currentScreen === "CreateNewPassword" && (
          <CreateNewPasswordScreen
            darkMode={darkMode}
            onBack={() => {
              setOpenedFrom("CreateNewPassword");
              setCurrentScreen("RecoveryPhraseVerification");
            }}
            onPasswordCreated={(newPassword) => {
              try {
                const raw = localStorage.getItem('user');
                const base = user || (raw ? JSON.parse(raw) : {});
                const updatedUser = { ...base, password: newPassword };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                debug.log('🔐 Password updated and saved to localStorage for', updatedUser.email || updatedUser.phone);
              } catch (e) {
                // fallback: set from user state if available
                const updatedUser = { ...(user || {}), password: newPassword };
                setUser(updatedUser);
                try { localStorage.setItem('user', JSON.stringify(updatedUser)); debug.log('🔐 Password updated and saved to localStorage (fallback)'); } catch (err) {}
              }
              setOpenedFrom("CreateNewPassword");
              setCurrentScreen("PasswordResetSuccess");
            }}
          />
        )}

        {currentScreen === "PasswordResetSuccess" && (
          <PasswordResetSuccessScreen
            darkMode={darkMode}
            onContinueToLogin={() => {
              setOpenedFrom("PasswordResetSuccess");
              setCurrentScreen("SignIn");
              setUser(null);
              // Keep user account data in localStorage so they can login with their new password
              // Don't remove it - just clear the in-memory state
            }}
          />
        )}

        {currentScreen === "ResetPassword" && (
          <ResetPasswordScreen
            darkMode={darkMode}
            onBack={() => {
              setOpenedFrom("ResetPassword");
              setCurrentScreen("RecoveryPhraseVerification");
            }}
            onResetComplete={(newPassword) => {
              try {
                const raw = localStorage.getItem('user');
                const base = user || (raw ? JSON.parse(raw) : {});
                const updatedUser = { ...base, password: newPassword };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
              } catch (e) {
                const updatedUser = { ...(user || {}), password: newPassword };
                setUser(updatedUser);
                try { localStorage.setItem('user', JSON.stringify(updatedUser)); } catch (err) {}
              }
              setOpenedFrom("ResetPassword");
              setCurrentScreen("PasswordResetSuccess");
            }}
          />
        )}

        {currentScreen === "SignUp" && (
          <SignUpScreen
            onSignUp={async (u) => {
              // store whichever contact user provided (email or phone)
              const contactValue = u.email || u.phone || '';
              setSignupEmail(contactValue);
              const recoveryPhrase = generateRecoveryPhrase();
              const userObj = {
                fullName: u.fullName,
                email: u.email || null,
                phone: u.phone || null,
                password: u.password,
                savingsPlan: null,
                recoveryPhrase,
              };
              // Clear any seeded/demo data for a fresh account
              localStorage.removeItem("transactions");
              localStorage.removeItem("userPin");
              localStorage.removeItem("lastTransaction");
              localStorage.removeItem("bankCards");
              localStorage.removeItem("bankAccounts");
              // Clear seeded profile image if present
              localStorage.removeItem("profilePicture");
              setTransactions([]);
              setBalance(0);
              setSavingsBalance(0);
              setBankCards([]);
              setBankAccounts([]);
              setProfilePicture(null);

              setUser(userObj);
              const serialized = JSON.stringify(userObj);
              localStorage.setItem("user", serialized);

              // Persist to backend as well (best-effort)
              try {
                await api.register(userObj);
              } catch (e) {
                // ignore - backend may be down during local dev
              }

              setOpenedFrom("SignUp");
              setCurrentScreen("OTPVerification");
            }}
            onNavigateToSignIn={() => {
              setOpenedFrom("SignUp");
              setCurrentScreen("SignIn");
            }}
          />
        )}

            {activeTab === "profile" && !profileSection && !showSavedCards && !showSavedAccounts && !showCardDetails && (
              <ProfileScreen
                user={user}
                darkMode={darkMode}
                onLogout={handleLogout}
                openScreen={openScreen}
                profilePicture={profilePicture}
                onProfilePictureChange={setProfilePicture}
              />
            )}

            {activeTab === "profile" && profileSection === "notifications" && (
              <NotificationsScreen darkMode={darkMode} onBack={() => setProfileSection(null)} />
            )}

            {activeTab === "profile" && profileSection === "security" && !showPrivacyPolicy && dangerZoneAction === null && (
              <SecurityPrivacyScreen
                darkMode={darkMode}
                onBack={() => setProfileSection(null)}
                onViewPrivacyPolicy={() => setShowPrivacyPolicy(true)}
                onResetPin={() => setDangerZoneAction("resetPin")}
                onCloseAccount={() => setDangerZoneAction("closeAccount")}
              />
            )}

            {activeTab === "profile" && profileSection === "security" && showPrivacyPolicy && (
              <PrivacyPolicyScreen darkMode={darkMode} onBack={() => setShowPrivacyPolicy(false)} />
            )}

            {activeTab === "profile" && profileSection === "security" && dangerZoneAction === "resetPin" && (
              <ResetPINScreen
                darkMode={darkMode}
                user={user}
                onBack={() => setDangerZoneAction(null)}
                onResetPin={(newPin) => {
                  // Save PIN to localStorage
                  localStorage.setItem("userPin", newPin);
                  // Also save to user object for consistency
                  const updatedUser = { ...user, transactionPin: newPin };
                  setUser(updatedUser);
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                  setDangerZoneAction(null);
                }}
              />
            )}

            {activeTab === "profile" && profileSection === "security" && dangerZoneAction === "closeAccount" && (
              <CloseAccountScreen
                darkMode={darkMode}
                onBack={() => setDangerZoneAction(null)}
                onCloseAccount={() => {
                  // Logout - keep all user data in localStorage
                  setUser(null);
                  setCurrentScreen("SignIn");
                  setProfileSection(null);
                  setDangerZoneAction(null);
                  setActiveTab("home");
                }}
              />
            )}

            {activeTab === "profile" && profileSection === "personal" && (
              <PersonalInformationScreen
                darkMode={darkMode}
                user={user}
                onUserChange={setUser}
                onBack={() => setProfileSection(null)}
              />
            )}

            {activeTab === "profile" && showSavedCards && (
              <SavedCardsScreen
                darkMode={darkMode}
                cards={bankCards}
                onBack={() => setShowSavedCards(false)}
                onAddCard={() => {
                  setReturnToProfileSubScreen("SavedCards");
                  openScreen("AddPaymentSource");
                }}
                onDeleteCard={(cardIdx) => {
                  setBankCards(prev => prev.filter((_, idx) => idx !== cardIdx));
                }}
              />
            )}

            {activeTab === "profile" && showSavedAccounts && (
              <SavedAccountsScreen
                darkMode={darkMode}
                accounts={bankAccounts}
                onBack={() => setShowSavedAccounts(false)}
                onAddAccount={() => {
                  setReturnToProfileSubScreen("SavedAccounts");
                  openScreen("AddBankAccount");
                }}
                onDeleteAccount={(accountIdx) => {
                  setBankAccounts(prev => prev.filter((_, idx) => idx !== accountIdx));
                }}
              />
            )}

        {activeTab !== "profile" && (
          <>
            <HomeScreen
              user={user}
              balance={balance}
              savingsBalance={savingsBalance}
              darkMode={darkMode}
              openScreen={openScreen}
            />

            <BottomNav
              active={activeTab}
              setActive={(tab) => {
                setActiveTab(tab);
                setCurrentScreen("Main");
                setProfileSection(null);
                setShowSavedCards(false);
                setShowSavedAccounts(false);
              }}
              darkMode={darkMode}
            />
          </>
        )}

        {/* ===== TRANSACTION SCREENS ===== */}
        {currentScreen === "Deposit" && (
          <DepositScreen
            onBack={handleBack}
            darkMode={darkMode}
            mode={depositMode}
            user={user}
            bankCards={bankCards}
            savingsPlanData={savingsPlanData}
            onConfirm={(data) => {
              setPendingPayment({ ...data, type: depositMode === "start" ? "save" : "topup" });
              setOpenedFrom("Deposit");
              setPendingAction(() => () => setCurrentScreen("PaymentProcessing"));
              setCurrentScreen("ConfirmPayment");
            }}
            openScreen={(screen) => {
              if (screen === "AddPaymentSource") {
                setOpenedFrom("Deposit");
                setCurrentScreen("AddPaymentSource");
              } else {
                openScreen(screen, null, "Deposit");
              }
            }}
          />
        )}

        {currentScreen === "Withdraw" && (
          <WithdrawScreen
            onBack={handleBack}
            darkMode={darkMode}
            user={user}
            balance={balance}
            bankAccounts={bankAccounts}
            openScreen={(screen) => {
              if (screen === "SavedAccounts") {
                setActiveTab("profile");
                setShowSavedAccounts(true);
              } else {
                openScreen(screen, null, "Withdraw");
              }
            }}
            onConfirm={(data) => {
              const payload = {
                ...data,
                type: "withdraw",
                source: "Savings Vault",
                destination: (typeof data.selectedAccount === 'object' && data.selectedAccount?.bankName) 
                  ? `${data.selectedAccount.bankName} ...${data.selectedAccount.accountNumber?.slice(-4) || 'xxxx'}`
                  : data.destinationBank || "Bank Account",
                paymentMethod: data.paymentMethod || "bank",
              };
              setPendingPayment(payload);
              setOpenedFrom("Withdraw");
              setPendingAction(() => () => setCurrentScreen("PaymentProcessing"));
              setCurrentScreen("ConfirmPayment");
            }}
          />
        )}

        {currentScreen === "ConfirmPayment" && pendingPayment && (
          <ConfirmPaymentScreen
            {...pendingPayment}
            onBack={handleBack}
            darkMode={darkMode}
            onConfirm={() => {
              setRequirePin(true);
              setCurrentScreen("Pin");
            }}
          />
        )}

        {requirePin && currentScreen === "Pin" && (
          <PinScreen
            darkMode={darkMode}
            onBack={handleBack}
            onSuccess={handlePinSuccess}
            onForgotPin={() => {
              setOpenedFrom("Pin");
              setCurrentScreen("ForgotTransactionPin");
            }}
          />
        )}

        {showBankTransferInstructions && pendingPayment && (
          <BankTransferInstructionsScreen
            darkMode={darkMode}
            user={user}
            amount={pendingPayment.amount}
            onBack={() => {
              setShowBankTransferInstructions(false);
              goHome();
            }}
            onTransferConfirmed={() => {
              setShowBankTransferInstructions(false);
              setCurrentScreen("PaymentProcessing");
            }}
          />
        )}

        {showCardPaymentOTP && pendingPayment && pendingPayment.selectedCard && (
          <CardPaymentOTPScreen
            darkMode={darkMode}
            cardLast4={pendingPayment.selectedCard.cardNumber?.slice(-4) || "0000"}
            amount={pendingPayment.amount}
            onBack={() => {
              setShowCardPaymentOTP(false);
              setCurrentScreen("ConfirmPayment");
            }}
            onVerify={(otp) => {
              setShowCardPaymentOTP(false);
              setShowCardPaymentProcessing(true);
            }}
          />
        )}

        {showCardPaymentProcessing && pendingPayment && pendingPayment.selectedCard && (
          <CardPaymentProcessingScreen
            darkMode={darkMode}
            card={pendingPayment.selectedCard}
            user={user}
            amount={pendingPayment.amount}
            onBack={() => {
              setShowCardPaymentProcessing(false);
              goHome();
            }}
            onPaymentComplete={() => {
              setShowCardPaymentProcessing(false);
              setCurrentScreen("PaymentProcessing");
            }}
          />
        )}

        {currentScreen === "PaymentProcessing" && pendingPayment && (
          <PaymentProcessingScreen
            darkMode={darkMode}
            message={
              pendingPayment.type === "withdraw"
                ? "Processing your withdrawal..."
                : pendingPayment.type === "deposit"
                ? "Processing your deposit..."
                : pendingPayment.type === "save" || pendingPayment.type === "topup"
                ? "Setting up your savings..."
                : "Securing your transaction..."
            }
            onComplete={() => processTransaction(pendingPayment)}
          />
        )}

        {currentScreen === "TransactionResult" && transactionResult && (
          <TransactionResultScreen
            status="success"
            darkMode={darkMode}
            amount={transactionResult.amount}
            type={transactionResult.type}
            onDone={goHome}
          />
        )}

        {currentScreen === "TransactionReceipt" && selectedTransaction && (
          <TransactionReceiptScreen
            transaction={selectedTransaction}
            darkMode={darkMode}
            onBack={handleBack}
            onDone={handleBack}
            onShare={(tx) => {
              const url = window.location.origin + "/receipt.html?data=" + encodeURIComponent(JSON.stringify(tx));
              window.open(url, "_blank");
            }}
            onDownload={(tx) => {
              const url = window.location.origin + "/receipt.html?data=" + encodeURIComponent(JSON.stringify(tx));
              window.open(url, "_blank");
            }}
          />
        )}

        {currentScreen === "TransactionHistory" && (
          <TransactionsHistoryScreen
            transactions={transactions}
            darkMode={darkMode}
            openScreen={openScreen}
            onSelectTransaction={(tx) => {
              setSelectedTransaction(tx);
              setOpenedFrom("TransactionHistory");
              setCurrentScreen("TransactionReceipt");
            }}
            onBack={handleBack}
            onDownloadStatement={() => {
              setOpenedFrom("TransactionHistory");
              setCurrentScreen("DownloadStatement");
            }}
          />
        )}

        {currentScreen === "DownloadStatement" && (
          <DownloadStatementScreen
            transactions={transactions}
            darkMode={darkMode}
            onBack={handleBack}
            user={user}
          />
        )}

        {currentScreen === "SavingsDetail" && user?.savingsPlan && (
          <SavingsDetailScreen
            savings={{
              total: savingsBalance,
              startDate: user.savingsPlan.startDate,
              withdrawDate: user.savingsPlan.withdrawalDate,
              isMatured: !user.savingsPlan.isActive,
              durationMonths: user.savingsPlan.durationMonths,
              amountPerInterval: user.savingsPlan.amountPerInterval,
              frequency: user.savingsPlan.frequency || null,
            }}
            transactions={transactions}
            darkMode={darkMode}
            onBack={handleBack}
          />
        )}

        {/* ===== PAYMENT SOURCE SCREENS ===== */}
        {currentScreen === "AddPaymentSource" && (
          <>
            {cardLinkingStep === "add" && (
              <AddPaymentSourceScreen
                user={user}
                darkMode={darkMode}
                onBack={() => {
                  // If we came from SavedCards, return there
                  if (returnToProfileSubScreen === "SavedCards") {
                    setCurrentScreen("Main");
                    setShowSavedCards(true);
                    setReturnToProfileSubScreen(null);
                    setOpenedFrom(null);
                  } else {
                    handleBack();
                  }
                }}
                onSave={(card) => {
                  setCardBeingLinked(card);
                  setCardLinkingStep("verify");
                }}
              />
            )}

            {cardLinkingStep === "verify" && cardBeingLinked && (
              <CardVerificationScreen
                card={cardBeingLinked}
                darkMode={darkMode}
                onBack={() => {
                  setCardBeingLinked(null);
                  setCardLinkingStep("add");
                  // returnToProfileSubScreen state is preserved automatically
                }}
                onVerified={(verifiedCard) => {
                  setCardBeingLinked(verifiedCard);
                  setCardLinkingStep("save");
                }}
              />
            )}

            {cardLinkingStep === "save" && cardBeingLinked && (
              <SaveCardDetailsScreen
                card={cardBeingLinked}
                darkMode={darkMode}
                onBack={() => {
                  setCardBeingLinked(null);
                  setCardLinkingStep("add");
                  // If we came from SavedCards, return there
                  if (returnToProfileSubScreen === "SavedCards") {
                    setCurrentScreen("Main");
                    setShowSavedCards(true);
                    setReturnToProfileSubScreen(null);
                    setOpenedFrom(null);
                  } else {
                    goHome();
                  }
                }}
                onConfirm={(savedCard) => {
                  setBankCards((prev) => [...prev, savedCard]);
                  setCardBeingLinked(null);
                  setCardLinkingStep("add");
                  // If we came from SavedCards, return there; otherwise go to Deposit
                  if (returnToProfileSubScreen === "SavedCards") {
                    setShowSavedCards(true);
                    setReturnToProfileSubScreen(null);
                    setCurrentScreen("Main");
                  } else {
                    setCurrentScreen("Deposit");
                  }
                }}
              />
            )}
          </>
        )}

        {/* ===== BANK ACCOUNT SCREENS ===== */}
        {currentScreen === "AddBankAccount" && (
          <AddBankAccountScreen
            darkMode={darkMode}
            onBack={handleBack}
            onAddAccount={(accountData) => {
              setNewBankAccountData(accountData);
              setBankAccounts((prev) => [...prev, { id: Date.now().toString(), ...accountData }]);
              setOpenedFrom("AddBankAccount");
              setCurrentScreen("BankAccountSuccess");
            }}
          />
        )}

        {currentScreen === "BankAccountSuccess" && newBankAccountData && (
          <BankAccountSuccessScreen
            darkMode={darkMode}
            accountData={newBankAccountData}
            onContinue={() => {
              setNewBankAccountData(null);
              setShowSavedAccounts(true);
              setOpenedFrom("BankAccountSuccess");
              setCurrentScreen("Main");
            }}
          />
        )}

        {/* ===== LOCK SAVINGS SCREENS ===== */}
        {currentScreen === "LockSavingsMethod" && (
          <LockSavingsMethodScreen
            darkMode={darkMode}
            onBack={handleBack}
            onSelectMethod={(method) => {
              setLockSavingsMethod(method);
              setLockSavingsStep("payment");
            }}
          />
        )}

        {currentScreen === "LockSavingsPayment" && lockSavingsStep === "payment" && (
          <>
            {lockSavingsMethod === "card" && (
              <CardPaymentMethodScreen
                bankCards={bankCards}
                darkMode={darkMode}
                onBack={() => {
                  setLockSavingsMethod(null);
                  setLockSavingsStep(null);
                  setCurrentScreen("LockSavingsMethod");
                }}
                onSelectCard={(card) => {
                  setPendingPayment({ ...pendingPayment, paymentMethod: 'card', selectedCard: card });
                  setCurrentScreen("ConfirmPayment");
                }}
                onAddCard={() => {
                  setCurrentScreen("AddPaymentSource");
                }}
              />
            )}

            {lockSavingsMethod === "bank" && (
              <BankTransferPaymentScreen
                bankAccounts={bankAccounts}
                darkMode={darkMode}
                onBack={() => {
                  setLockSavingsMethod(null);
                  setLockSavingsStep(null);
                  setCurrentScreen("LockSavingsMethod");
                }}
                onSelectAccount={(account) => {
                  setPendingPayment({ ...pendingPayment, paymentMethod: 'bank', selectedAccount: account });
                  setCurrentScreen("ConfirmPayment");
                }}
                onAddAccount={(account) => {
                  setBankAccounts((prev) => [...prev, account]);
                }}
              />
            )}
          </>
        )}

        {/* ===== UNCATEGORIZED SCREENS ===== */}
        {currentScreen === "NestTransactionReceiptPDF" && (
          <NestTransactionReceiptPDF transaction={selectedTransaction} />
        )}
      </div>
    </CurrencyProvider>
  );
}

export default App;
