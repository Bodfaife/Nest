import React, { useEffect, useState } from "react";

import SplashScreen from "./screens/SplashScreen";
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
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [pendingPayment, setPendingPayment] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [requirePin, setRequirePin] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const [balance, setBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);

  const [depositMode, setDepositMode] = useState("start"); // start | topup

  const hasActiveSavings = Boolean(user?.savingsPlan?.isActive);

  // Load from localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("transactions");
    if (u) setUser(JSON.parse(u));
    if (t) setTransactions(JSON.parse(t));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [user, transactions]);

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

    const txType = pendingPayment.type === "topup" ? "save" : pendingPayment.type;

    if (txType === "save") {
      setBalance(prev => prev + amount);
      setSavingsBalance(prev => prev + amount);

      setUser(prev => {
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
            onSignUp={(u) => { setUser(u); goHome(); }}
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
                  if (action === "TopUpSavings") {
                    setDepositMode("topup");
                    setCurrentScreen("Deposit");
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
            openScreen={openScreen}
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
            onDone={() => setCurrentScreen("TransactionHistory")} // fixed prop
          />
        )}

        {currentScreen === "TransactionHistory" && (
          <TransactionsHistoryScreen
            transactions={transactions}
            darkMode={darkMode}
            onBack={goHome}
            openScreen={openScreen} // now will pass to receipt correctly
          />
        )}

      </div>
    </CurrencyProvider>
  );
}
