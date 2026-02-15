import React, { useEffect, useState } from "react";
import { CurrencyProvider } from "./context/CurrencyContext";

// Onboarding Screens
import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import RecoveryPhraseScreen from "./screens/RecoveryPhraseScreen";
import RegistrationSplashScreen from "./screens/RegistrationSplashScreen";
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

function App() {
  // ===== Core Navigation State =====
  const [currentScreen, setCurrentScreen] = useState("Splash");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // ===== User & Authentication =====
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
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
  const [bankTransferStep, setBankTransferStep] = useState(null);

  // ===== Signup OTP State =====
  const [signupEmail, setSignupEmail] = useState("");
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  // ===== Persistence =====
  useEffect(() => {
    const u = localStorage.getItem("user");
    const savingsFlowScreenSaved = localStorage.getItem("savingsFlowScreen");
    const savingsPlanDataSaved = localStorage.getItem("savingsPlanData");
    if (u) setUser(JSON.parse(u));
    if (savingsFlowScreenSaved) setSavingsFlowScreen(savingsFlowScreenSaved);
    if (savingsPlanDataSaved) setSavingsPlanData(JSON.parse(savingsPlanDataSaved));
  }, []);

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
      setOpenedFrom(fromScreen || currentScreen);
      setCurrentScreen("TransactionHistory");
      return;
    }
    if (screen === "DownloadStatement") {
      setOpenedFrom(fromScreen || currentScreen);
      setCurrentScreen("DownloadStatement");
      return;
    }
    if (screen === "Deposit") {
      setDepositMode(hasActiveSavings ? "topup" : "start");
      setCurrentScreen("Deposit");
      return;
    }
    if (screen === "TransactionReceipt") {
      setSelectedTransaction(data);
    } else {
      setSelectedTransaction(null);
    }
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
    setUser(null);
    localStorage.clear();
    setCurrentScreen("SignIn");
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
              if (u?.savingsPlan?.isActive) {
                goHome();
              } else {
                if (savingsFlowScreen) {
                  setCurrentScreen(savingsFlowScreen);
                } else {
                  setCurrentScreen("CreateSavingsPrompt");
                }
              }
            }}
            onNavigateToSignUp={() => setCurrentScreen("SignUp")}
            onNavigateToForgotPassword={() => setCurrentScreen("ForgotPassword")}
          />
        )}

        {currentScreen === "SignUp" && (
          <SignUpScreen
            onSignUp={(u) => {
              setSignupEmail(u.email);
              const recoveryPhrase = generateRecoveryPhrase();
              const userObj = {
                fullName: u.fullName,
                email: u.email,
                password: u.password,
                savingsPlan: null,
                recoveryPhrase,
              };
              setUser(userObj);
              localStorage.setItem("user", JSON.stringify(userObj));
              setCurrentScreen("OTPVerification");
            }}
            onNavigateToSignIn={() => setCurrentScreen("SignIn")}
          />
        )}

        {currentScreen === "OTPVerification" && (
          <OTPVerificationScreen
            darkMode={darkMode}
            email={signupEmail}
            onBack={() => setCurrentScreen("SignUp")}
            onVerify={() => setCurrentScreen("RecoveryPhrase")}
            onResendOTP={() => console.log("OTP resent to", signupEmail)}
          />
        )}

        {currentScreen === "RecoveryPhrase" && (
          <RecoveryPhraseScreen 
            phrases={user?.recoveryPhrase || []}
            onContinue={() => setCurrentScreen("RegistrationSplash")} 
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
          />
        )}

        {currentScreen === "CreateSavingsBio" && (
          <CreateSavingsFormBioScreen onNext={() => setCurrentScreen("CreateSavingsDetails")} />
        )}

        {currentScreen === "CreateSavingsDetails" && (
          <CreateSavingsFormSavingsScreen 
            onSubmit={(formData) => {
              setSavingsPlanData(formData);
              setCurrentScreen("Deposit");
            }} 
          />
        )}

        {/* ===== RECOVERY SCREENS ===== */}
        {currentScreen === "ForgotPassword" && (
          <ForgotPasswordScreen
            darkMode={darkMode}
            onBack={() => setCurrentScreen("SignIn")}
            onVerifyEmail={() => setCurrentScreen("RecoveryPhraseVerification")}
          />
        )}

        {currentScreen === "RecoveryPhraseVerification" && (
          <RecoveryPhraseVerificationScreen
            darkMode={darkMode}
            recoveryPhrases={user?.recoveryPhrase || []}
            onBack={() => setCurrentScreen("ForgotPassword")}
            onVerified={() => setCurrentScreen("CreateNewPassword")}
          />
        )}

        {currentScreen === "CreateNewPassword" && (
          <CreateNewPasswordScreen
            darkMode={darkMode}
            onBack={() => setCurrentScreen("RecoveryPhraseVerification")}
            onPasswordCreated={(newPassword) => {
              const updatedUser = { ...user, password: newPassword };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setCurrentScreen("PasswordResetSuccess");
            }}
          />
        )}

        {currentScreen === "PasswordResetSuccess" && (
          <PasswordResetSuccessScreen
            darkMode={darkMode}
            onContinueToLogin={() => {
              setCurrentScreen("SignIn");
              setUser(null);
              localStorage.removeItem("user");
            }}
          />
        )}

        {currentScreen === "ResetPassword" && (
          <ResetPasswordScreen
            darkMode={darkMode}
            onBack={() => setCurrentScreen("RecoveryPhraseVerification")}
            onResetComplete={(newPassword) => {
              const updatedUser = { ...user, password: newPassword };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setCurrentScreen("PasswordResetSuccess");
            }}
          />
        )}

        {currentScreen === "ForgotTransactionPin" && (
          <ForgotTransactionPinScreen
            darkMode={darkMode}
            userEmail={user?.email || ""}
            userPhone={user?.phone || ""}
            onBack={() => setCurrentScreen("Pin")}
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
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(d => !d)}
                transactions={transactions}
                user={user}
                balance={balance}
                savingsBalance={savingsBalance}
                openScreen={openScreen}
              />
            )}

            {activeTab === "savings" && (
              <SavingsScreen
                darkMode={darkMode}
                savings={user?.savingsPlan && {
                  total: savingsBalance,
                  startDate: user.savingsPlan.startDate,
                  withdrawDate: user.savingsPlan.withdrawalDate,
                  isMatured: !user.savingsPlan.isActive,
                  durationMonths: user.savingsPlan.durationMonths,
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
                  setUser(null);
                  localStorage.clear();
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
                onAddCard={() => openScreen("AddPaymentSource")}
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
                onAddAccount={() => openScreen("AddBankAccount")}
                onDeleteAccount={(accountIdx) => {
                  setBankAccounts(prev => prev.filter((_, idx) => idx !== accountIdx));
                }}
              />
            )}

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
            onForgotPin={() => setCurrentScreen("ForgotTransactionPin")}
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
            onBack={() => setCurrentScreen("TransactionHistory")}
            onDone={() => setCurrentScreen("TransactionHistory")}
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
              setCurrentScreen("TransactionReceipt");
            }}
            onBack={handleBackFromContextScreen}
            onDownloadStatement={() => {
              setOpenedFrom(currentScreen);
              setCurrentScreen("DownloadStatement");
            }}
          />
        )}

        {currentScreen === "DownloadStatement" && (
          <DownloadStatementScreen
            transactions={transactions}
            darkMode={darkMode}
            onBack={handleBackFromContextScreen}
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
                onBack={handleBack}
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
                  goHome();
                }}
                onConfirm={(savedCard) => {
                  setBankCards((prev) => [...prev, savedCard]);
                  setCardBeingLinked(null);
                  setCardLinkingStep("add");
                  setCurrentScreen("Deposit");
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
