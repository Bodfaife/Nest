import React, { useEffect, useState } from "react";

import SplashScreen from "./screens/SplashScreen";
import AddPaymentSourceScreen from "./screens/AddPaymentSourceScreen";
import NestTransactionReceiptPDF from "./screens/NestTransactionReceiptPDF";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import DepositScreen from "./screens/DepositScreen";
import WithdrawScreen from "./screens/WithdrawScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SavingsScreen from "./screens/SavingsScreen";

import TransactionsHistoryScreen from "./screens/TransactionHistoryScreen";
import TransactionReceiptScreen from "./screens/TransactionReceiptScreen";
import TransactionResultScreen from "./screens/TransactionResultScreen";

import ConfirmPaymentScreen from "./screens/ConfirmPaymentScreen";
import PaymentProcessingScreen from "./screens/PaymentProcessingScreen";
import PinScreen from "./screens/PinScreen";

import BottomNav from "./components/BottomNav";

import { generateReference } from "./helpers/reference";
import { CurrencyProvider } from "./context/CurrencyContext";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Splash");
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState(null);
  const [bankCards, setBankCards] = useState(() => {
    const cards = localStorage.getItem("bankCards");
    return cards ? JSON.parse(cards) : [];
  });
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [pendingPayment, setPendingPayment] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [requirePin, setRequirePin] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const [balance, setBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);

  const [depositMode, setDepositMode] = useState("start"); // start | topup

  // Helper: does user have an active savings plan?
  const hasActiveSavings = Boolean(user?.savingsPlan && user.savingsPlan.isActive);

  // Load from localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("transactions");
    const cards = localStorage.getItem("bankCards");
    if (u) setUser(JSON.parse(u));
    if (t) setTransactions(JSON.parse(t));
    if (cards) setBankCards(JSON.parse(cards));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("bankCards", JSON.stringify(bankCards));
  }, [user, transactions, bankCards]);

  // Auto-mature savings
  useEffect(() => {
    if (!user?.savingsPlan?.isActive) return;

    const now = new Date();
    const withdrawalDate = new Date(user.savingsPlan.withdrawalDate);

    if (now >= withdrawalDate) {
      setUser(prev => ({
        ...prev,
        savingsPlan: {
          ...prev.savingsPlan,
          isActive: false,
        },
      }));
    }
  }, [user]);

  // Navigation helpers
  const openScreen = (screen, data = null) => {
    // Handle navigation for Deposit and Savings
    if (screen === "Deposit") {
      // If user has active savings, only allow topup
      if (hasActiveSavings) {
        setDepositMode("topup");
      } else {
        setDepositMode("start");
      }
      setCurrentScreen("Deposit");
      return;
    }
    if (screen === "TransactionReceipt") {
      setSelectedTransaction(data); // pass transaction to receipt
    } else {
      setSelectedTransaction(null); // clear previous transaction
    }
    setCurrentScreen(screen);
  };

  const goHome = () => {
    setCurrentScreen("Main");
    setActiveTab("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    setCurrentScreen("SignIn");
  };

  // Transactions
  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  // PIN flow
  const handlePinSuccess = () => {
    setRequirePin(false);
    if (typeof pendingAction === "function") pendingAction();
    setPendingAction(null);
  };

  // Process payment
  const processTransaction = (pendingPayment) => {
    const amount = Number(pendingPayment.amount);
    let txType = pendingPayment.type;

    // Only allow one savings plan creation
    if (txType === "save") {
      // If user already has savings, treat as topup
      if (user?.savingsPlan && user.savingsPlan.isActive) {
        txType = "topup";
      }
      setBalance(prev => prev + amount);
      setSavingsBalance(prev => prev + amount);

      setUser(prev => {
        // Only create savings plan if none exists
        if (prev?.savingsPlan?.isActive) return prev;
        return {
          ...prev,
          savingsPlan: {
            isActive: true,
            startDate: pendingPayment.startDate,
            withdrawalDate: pendingPayment.withdrawalDate,
          },
        };
      });
    }

    if (txType === "topup") {
      setBalance(prev => prev + amount);
      setSavingsBalance(prev => prev + amount);
      // Do not modify savingsPlan
    }

    if (txType === "withdraw") {
      setBalance(prev => prev - amount);
      setSavingsBalance(prev => prev - amount);
    }

    const tx = {
      id: Date.now(),
      reference: generateReference(),
      type: txType,
      amount,
      date: new Date().toISOString(),
      status: "success",
    };

    addTransaction(tx);
    setTransactionResult(tx);
    setPendingPayment(null);
    setCurrentScreen("TransactionResult");
  };

  return (
    <CurrencyProvider>
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

        {currentScreen === "Splash" && (
          <SplashScreen onFinish={() => setCurrentScreen(user ? "Main" : "SignIn")} />
        )}

        {currentScreen === "SignIn" && (
          <SignInScreen
            onSignIn={(u) => { setUser(u); goHome(); }}
            onNavigateToSignUp={() => setCurrentScreen("SignUp")}
          />
        )}

        {currentScreen === "SignUp" && (
          <SignUpScreen
            onSignUp={(u) => {
              // Save all user details and persist to localStorage
              const userObj = {
                fullName: u.fullName,
                email: u.email,
                password: u.password,
                savingsPlan: null,
              };
              setUser(userObj);
              localStorage.setItem("user", JSON.stringify(userObj));
              goHome();
            }}
            onNavigateToSignIn={() => setCurrentScreen("SignIn")}
          />
        )}

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
                openScreen={openScreen} // pass correct openScreen
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
                }}
                openScreen={(action) => {
                  if (action === "Deposit") {
                    openScreen("Deposit");
                  }
                  if (action === "WithdrawSavings") {
                    setCurrentScreen("Withdraw");
                  }
                }}
                onBack={goHome}
              />
            )}

            {activeTab === "profile" && (
              <ProfileScreen
                user={user}
                darkMode={darkMode}
                onLogout={handleLogout}
                openScreen={openScreen}
              />
            )}

            <BottomNav
              active={activeTab}
              setActive={(tab) => { setActiveTab(tab); setCurrentScreen("Main"); }}
              darkMode={darkMode}
            />
          </>
        )}

        {currentScreen === "Deposit" && (
          <DepositScreen
            onBack={goHome}
            darkMode={darkMode}
            mode={depositMode}
            onConfirm={(data) => {
              setPendingPayment({ ...data, type: depositMode === "start" ? "save" : "topup" });
              setPendingAction(() => () => setCurrentScreen("PaymentProcessing"));
              setCurrentScreen("ConfirmPayment");
            }}
            openScreen={(screen) => {
              if (screen === "AddPaymentSource") {
                setCurrentScreen("AddPaymentSource");
              } else {
                openScreen(screen);
              }
            }}
            bankCards={bankCards}
          />
        )}

        {currentScreen === "Withdraw" && (
          <WithdrawScreen
            onBack={goHome}
            darkMode={darkMode}
            user={user}
            onConfirm={(data) => {
              setPendingPayment({ ...data, type: "withdraw" });
              setPendingAction(() => () => setCurrentScreen("PaymentProcessing"));
              setCurrentScreen("ConfirmPayment");
            }}
          />
        )}

        {currentScreen === "ConfirmPayment" && pendingPayment && (
          <ConfirmPaymentScreen
            {...pendingPayment}
            onBack={goHome}
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
            onBack={goHome}
            onSuccess={handlePinSuccess}
          />
        )}

        {currentScreen === "PaymentProcessing" && pendingPayment && (
          <PaymentProcessingScreen
            darkMode={darkMode}
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
            onDone={() => setCurrentScreen("TransactionHistory")}
            onShare={(tx) => {
              // Open receipt in new tab for sharing
              const url = window.location.origin + "/receipt.html?data=" + encodeURIComponent(JSON.stringify(tx));
              window.open(url, "_blank");
            }}
            onDownload={(tx) => {
              // Open receipt in new tab for saving/printing
              const url = window.location.origin + "/receipt.html?data=" + encodeURIComponent(JSON.stringify(tx));
              window.open(url, "_blank");
            }}
          />
        )}

        {currentScreen === "AddPaymentSource" && (
          <>
            <AddPaymentSourceScreen
              user={user}
              darkMode={darkMode}
              onBack={goHome}
              onSave={(card) => {
                setBankCards((prev) => [...prev, card]);
                setCurrentScreen("Deposit");
              }}
            />
          </>
        )}

                {currentScreen === "TransactionHistory" && (
                  <TransactionsHistoryScreen
                    transactions={transactions}
                    darkMode={darkMode}
                    onSelectTransaction={(tx) => {
                      setSelectedTransaction(tx);
                      setCurrentScreen("TransactionReceipt");
                    }}
                    onBack={goHome}
                  />
                )}
              </div>
            </CurrencyProvider>
          );
        }
