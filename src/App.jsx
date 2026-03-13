import React, { useEffect, useState, useRef } from "react";
import {
  supabase,
  insertTransaction,
  fetchTransactionsForEmail,
  upsertUserProfile,
  fetchUserProfile,
  fetchBankCards,
  insertBankCard,
  deleteBankCard,
  fetchBankAccounts,
  insertBankAccount,
  deleteBankAccount,
  saveSavings,
  fetchSavings,
  fetchProfileByRecoveryPhrase,
  fetchGoals,
  insertGoal,
  updateGoal,
  deleteGoal
} from "./lib/supabase";
import { generateRecoveryPhrase } from "./helpers/generateRecoveryPhrase";
import { generateReference } from "./helpers/reference";
import { requestNotificationPermission, sendTransactionNotification } from "./lib/deviceNotifications";
import { CurrencyProvider } from "./context/CurrencyContext";
import { SCREENS } from "./constants/screens";

// Onboarding Screens
import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignUpLocationScreen from "./screens/SignUpLocationScreen";
import EmailSentScreen from "./screens/EmailSentScreen";
import VerifyAccountScreen from "./screens/VerifyAccountScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import RecoveryPhraseScreen from "./screens/RecoveryPhraseScreen";
import RegistrationSplashScreen from "./screens/RegistrationSplashScreen";
import CreateTransactionPinScreen from "./screens/CreateTransactionPinScreen";
import CreateSavingsPromptScreen from "./screens/CreateSavingsPromptScreen";
import CreateSavingsFormBioScreen from "./screens/CreateSavingsFormBioScreen";
import CreateSavingsFormSavingsScreen from "./screens/CreateSavingsFormSavingsScreen";
import SavingsProcessingScreen from "./screens/SavingsProcessingScreen";
import AccountCreationProcessingScreen from "./screens/AccountCreationProcessingScreen";
import AccountCreatedSuccessScreen from "./screens/AccountCreatedSuccessScreen";
import AppLaunchPinScreen from "./screens/AppLaunchPinScreen";
import ForgotAppLaunchPinScreen from "./screens/ForgotAppLaunchPinScreen";

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
import BankAccountVerificationScreen from "./screens/BankAccountVerificationScreen";


// Success Screens
import LinkCardSuccessScreen from "./screens/LinkCardSuccessScreen";

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
import OTPInputScreen from "./screens/OTPInputScreen";
import { generateOTP, storeOTP, notifyOTP } from './lib/otpGenerator';
import { onAppAlert } from './lib/appAlert';
import AppAlert from './components/AppAlert';


function App() {
  // small helper to safely parse JSON that may be corrupted
  // log explicit version stamp so installed PWA can be verified in console
  console.log('🎯 App component mounted');
  React.useEffect(() => {
    console.log('🏷️ App startup - build date: 2026-03-06');
  }, []);
  const safeParse = (raw, fallback = null) => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('safeParse failed', e, raw);
      return fallback;
    }
  };

  // ===== Core Navigation State =====
  const [currentScreen, setCurrentScreen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const flow = params.get('flow');

    // When returning from email verification, ensure user data is loaded first
    if (flow === 'signup-verify' || flow === 'password-reset-verify') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          console.log('✅ Restoring user data after email verification:', parsed.fullName, parsed.email);
        } catch (e) {
          console.error('Failed to parse saved user:', e);
        }
      }
      return flow === 'signup-verify' ? SCREENS.RecoveryPhrase : SCREENS.RecoveryPhraseVerification;
    }

    // Attempt to restore a saved onboarding screen only if there's NO logged-in user
    const savedScreen = localStorage.getItem('currentSignupScreen');
    const validSignupScreens = [
      SCREENS.SignUp,
      SCREENS.OTPVerification,
      SCREENS.CreateSavingsBio,
      SCREENS.CreateSavingsDetails,
      SCREENS.SavingsProcessing,
      SCREENS.RecoveryPhrase,
      SCREENS.AccountCreationProcessing,
      SCREENS.AccountCreatedSuccess
    ];

    // check for a saved user object too
    let initialUser = null;
    try {
      const raw = localStorage.getItem('user');
      if (raw) initialUser = JSON.parse(raw);
    } catch (e) {
      console.warn('Error parsing initial user during screen init', e);
    }

    if (savedScreen && validSignupScreens.includes(savedScreen)) {
      if (!initialUser) {
        console.log('📱 Restoring signup flow screen for new visitor:', savedScreen);
        return savedScreen;
      } else {
        console.log('⚠️ Ignoring saved signup screen because user already exists:', savedScreen);
        localStorage.removeItem('currentSignupScreen');
      }
    }

    return SCREENS.Splash;
  });
    const [activeTab, setActiveTab] = useState("home");

  // ===== User & Authentication =====
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    const parsed = safeParse(saved, null);
    if (parsed) {
      console.log("📱 App init: Found saved user account with", parsed.email ? "email" : "phone", parsed.email || parsed.phone);
    }
    return parsed;
  });

  const [transactions, setTransactions] = useState(() => safeParse(localStorage.getItem("transactions"), []));
  const [savingsBalance, setSavingsBalance] = useState(() => { const num = parseFloat(localStorage.getItem("savingsBalance")); return !isNaN(num) ? num : 0; });
  const [goals, setGoals] = useState(() => safeParse(localStorage.getItem("goals"), []));
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [appAlert, setAppAlert] = useState(null);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [requirePin, setRequirePin] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [depositMode, setDepositMode] = useState("start");
  const [bankCards, setBankCards] = useState(() => safeParse(localStorage.getItem("bankCards"), []));
  const [cardBeingLinked, setCardBeingLinked] = useState(null);
  const [cardLinkingStep, setCardLinkingStep] = useState("add");
  const [bankAccounts, setBankAccounts] = useState(() => safeParse(localStorage.getItem("bankAccounts"), []));
  const [swRegistration, setSwRegistration] = useState(null);
  const reminderTimerRef = useRef(null);
  const [savingsPlanData, setSavingsPlanData] = useState(null);
  const [savingsFlowScreen, setSavingsFlowScreen] = useState(() => localStorage.getItem("savingsFlowScreen") || null);
  const hasActiveSavings = Boolean(user?.savingsPlan && user.savingsPlan.isActive);
  const [lockSavingsStep, setLockSavingsStep] = useState(null);
  const [lockSavingsMethod, setLockSavingsMethod] = useState(null);
  const [selectedCardForPayment, setSelectedCardForPayment] = useState(null);
  const [profileSection, setProfileSection] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const [newBankAccountData, setNewBankAccountData] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem("profilePicture") || null);
  const [dangerZoneAction, setDangerZoneAction] = useState(null);
  const [openedFrom, setOpenedFrom] = useState(null);
  const [returnToProfileSubScreen, setReturnToProfileSubScreen] = useState(null);
  const [bankTransferStep, setBankTransferStep] = useState(null);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPart, setSignupPart] = useState(1); // 1 = details form, 2 = location form
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpContext, setOtpContext] = useState(null);
  // we no longer hold pendingPin since PIN creation is immediate
  const [pendingAddCard, setPendingAddCard] = useState(null);
  const [pendingBankAccount, setPendingBankAccount] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showForgotAppLaunchPin, setShowForgotAppLaunchPin] = useState(false);
  const [showResetAppLaunchPin, setShowResetAppLaunchPin] = useState(false);

  // hydrate data from Supabase when a user signs in
  const hydrateFromServer = async (u) => {
    if (!u || !u.email) return;
    try {
      const email = u.email;
      // profile
      const { data: profileData } = await fetchUserProfile(email);
      if (profileData) {
        setUser(prev => ({ ...prev, ...profileData }));
      }
      // transactions
      const { data: txs } = await fetchTransactionsForEmail(email);
      if (Array.isArray(txs)) {
        setTransactions(txs);
      }
      // bank cards
      const { data: cards } = await fetchBankCards(email);
      if (Array.isArray(cards)) {
        setBankCards(cards);
      }
      // bank accounts
      const { data: accounts } = await fetchBankAccounts(email);
      if (Array.isArray(accounts)) {
        setBankAccounts(accounts);
      }
      // savings
      const { data: savings } = await fetchSavings(email);
      if (savings && typeof savings.balance === 'number') {
        // if profile came with nonzero balance but there are no transactions yet,
        // it may be seeded/demo data (like 310000) - reset to zero for safety
        if ((!txs || txs.length === 0) && savings.balance > 0) {
          console.warn('hydrateFromServer: suspicious initial balance, resetting to 0');
          setSavingsBalance(0);
          saveSavings(email, 0).catch(() => {});
        } else {
          setSavingsBalance(savings.balance);
        }
      }
      // goals - fetch if we have user_id from auth
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser && authUser.id) {
          const { data: goalsData } = await fetchGoals(authUser.id);
          if (Array.isArray(goalsData)) {
            console.log('✅ Goals fetched from Supabase:', goalsData.length, 'goals');
            setGoals(goalsData);
          }
        }
      } catch (e) {
        console.warn('Failed to fetch goals:', e.message);
      }
    } catch (e) {
      console.error('Hydration error', e);
      // fall back to zero so UI doesn't show stale/demo balance
      setSavingsBalance(0);
    }
  };

  // Persist user object to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.warn('Unable to persist user to localStorage', e);
      }
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Sync user profile (and savings) with Supabase
  useEffect(() => {
    if (user?.email) {
      const profile = {
        email: user.email,
        fullName: user.fullName || '',
        recoveryPhrase: user.recoveryPhrase || null,
      };
      upsertUserProfile(profile).catch(() => {});
      if (typeof savingsBalance === 'number') {
        saveSavings(user.email, savingsBalance).catch(() => {});
      }
    }
  }, [user, savingsBalance]);

  // ===== Persistence =====
  useEffect(() => {
    // REQUEST NOTIFICATION PERMISSION immediately on app load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('✅ Notification permission granted');
          // Also request our device notification system to be ready
          requestNotificationPermission().catch(() => {});
        } else {
          console.log('⚠️ Notification permission denied');
        }
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      // Already granted, ensure our system is ready
      requestNotificationPermission().catch(() => {});
    }

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
      const parsed = JSON.parse(u);
      setUser(parsed);
    }
    const savingsFlowScreenSaved = localStorage.getItem("savingsFlowScreen");
    const savingsPlanDataSaved = localStorage.getItem("savingsPlanData");
    if (savingsFlowScreenSaved) setSavingsFlowScreen(savingsFlowScreenSaved);
    if (savingsPlanDataSaved) setSavingsPlanData(JSON.parse(savingsPlanDataSaved));
  }, []);

  // PWA Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log('PWA install prompt available');
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      console.log('PWA installed successfully');
    };

    // Check if already installed (iOS or Android)
    if (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        console.log("User logged in:", session.user);
        // Try to use a richer local profile from localStorage if it exists and matches
        try {
          const raw = localStorage.getItem('user');
          const localProfile = raw ? JSON.parse(raw) : null;
          const email = session.user.email;
          if (localProfile && localProfile.email && localProfile.email.toLowerCase() === (email || '').toLowerCase()) {
            setUser(localProfile);
          } else {
            // Minimal profile constructed from Supabase session
            setUser({
              fullName: session.user.user_metadata?.full_name || '',
              email: session.user.email || null,
              phone: session.user.phone || null,
            });
          }
        } catch (e) {
          setUser({
            fullName: session.user.user_metadata?.full_name || '',
            email: session.user.email || null,
            phone: session.user.phone || null,
          });
        }
      } else {
        console.log("Auth state changed: session is null");
        // IMPORTANT: During signup flow, we have local signup data that should NOT be cleared.
        // Check if we're in the middle of signup or email verification; if so, preserve local state.
        const signupPending = localStorage.getItem('signupPending');
        const currentUser = localStorage.getItem('user');
        
        // Only clear user state if we're NOT in a signup/verification flow with pending data
        if (!signupPending && !currentUser) {
          console.log("No signup data found, clearing user state");
          setUser(null);
        } else if (currentUser) {
          // Keep the local user data intact (from signup form or previous session)
          console.log("Preserving local user data during signup flow");
          try {
            setUser(JSON.parse(currentUser));
          } catch (e) {
            console.error("Failed to restore user from localStorage:", e);
          }
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Handle deep-links for email confirmation flows (signup, password reset)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flow = params.get('flow');

    if (flow === 'signup-verify') {
      // Email confirmed for signup - refresh session and continue account creation
      const pending = localStorage.getItem('signupPending');
      if (pending) {
        (async () => {
          try {
            // Refresh session from Supabase to ensure email_confirmed is true
            const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error('Error refreshing session:', refreshError);
            }
            
            const parsed = JSON.parse(pending);
            const { fullName, email, recoveryPhrase } = parsed;
            const userObj = {
              fullName,
              email,
              password: null,
              savingsPlan: null,
              recoveryPhrase,
            };
            setUser(userObj);

            // Fetch full profile from Supabase now that email is verified
            try {
              await hydrateFromServer(userObj);
            } catch (e) {
              console.error('Failed to hydrate user data after signup verification:', e);
            }
            
            // Route to recovery phrase (continue after email verification)
            setCurrentScreen('RecoveryPhrase');
          } catch (e) {
            console.error('Error handling signup verification:', e);
          }
        })();
      }
    } else if (flow === 'password-reset-verify') {
      // Email confirmed for password reset - continue password recovery
      // route to recovery phrase verification first
      setOpenedFrom('ForgotPassword');
      setCurrentScreen('RecoveryPhraseVerification');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Log on user login/logout
    if (user) {
      console.log("👤 User authenticated:", user.email || user.phone);
    } else {
      console.log("👤 User logged out or not authenticated");
    }
  }, [user]);

  // Expose a test function to window for debugging
  React.useEffect(() => {
    window.debugLocalStorage = () => {
      console.log("🔍 === LOCALSTORAGE DEBUG ===");
      const user = localStorage.getItem("user");
      console.log("user:", user ? JSON.parse(user) : null);
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (key !== "user") {
          console.log(`${key}:`, value?.substring(0, 100) + (value?.length > 100 ? "..." : ""));
        }
      }
      console.log("🔍 === END DEBUG ===");
    };
    console.log("💡 Tip: Run window.debugLocalStorage() in console to see all localStorage data");
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
      // If payment requires a card and none selected -> add card
      if (pendingPayment.paymentMethod === 'card' && !pendingPayment.selectedCard) {
        setOpenedFrom('ConfirmPayment');
        setCurrentScreen('AddPaymentSource');
      // Only require adding a bank account when the action is a withdrawal
      // Deposits via Bank Transfer should NOT force the user to add a personal bank
      // account because deposits go to the Nest account (displayed in the bank transfer flow).
      } else if (
        pendingPayment.paymentMethod === 'bank' &&
        pendingPayment.type === 'withdraw' &&
        !pendingPayment.selectedAccount
      ) {
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
    localStorage.setItem("savingsBalance", String(savingsBalance));
    localStorage.setItem("goals", JSON.stringify(goals));
    if (savingsFlowScreen) localStorage.setItem("savingsFlowScreen", savingsFlowScreen);
    if (savingsPlanData) localStorage.setItem("savingsPlanData", JSON.stringify(savingsPlanData));
    if (profilePicture) localStorage.setItem("profilePicture", profilePicture);
    
    // Persist current screen during signup/onboarding flow so app can resume if closed
    const isSignupFlow = ['SignUp', 'OTPVerification', 'CreateSavingsBio', 'CreateSavingsDetails', 'SavingsProcessing', 'RecoveryPhrase'].includes(currentScreen);
    if (isSignupFlow) {
      localStorage.setItem('currentSignupScreen', currentScreen);
      console.log('💾 Saved signup screen:', currentScreen);
    } else {
      // Clear signup screen once flow is complete
      localStorage.removeItem('currentSignupScreen');
    }
  }, [user, transactions, bankCards, bankAccounts, profilePicture, savingsBalance, savingsFlowScreen, savingsPlanData, goals, currentScreen]);

  // push/replace history entries so back button works across most screens
  useEffect(() => {
    const isHistoryable = (screen) => {
      // exclude splash screens and the few temporary loading/processing screens
      return ![SCREENS.Splash, SCREENS.RegistrationSplash, SCREENS.SavingsProcessing, SCREENS.PaymentProcessing].includes(screen);
    };
    if (isHistoryable(currentScreen)) {
      window.history.pushState({ screen: currentScreen }, '');
    }
  }, [currentScreen]);

  useEffect(() => {
    const onPop = (e) => {
      const state = e.state;
      if (state && state.screen) {
        setCurrentScreen(state.screen);
      }
    };
    window.history.replaceState({ screen: currentScreen }, '');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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
    setPendingPayment(null);
    setOpenedFrom(null);
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    try {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        setIsInstalled(true);
      }
    } catch (e) {
      console.error('Error triggering install prompt:', e);
    }
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

  // Device Back Button Handler - prevent app from closing
  useEffect(() => {
    // Push initial history state to capture back button
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      // When device back button is pressed, use app's back handler
      handleBack();
      // Push state again to stay in the app
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleBack, openedFrom, returnToProfileSubScreen]);

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
    // Logout the Supabase session and clear in-memory user state
    try {
      supabase.auth.signOut().catch(() => {});
    } catch (e) {}
    setUser(null);
    setCurrentScreen("SignIn");
    // clear any stored application data for a fresh login
    localStorage.removeItem("transactions");
    localStorage.removeItem("savingsBalance");
    localStorage.removeItem("bankCards");
    localStorage.removeItem("bankAccounts");
    localStorage.removeItem("profilePicture");
    setTransactions([]);
    setSavingsBalance(0);
    setBankCards([]);
    setBankAccounts([]);
    setProfilePicture(null);
  };

  // ===== Transaction Helpers =====
  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const handlePinSuccess = () => {
    setRequirePin(false);

    if (pendingPayment) {
      const { type, paymentMethod } = pendingPayment;

      // -- card payments --
      // only require an OTP if the card is being used to deposit/save/topup
      if (paymentMethod === 'card' && (type === 'save' || type === 'topup' || type === 'deposit')) {
        setPendingAction(null);
        setCurrentScreen('CardPaymentOTP');
        return;
      }

      // -- bank payments --
      if (paymentMethod === 'bank') {
        // withdrawals can be processed immediately
        if (type === 'withdraw') {
          setPendingAction(null);
          setCurrentScreen('PaymentProcessing');
          return;
        }
        // deposits / saves / topups should show instructions first
        if (type === 'save' || type === 'topup' || type === 'deposit') {
          setPendingAction(null);
          setCurrentScreen('BankTransferInstructions');
          return;
        }
      }

      // fallback: any other action that looks like a transaction
      if (type === "withdraw" || type === "save" || type === "topup" || type === "deposit") {
        setPendingAction(null);
        setCurrentScreen("PaymentProcessing");
      } else if (paymentMethod === 'bank') {
        setPendingAction(null);
        setCurrentScreen('BankTransferInstructions');
      } else if (paymentMethod === 'card') {
        setPendingAction(null);
        setCurrentScreen('CardPaymentOTP');
      }
    } else if (typeof pendingAction === "function") {
      pendingAction();
    }

    setPendingAction(null);
  };

  const processTransaction = async (pendingPayment) => {
    console.log('🔁 processTransaction called with', pendingPayment);
    if (!pendingPayment) {
      console.warn('processTransaction called without pendingPayment, returning to home');
      goHome();
      return;
    }
    const amount = Number(pendingPayment.amount);
    let txType = pendingPayment.type;
    // single source of truth: savingsBalance represents the app balance
    let newSavingsBalance = savingsBalance;
    let newBalance = savingsBalance;

    if (txType === "save") {
      if (user?.savingsPlan && user.savingsPlan.isActive) {
        txType = "topup";
      }
    }

    if (txType === "save") {
      newSavingsBalance = savingsBalance + amount;
      newBalance = newSavingsBalance;
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
            goal: pendingPayment.goal || null,
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
      newSavingsBalance = savingsBalance + amount;
      newBalance = newSavingsBalance;
    } else if (txType === "withdraw") {
      newBalance = Math.max(0, savingsBalance - amount);
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
      // deposits into the app are treated as savings (app = savings vault)
      newSavingsBalance = savingsBalance + amount;
      newBalance = newSavingsBalance;
    }

    // Only enforce insufficient-funds for withdrawals (you withdraw from the app's savings)
    if (txType === "withdraw") {
      if (amount > savingsBalance) {
        showAlert({ type: 'error', title: 'Insufficient funds', message: 'You do not have enough savings to complete this withdrawal.' });
        setPendingPayment(null);
        setCurrentScreen("TransactionResult");
        return;
      }
    }
    
    console.log('💾 Updating local state: balance', newSavingsBalance);
    setSavingsBalance(newSavingsBalance);
    
    // persist savings balance in background (don't await)
    if (user?.email) {
      console.log('📤 Sending saveSavings async (background)');
      saveSavings(user.email, newSavingsBalance).catch(e => {
        console.error('⚠️ saveSavings failed:', e);
      });
    }

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
      balanceAfter: newSavingsBalance,
    };

    console.log('📝 Adding transaction to local history');
    addTransaction(tx);
    setTransactionResult(tx);
    setPendingPayment(null);
    
    // Sync to Supabase in background (don't await, don't block UI)
    console.log('📤 Syncing transaction to Supabase (background)...');
    (async () => {
      try {
        const insertPayload = {
          reference: tx.reference,
          type: tx.type,
          amount: tx.amount,
          date: tx.date,
          status: tx.status,
          payment_method: tx.paymentMethod,
          payment_source: tx.paymentSource,
          payment_destination: tx.paymentDestination,
          balance_after: tx.balanceAfter,
          user_email: user?.email || null,
          user_phone: user?.phone || null,
        };
        const { data: inserted, error: insertError } = await insertTransaction(insertPayload);
        if (insertError) {
          console.warn('⚠️ Transaction sync failed:', insertError.message);
        } else {
          console.log('✅ Transaction synced to Supabase');
          if (inserted && inserted[0]) tx.id = inserted[0].id || tx.id;
        }
      } catch (e) {
        console.warn('⚠️ Transaction sync exception:', e.message);
      }
    })();
    
    // Send device notification for transaction
    sendTransactionNotification(tx.type, tx.amount, tx.status).catch(e => {
      console.warn('⚠️ Failed to send transaction notification:', e);
    });
    
    console.log('✔️ Transaction processed successfully, switching to TransactionResult screen');
    setCurrentScreen("TransactionResult");
  };

  // Subscribe to external alert events
  useEffect(() => {
    const unsub = onAppAlert((payload) => {
      setAppAlert(payload);
    });
    return () => unsub();
  }, []);

  const showAlert = (payload) => {
    setAppAlert({ timeout: 3500, ...payload });
  };

  // ===== Main Render =====
  return (
    <CurrencyProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* ===== ONBOARDING SCREENS ===== */}
        {currentScreen === SCREENS.Splash && (
          <SplashScreen
            onFinish={() => {
              // Check if app launch PIN is set and needs verification
              const hasPinSet = Boolean(localStorage.getItem('appLaunchPin'));
              const alreadyVerified = sessionStorage.getItem('appLaunchPinVerified');
              
              if (hasPinSet && alreadyVerified !== 'true') {
                setCurrentScreen("AppLaunchPin");
              } else {
                // If no PIN or already verified, go to normal flow
                setCurrentScreen(user ? "Main" : "SignIn");
              }
            }}
            installPrompt={installPrompt}
            handleInstallApp={handleInstallApp}
            isInstalled={isInstalled}
          />
        )}

        {currentScreen === SCREENS.AppLaunchPin && showForgotAppLaunchPin && (
          <ForgotAppLaunchPinScreen
            onBack={() => setShowForgotAppLaunchPin(false)}
            onProceedToReset={() => {
              setShowForgotAppLaunchPin(false);
              setShowResetAppLaunchPin(true);
            }}
          />
        )}

        {currentScreen === SCREENS.AppLaunchPin && showResetAppLaunchPin && (
          <AppLaunchPinScreen
            forceResetMode={true}
            onPinVerified={() => {
              sessionStorage.setItem('appLaunchPinVerified', 'true');
              setShowResetAppLaunchPin(false);
              setShowForgotAppLaunchPin(false);
              setCurrentScreen(user ? "Main" : "SignIn");
            }}
            onSetupPin={() => {
              sessionStorage.setItem('appLaunchPinVerified', 'true');
              setShowResetAppLaunchPin(false);
              setShowForgotAppLaunchPin(false);
              setCurrentScreen(user ? "Main" : "SignIn");
            }}
            onForgotPin={() => {
              setShowResetAppLaunchPin(false);
              setShowForgotAppLaunchPin(true);
            }}
          />
        )}

        {currentScreen === SCREENS.AppLaunchPin && !showForgotAppLaunchPin && !showResetAppLaunchPin && (
          <AppLaunchPinScreen
            onPinVerified={() => {
              sessionStorage.setItem('appLaunchPinVerified', 'true');
              setCurrentScreen(user ? "Main" : "SignIn");
            }}
            onSetupPin={() => {
              sessionStorage.setItem('appLaunchPinVerified', 'true');
              setCurrentScreen(user ? "Main" : "SignIn");
            }}
            onForgotPin={() => {
              setShowForgotAppLaunchPin(true);
            }}
          />
        )}

        {/* Fallback screen if no screen matches */}

        {/* Ensure we only show one screen at a time */}
        {currentScreen === "SignIn" && (
          <SignInScreen
            onSignIn={async (u) => {
              setUser(u);
              await hydrateFromServer(u);
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

        {currentScreen === "SignUp" && signupPart === 1 && (
          <SignUpScreen
            onProceedToLocation={() => {
              // Move to part 2 of signup (location details)
              setSignupPart(2);
            }}
            onSignUp={async (u) => {
              // This is the old flow - now we don't use this directly
              // Instead we use onProceedToLocation
            }}
            onNavigateToSignIn={() => {
              setOpenedFrom("SignUp");
              setSignupPart(1);
              setCurrentScreen("SignIn");
            }}
          />
        )}

        {currentScreen === "SignUp" && signupPart === 2 && (
          <SignUpLocationScreen
            onBack={() => {
              // Go back to part 1
              setSignupPart(1);
            }}
            onSubmit={async (locationData) => {
              // Get the pending signup data from localStorage
              const signupPendingRaw = localStorage.getItem('signupPending');
              if (!signupPendingRaw) {
                const { showAppAlert } = await import('./lib/appAlert');
                showAppAlert({
                  type: 'error',
                  message: 'Signup data lost. Please start again.'
                });
                setSignupPart(1);
                return;
              }

              const signupData = JSON.parse(signupPendingRaw);
              
              // Combine signup data with location data
              const { country, state, address } = locationData;

              // Store location data persistently 
              localStorage.setItem('signupLocationData', JSON.stringify({
                country,
                state,
                address
              }));

              // Now complete the full signup process
              const email = signupData.email;
              const fullName = signupData.fullName;
              
              // record signup email for later steps
              setSignupEmail(email);
              setOtpContext('signup');

              // ensure recovery phrase is unique across existing profiles
              let recoveryPhrase;
              for (let attempts = 0; attempts < 5; attempts++) {
                recoveryPhrase = await generateRecoveryPhrase();
                try {
                  const { data: existing } = await fetchProfileByRecoveryPhrase(recoveryPhrase);
                  if (!existing || existing.length === 0) break;
                } catch (e) {
                  break;
                }
              }

              const userObj = {
                fullName: fullName,
                email: email || null,
                phone: signupData.phone || null,
                country: country,
                state: state,
                address: address,
                password: signupData.password,
                savingsPlan: null,
                recoveryPhrase,
              };

              // Update signup pending with full data including location
              localStorage.setItem('signupPending', JSON.stringify({
                fullName,
                email,
                recoveryPhrase,
                country,
                state,
                address
              }));

              // Upsert profile to server with location data
              try {
                await upsertUserProfile({ 
                  email,
                  fullName,
                  recoveryPhrase,
                  country,
                  state,
                  address
                });
                await saveSavings(email, 0);
              } catch (e) {
                console.error('Error saving profile:', e);
              }

              // Clear demo data 
              localStorage.removeItem("transactions");
              localStorage.removeItem("userPin");
              localStorage.removeItem("lastTransaction");
              localStorage.removeItem("bankCards");
              localStorage.removeItem("bankAccounts");
              localStorage.removeItem("savingsBalance");
              localStorage.removeItem("profilePicture");
              setTransactions([]);
              setSavingsBalance(0);
              setBankCards([]);
              setBankAccounts([]);
              setProfilePicture(null);

              setUser(userObj);
              const serialized = JSON.stringify(userObj);
              localStorage.setItem("user", serialized);
              
              console.log("✅ SignUp (Part 2): User saved with location data");
              console.log("   Email:", email);
              console.log("   FullName:", fullName);
              console.log("   Country:", country);
              console.log("   State:", state);

              setOpenedFrom("SignUp");
              setSignupPart(1); // Reset for next time

              // After account creation, show processing screen
              setCurrentScreen(SCREENS.AccountCreationProcessing);
            }}
          />
        )}

        {currentScreen === SCREENS.AccountCreationProcessing && (
          <AccountCreationProcessingScreen
            userName={user?.fullName || 'User'}
            onComplete={() => setCurrentScreen(SCREENS.AccountCreatedSuccess)}
          />
        )}

        {currentScreen === SCREENS.AccountCreatedSuccess && (
          <AccountCreatedSuccessScreen
            userName={user?.fullName || 'User'}
            onContinue={() => setCurrentScreen(SCREENS.EmailSent)}
          />
        )}

        {currentScreen === SCREENS.EmailSent && (
          <EmailSentScreen
            onContinue={() => setCurrentScreen(SCREENS.VerifyAccount)}
          />
        )}

        {currentScreen === SCREENS.VerifyAccount && (
          <VerifyAccountScreen
            onVerify={() => setCurrentScreen(SCREENS.VerifyAccountProcessing)}
          />
        )}

        {currentScreen === SCREENS.VerifyAccountProcessing && (
          <PaymentProcessingScreen
            message="Verifying account..."
            onComplete={async () => {
              try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (data?.email_confirmed_at) {
                  setCurrentScreen(SCREENS.RecoveryPhrase);
                } else {
                  const { showAppAlert } = await import('./lib/appAlert');
                  showAppAlert({
                    type: 'error',
                    message: 'Email not confirmed yet, please check your inbox.'
                  });
                  setCurrentScreen(SCREENS.VerifyAccount);
                }
              } catch (e) {
                console.error('verification check failed', e);
                setCurrentScreen(SCREENS.VerifyAccount);
              }
            }}
          />
        )}

        {currentScreen === "OTPVerification" && (
          <OTPVerificationScreen
            email={signupEmail}
            onBack={() => {
              setOpenedFrom("OTPVerification");
              // return user to previous logical screen based on context
              if (otpContext === 'signup') setCurrentScreen('SignUp');
              else if (otpContext === 'resetPassword') setCurrentScreen('ForgotPassword');
              else if (otpContext === 'addCard') setCurrentScreen('AddPaymentSource');
              else setCurrentScreen('SignIn');
            }}
            onVerify={async () => {
              // Finalize action based on otpContext
              try {
                if (otpContext === 'signup') {
                  setOpenedFrom("OTPVerification");
                  setCurrentScreen("RecoveryPhrase");
                } else if (otpContext === 'resetPassword') {
                  // After email confirmation for reset, continue to recovery phrase verification
                  setOpenedFrom('OTPVerification');
                  setCurrentScreen('RecoveryPhraseVerification');
                } else if (otpContext === 'forgotPin') {
                  setOpenedFrom('OTPVerification');
                  setCurrentScreen('ForgotTransactionPin');
                } else if (otpContext === 'addCard') {
                  if (pendingAddCard) {
                    setCardBeingLinked(pendingAddCard);
                    setCardLinkingStep('verify');
                    setPendingAddCard(null);
                  }
                } else if (otpContext === 'addBankAccount') {
                  if (pendingBankAccount) {
                    const saved = pendingBankAccount;
                    setNewBankAccountData(saved);
                    setBankAccounts(prev => [...prev, saved]);
                    setPendingBankAccount(null);
                    setOpenedFrom('AddBankAccount');
                    setCurrentScreen('BankAccountSuccess');
                  }
                }
              } finally {
                setOtpContext(null);
              }
            }}
            onResendOTP={() => {
              if (signupEmail) {
                supabase.auth.signInWithOtp({ email: signupEmail }).catch(() => {});
              }
            }}
          />
        )}

        {currentScreen === "RecoveryPhrase" && (
          <RecoveryPhraseScreen 
            phrases={user?.recoveryPhrase || []}
            email={user?.email || ''}
            userName={user?.fullName || ''}
            onContinue={() => {
              // Ensure user has fullName before proceeding
              if (!user?.fullName) {
                console.warn('⚠️ User missing fullName during signup! Saving from recovery data...');
                const stored = localStorage.getItem('signupPending');
                if (stored) {
                  const pending = JSON.parse(stored);
                  if (pending.fullName) {
                    setUser(prev => ({ ...prev, fullName: pending.fullName }));
                  }
                }
              }
              setCurrentScreen("CreatePin");
            }} 
          />
        )}

        {currentScreen === "CreatePin" && (
          <CreateTransactionPinScreen
            onBack={() => setCurrentScreen("RecoveryPhrase")}
            onPinCreated={async (newPin) => {
              try {
                // directly finalize PIN without any email/OTP step
                try { localStorage.setItem('userPin', newPin); } catch (e) {}
                const updatedUser = { ...(user || {}), transactionPin: newPin };
                setUser(updatedUser);
                try { localStorage.setItem('user', JSON.stringify(updatedUser)); } catch (e) {}
                setCurrentScreen('RegistrationSplash');
              } catch (e) {
                console.error('PIN creation error:', e);
                showAlert({ type: 'error', title: 'Error', message: 'Failed to save PIN. Please try again.' });
              }
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
              // Navigate to processing screen - it will handle goal creation and show sequential messages
              setCurrentScreen("SavingsProcessing");
            }} 
          />
        )}

        {currentScreen === "SavingsProcessing" && (
          <SavingsProcessingScreen
            savingsPlanData={savingsPlanData}
            onComplete={() => {
              // Goal sync already happened, now create reminder and go to deposit
              try { scheduleSavingsReminder(savingsPlanData); } catch (e) {}
              setOpenedFrom("SavingsProcessing");
              setCurrentScreen("Deposit");
            }}
          />
        )}

        {/* ===== RECOVERY SCREENS ===== */}
        {currentScreen === "ForgotPassword" && (
          <ForgotPasswordScreen
            user={user}
            onBack={() => {
              setOpenedFrom("ForgotPassword");
              setCurrentScreen("SignIn");
            }}
            onVerifyEmail={(email) => {
              // Continue to recovery phrase verification (no magic link required)
              setOpenedFrom("ForgotPassword");
              setCurrentScreen("RecoveryPhraseVerification");
            }}
          />
        )}

        {currentScreen === "RecoveryPhraseVerification" && (
          <RecoveryPhraseVerificationScreen
            recoveryPhrases={user?.recoveryPhrase || safeParse(localStorage.getItem('user'), {}).recoveryPhrase || []}
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
                console.log('🔐 Password updated and saved to localStorage for', updatedUser.email || updatedUser.phone);
              } catch (e) {
                // fallback: set from user state if available
                const updatedUser = { ...(user || {}), password: newPassword };
                setUser(updatedUser);
                try { localStorage.setItem('user', JSON.stringify(updatedUser)); console.log('🔐 Password updated and saved to localStorage (fallback)'); } catch (err) {}
              }
              setOpenedFrom("CreateNewPassword");
              setCurrentScreen("PasswordResetSuccess");
            }}
          />
        )}

        {currentScreen === "PasswordResetSuccess" && (
          <PasswordResetSuccessScreen
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

        {currentScreen === "ForgotTransactionPin" && (
          <ForgotTransactionPinScreen
            userEmail={user?.email || ""}
            userPhone={user?.phone || ""}
            onBack={() => {
              setOpenedFrom("ForgotTransactionPin");
              setCurrentScreen("Pin");
            }}
            onPinReset={(newPin) => {
              // Save PIN to localStorage
              localStorage.setItem("userPin", newPin);
              // Also save to user object for consistency
              const updatedUser = { ...user, transactionPin: newPin };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setCurrentScreen("Pin");
            }}
          />
        )}

        {/* ===== MAIN APP SCREENS ===== */}
        {currentScreen === "Main" && (
          <>
            {activeTab === "home" && (
              <HomeScreen
                transactions={transactions}
                user={user}
                savingsBalance={savingsBalance}
                openScreen={openScreen}
              />
            )}

            {activeTab === "savings" && (
              <SavingsScreen
                savings={user?.savingsPlan && {
                  total: savingsBalance,
                  startDate: user.savingsPlan.startDate,
                  withdrawDate: user.savingsPlan.withdrawalDate,
                  isMatured: !user.savingsPlan.isActive,
                  durationMonths: user.savingsPlan.durationMonths,
                  goal: user.savingsPlan.goal,
                }}
                openScreen={(action) => {
                  if (action === "Deposit") openScreen("Deposit");
                  if (action === "WithdrawSavings") setCurrentScreen("Withdraw");
                }}
                onViewSavingsDetails={() => {
                  setOpenedFrom("Main");
                  setCurrentScreen("SavingsDetail");
                }}
                onBack={goHome}
              />
            )}

            {activeTab === "profile" && !profileSection && !showSavedCards && !showSavedAccounts && !showCardDetails && (
              <ProfileScreen
                user={user}
                onLogout={handleLogout}
                openScreen={openScreen}
                profilePicture={profilePicture}
                onProfilePictureChange={setProfilePicture}
              />
            )}

            {activeTab === "profile" && profileSection === "notifications" && (
              <NotificationsScreen onBack={() => setProfileSection(null)} />
            )}

            {activeTab === "profile" && profileSection === "security" && !showPrivacyPolicy && dangerZoneAction === null && (
              <SecurityPrivacyScreen
                onBack={() => setProfileSection(null)}
                onViewPrivacyPolicy={() => setShowPrivacyPolicy(true)}
                onResetPin={() => setDangerZoneAction("resetPin")}
                onCloseAccount={() => setDangerZoneAction("closeAccount")}
              />
            )}

            {activeTab === "profile" && profileSection === "security" && showPrivacyPolicy && (
              <PrivacyPolicyScreen onBack={() => setShowPrivacyPolicy(false)} />
            )}

            {activeTab === "profile" && profileSection === "security" && dangerZoneAction === "resetPin" && (
              <ResetPINScreen
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
                user={user}
                onUserChange={async (newUser) => {
                  setUser(newUser);
                  if (newUser?.email) {
                    try { await upsertUserProfile({
                      email: newUser.email,
                      fullName: newUser.fullName,
                      recoveryPhrase: newUser.recoveryPhrase || null,
                      // you could include other profile fields here as needed
                    });
                    } catch (e) {}
                  }
                }}
                onBack={() => setProfileSection(null)}
              />
            )}

            {activeTab === "profile" && showSavedCards && (
              <SavedCardsScreen
                cards={bankCards}
                onBack={() => setShowSavedCards(false)}
                onAddCard={() => {
                  setReturnToProfileSubScreen("SavedCards");
                  openScreen("AddPaymentSource");
                }}
                onDeleteCard={async (cardIdx) => {
                  const card = bankCards[cardIdx];
                  setBankCards(prev => prev.filter((_, idx) => idx !== cardIdx));
                  if (user?.email && card) {
                    try {
                      await deleteBankCard(card, user.email);
                    } catch (e) {
                      console.warn('failed delete card on server', e);
                    }
                  }
                }}

              />
            )}

            {activeTab === "profile" && showSavedAccounts && (
              <SavedAccountsScreen
                accounts={bankAccounts}
                onBack={() => setShowSavedAccounts(false)}
                onAddAccount={() => {
                  setReturnToProfileSubScreen("SavedAccounts");
                  openScreen("AddBankAccount");
                }}
                onDeleteAccount={async (accountId) => {
                  setBankAccounts(prev => prev.filter((a) => a.id !== accountId));
                  if (user?.email && accountId) {
                    try {
                      await deleteBankAccount(accountId, user.email);
                    } catch (e) {
                      console.warn('failed delete account on server', e);
                    }
                  }
                }}
                onSetDefault={(accountId) => {
                  setBankAccounts(prev => prev.map(a => ({ ...a, isDefault: a.id === accountId })));
                }}
              />
            )}

            {/* BottomNav moved to global position so it is clickable from any screen */}
          </>
        )}

        {/* ===== TRANSACTION SCREENS ===== */}
        {currentScreen === "Deposit" && (
          <DepositScreen
            onBack={handleBack}
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
            user={user}
            savingsBalance={savingsBalance}
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
            onConfirm={() => {
              setRequirePin(true);
              setCurrentScreen("Pin");
            }}
          />
        )}

        {currentScreen === 'OTPInput' && (
          <OTPInputScreen
            context={otpContext}
            title={otpContext === 'forgotPin' ? 'Reset Transaction PIN' : 'Verify Identity'}
            description={
              otpContext === 'forgotPin'
                ? 'Enter the OTP shown in your device notification to reset your PIN'
                : 'Enter the verification code shown in your device notification'
            }
            onBack={() => {
              setOtpContext(null);
              handleBack();
            }}
            onResendOTP={async () => {
              // Resend OTP based on context
              if (otpContext === 'forgotPin') {
                const otp = generateOTP(6);
                storeOTP('forgotPin', otp, 5);
                await notifyOTP(otp, 'forgotPin');
              } else if (otpContext === 'addCard') {
                const otp = generateOTP(6);
                storeOTP('addCard', otp, 5);
                await notifyOTP(otp, 'addCard');
              }
            }}
            onVerifySuccess={() => {
              if (otpContext === 'forgotPin') {
                setOtpContext(null);
                setCurrentScreen('ForgotTransactionPin');
              } else if (otpContext === 'addCard') {
                // finalize pending card addition
                if (pendingAddCard) {
                  setCardBeingLinked(pendingAddCard);
                  setCardLinkingStep('verify');
                  setPendingAddCard(null);
                  setCurrentScreen('AddPaymentSource');
                } else {
                  handleBack();
                }
                setOtpContext(null);
              } else {
                setOtpContext(null);
                handleBack();
              }
            }}
          />
        )}

        {requirePin && currentScreen === "Pin" && (
          <PinScreen
            onBack={handleBack}
            onSuccess={handlePinSuccess}
            onForgotPin={async () => {
              // Generate client-side OTP for PIN reset
              setOpenedFrom('Pin');
              const email = user?.email;
              if (email) {
                const otp = generateOTP(6);
                storeOTP('forgotPin', otp, 5); // 5 minute expiry
                const userName = user?.fullName || 'User';
                await notifyOTP(otp, 'forgotPin');
                // OTP notification has been shown; user should check their device.
                // Do not display the code or a banner per security requirements.
                setSignupEmail(email);
                setOtpContext('forgotPin');
                setCurrentScreen('OTPInput');
              } else {
                setCurrentScreen('ForgotTransactionPin');
              }
            }}
          />
        )}

        {currentScreen === 'BankTransferInstructions' && pendingPayment && (
          <BankTransferInstructionsScreen
            user={user}
            amount={pendingPayment.amount}
            onBack={() => {
              goHome();
            }}
            onTransferConfirmed={() => {
              setCurrentScreen("PaymentProcessing");
            }}
          />
        )}

        {currentScreen === 'CardPaymentOTP' && pendingPayment && pendingPayment.selectedCard && (
          <CardPaymentOTPScreen
            cardLast4={pendingPayment.selectedCard.cardNumber?.slice(-4) || "0000"}
            amount={pendingPayment.amount}
            onBack={() => {
              setCurrentScreen("ConfirmPayment");
            }}
            onVerify={(otp) => {
              setCurrentScreen('CardPaymentProcessing');
            }}
          />
        )}

        {currentScreen === 'CardPaymentProcessing' && pendingPayment && pendingPayment.selectedCard && (
          <CardPaymentProcessingScreen
            card={pendingPayment.selectedCard}
            amount={pendingPayment.amount}
            onBack={() => {
              goHome();
            }}
            onPaymentComplete={async () => {
              // Directly process the transaction with proper error handling
              try {
                await processTransaction(pendingPayment);
              } catch (error) {
                console.error('Card payment transaction failed:', error);
                setPendingPayment(null);
                goHome();
              }
            }}
          />
        )}

        {currentScreen === "PaymentProcessing" && pendingPayment && (
          <PaymentProcessingScreen
            message={
              pendingPayment.type === "withdraw"
                ? "Processing your withdrawal..."
                : pendingPayment.type === "deposit"
                ? "Processing your deposit..."
                : pendingPayment.type === "save" || pendingPayment.type === "topup"
                ? "Setting up your savings..."
                : "Securing your transaction..."
            }
            onComplete={async () => {
              // processTransaction handles all state changes and navigation,
              // including errors - just await it to complete
              await processTransaction(pendingPayment);
            }}
          />
        )}

        {currentScreen === "TransactionResult" && transactionResult && (
          <TransactionResultScreen
            status="success"
            amount={transactionResult.amount}
            type={transactionResult.type}
            onDone={goHome}
          />
        )}

        {/* App-level in-app alert */}
        <AppAlert alert={appAlert} onClose={() => setAppAlert(null)} />

        {currentScreen === "TransactionReceipt" && selectedTransaction && (
          <TransactionReceiptScreen
            transaction={selectedTransaction}
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
            onBack={handleBack}
            savingsBalance={savingsBalance}
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
              goal: user.savingsPlan.goal,
              targetAmount: user.savingsPlan.targetAmount,
            }}
            transactions={transactions}
            onBack={handleBack}
          />
        )}

        {/* ===== PAYMENT SOURCE SCREENS ===== */}
        {currentScreen === "AddPaymentSource" && (
          <>
            {cardLinkingStep === "add" && (
              <AddPaymentSourceScreen
                user={user}
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
                onSave={async (card) => {
                  // Skip OTP verification, proceed directly to card verification
                  setCardBeingLinked(card);
                  setCardLinkingStep('verify');
                }}
              />
            )}

            {cardLinkingStep === "verify" && cardBeingLinked && (
              <CardVerificationScreen
                card={cardBeingLinked}
                onBack={() => {
                  setCardBeingLinked(null);
                  setCardLinkingStep("add");
                  // returnToProfileSubScreen state is preserved automatically
                }}
                onVerified={async (verifiedCard) => {
                  // Skip save step, go directly to saving
                  let cardToSave = { ...verifiedCard };
                  // persist to server as well and capture returned id
                  if (user?.email) {
                    try {
                      const { data, error } = await insertBankCard(cardToSave, user.email);
                      if (data && data[0] && data[0].id) {
                        cardToSave.id = data[0].id;
                      }
                    } catch (e) {
                      console.warn('Failed to save card to server', e);
                    }
                  }
                  setBankCards((prev) => [...prev, cardToSave]);
                  // Update the linked card with server data, then move to success
                  setCardBeingLinked(cardToSave);
                  setCardLinkingStep("linkSuccess");
                }}
              />
            )}

            {/* SaveCardDetailsScreen removed - card details now saved directly after verification */}

            {cardLinkingStep === "linkSuccess" && cardBeingLinked && (
              <LinkCardSuccessScreen
                onDone={() => {
                  setCardBeingLinked(null);
                  setCardLinkingStep("add");
                  // Always go to SavedCards after successful card link
                  setShowSavedCards(true);
                  setReturnToProfileSubScreen(null);
                  setCurrentScreen("Main");
                }}
              />
            )}
          </>
        )}

        {/* ===== BANK ACCOUNT SCREENS ===== */}
        {currentScreen === "AddBankAccount" && (
          <AddBankAccountScreen
            onBack={handleBack}
            onAddAccount={async (accountData) => {
              const accountObj = { id: Date.now().toString(), ...accountData };
              // Add account directly without OTP verification
              setBankAccounts(prev => [...prev, accountObj]);
              setNewBankAccountData(accountObj);
              // Persist to server
              if (user?.email) {
                insertBankAccount(accountObj, user.email).catch((e) => {
                  console.warn('Failed to save bank account to server:', e);
                });
              }
              setCurrentScreen("BankAccountSuccess");
            }}
          />
        )}

        {currentScreen === "BankAccountVerification" && newBankAccountData && (
          <BankAccountVerificationScreen
            status="success"
            bankName={newBankAccountData.selectedBank}
            accountNumber={newBankAccountData.accountNumber}
            accountHolder={newBankAccountData.accountHolder}
            onDone={() => {
              // Add account to state
              setBankAccounts((prev) => [...prev, newBankAccountData]);
              
              const saved = newBankAccountData;
              setNewBankAccountData(null);
              
              // If we were adding the account from a payment flow (e.g. ConfirmPayment for withdrawals),
              // attach the new account to the pending payment and return to confirmation so the flow continues.
              if (openedFrom === 'ConfirmPayment') {
                setPendingPayment(prev => ({ ...(prev || {}), paymentMethod: 'bank', selectedAccount: saved }));
                setOpenedFrom(null);
                setCurrentScreen('ConfirmPayment');
              } else {
                setShowSavedAccounts(true);
                setOpenedFrom(null);
                setCurrentScreen("Main");
              }
            }}
          />
        )}

        {/* ===== LOCK SAVINGS SCREENS ===== */}
        {currentScreen === "LockSavingsMethod" && (
          <LockSavingsMethodScreen
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
        {/* BottomNav: show only on top-level app screens (Main top-level tabs and TransactionHistory).
            Hidden on onboarding, payment flows and on profile subsections. */}
        {(
          (currentScreen === "Main" && (activeTab !== "profile" || (!profileSection && !showSavedCards && !showSavedAccounts && !showCardDetails)))
          || currentScreen === "TransactionHistory"
        ) && (
          <BottomNav
            active={activeTab}
            setActive={(tab) => {
              setActiveTab(tab);
              setCurrentScreen("Main");
              setProfileSection(null);
              setShowSavedCards(false);
              setShowSavedAccounts(false);
            }}
          />
        )}
      </div>
    </CurrencyProvider>
  );
}

export default App;
