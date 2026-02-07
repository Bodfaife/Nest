import React, { useEffect, useState } from "react";

import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import DepositScreen from "./screens/DepositScreen";
import WithdrawScreen from "./screens/WithdrawScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AddPaymentSourceScreen from "./screens/AddPaymentSourceScreen";
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
import jsPDF from "jspdf";

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
  const [lastTransaction, setLastTransaction] = useState(null);
  const [balance, setBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  

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

  // NAVIGATION
  const openScreen = (screen, data = null) => {
    if (screen === "TransactionReceipt") setSelectedTransaction(data);
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

  // TRANSACTIONS
  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  // PIN FLOW
  const handlePinSuccess = () => {
    setRequirePin(false);
    if (typeof pendingAction === "function") pendingAction();
    setPendingAction(null);
  };

  // SHARE RECEIPT
  const handleShare = (transaction) => {
    const text = `
Transaction Receipt
------------------
Amount: ${transaction.amount}
Type: ${transaction.type}
Reference: ${transaction.reference}
Date: ${new Date(transaction.date).toLocaleString()}
    `;
    if (navigator.share) {
      navigator.share({ title: "Transaction Receipt", text })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(text)
        .then(() => alert("Receipt copied to clipboard!"))
        .catch(() => alert("Unable to copy receipt"));
    }
  };

  // DOWNLOAD PDF RECEIPT (Full UI Replica with Dark Mode)
  const handleDownload = (transaction) => {
    const isSuccess = transaction.status !== "failed"; // assume success
    const doc = new jsPDF();
    let y = 20;

    // Background rectangle for the top bar (green/red)
    const fillColor = isSuccess ? [0, 135, 90] : [220, 38, 38];
    doc.setFillColor(...fillColor); // spread array into r,g,b
    doc.rect(10, 10, 190, 8, "F");
    y += 20;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Transaction Receipt", 20, y);
    y += 12;

    // Success/Failure Icon (circle with check or X)
      // For top bar
      const topBarColor = isSuccess ? [0, 135, 90] : [220, 38, 38];
      doc.setFillColor(...topBarColor);
      doc.rect(10, 10, 190, 8, "F");
      y += 20;

      // For circle
      const circleColor = isSuccess ? [0, 135, 90] : [220, 38, 38];
      doc.setFillColor(...circleColor);
      doc.circle(20, y + 10, 7, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(isSuccess ? "✔" : "✖", 18, y + 13);
      y += 20;


    // Fields with boxes
    const fields = [
      { label: "Amount", value: transaction.amount },
      { label: "Type", value: transaction.type },
      { label: "Reference", value: transaction.reference },
      { label: "Date", value: new Date(transaction.date).toLocaleString() },
      { label: "Status", value: isSuccess ? "Completed" : "Failed" },
    ];

    fields.forEach(field => {
      // Box
      doc.setDrawColor(200);
      doc.roundedRect(20, y, 170, 10, 2, 2, "S");
      // Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${field.label}:`, 22, y + 7);
      // Value
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      doc.text(`${field.value}`, 70, y + 7);
      y += 15;
    });

    // Footer note
    y += 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for using Nest!", 20, y);

    // Save PDF
    doc.save(`receipt-${transaction.reference}.pdf`);
  };

  // RENDER
  return (
    <CurrencyProvider>
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

        {/* SPLASH */}
        {currentScreen === "Splash" && (
          <SplashScreen onFinish={() => setCurrentScreen(user ? "Main" : "SignIn")} />
        )}

        {/* AUTH */}
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

        {/* MAIN */}
        {currentScreen === "Main" && (
          <>
            {activeTab === "home" && (
             <HomeScreen
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(d => !d)}
              transactions={transactions}
              user={user}
              openScreen={openScreen}
              balance={balance}
              savingsBalance={savingsBalance}
            
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

           {/* DEPOSIT */}
          {currentScreen === "Deposit" && (
          <DepositScreen
            onBack={goHome}
            darkMode={darkMode}
            user={user}
            openScreen={openScreen}
            onConfirm={(data) => {
            if (user?.savingsPlan?.isActive) {
              // top-up: duration is not needed
              setPendingPayment({ ...data, type: "save" });
              setPendingAction(() => () => setCurrentScreen("PaymentProcessing"));
              setCurrentScreen("ConfirmPayment");
              return;
            }

            // first-time savings: use duration normally
            setPendingPayment({ ...data, type: "save" });
            setPendingAction(() => () => setCurrentScreen("PaymentProcessing"));
            setCurrentScreen("ConfirmPayment");
          }}
          />
        )}


        {/* WITHDRAW */}
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

        {/* SAVINGS */}
        {activeTab === "savings" && user?.savingsPlan && (
        <SavingsScreen
          darkMode={darkMode}
          savings={{
            total: savingsBalance,
            startDate: user.savingsPlan.startDate,
            withdrawDate: user.savingsPlan.withdrawalDate,
            isMatured: !user.savingsPlan.isActive, // matured if plan is inactive
          }}
           openScreen={(screen) => {
            if (screen === "TopUpSavings") {
              // navigate to deposit screen, but without duration
              setCurrentScreen("Deposit");
            } else if (screen === "Withdraw") {
              setCurrentScreen("Withdraw");
            } else {
              openScreen(screen);
            }
          }}
          onBack={goHome}
        />
        )}

        {/* ADD PAYMENT SOURCE */}
        {currentScreen === "AddPaymentSource" && (
          <AddPaymentSourceScreen
            user={user}
            darkMode={darkMode}
            onBack={goHome}
            onSave={goHome}
          />
        )}

        {/* CONFIRM PAYMENT */}
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

        {/* PIN */}
        {requirePin && currentScreen === "Pin" && (
          <PinScreen
            darkMode={darkMode}
            onBack={goHome}
            onSuccess={handlePinSuccess}
          />
        )}

 {/* ---------- PROCESSING (FIXED BALANCE LOGIC) ---------- */}
          {currentScreen === "PaymentProcessing" && pendingPayment && (
            <PaymentProcessingScreen
              darkMode={darkMode}
              onComplete={() => {
                const amount = Number(pendingPayment.amount);

                if (pendingPayment.type === "save") {
                  setBalance(prev => prev + amount);
                  setSavingsBalance(prev => prev + amount);
                  setUser(prev => {
                  // already has active savings → TOP UP
                  if (prev?.savingsPlan?.isActive) {
                    return prev;
                  }

                  // first-time savings → CREATE PLAN
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

                if (pendingPayment.type === "withdraw") {
                  setBalance(prev => prev - amount);
                  setSavingsBalance(prev => prev - amount);
                }

                const tx = {
                  id: Date.now(),
                  reference: generateReference(),
                  type: pendingPayment.type,
                  amount,
                  date: new Date().toISOString(),
                  status: "success",
                };

                addTransaction(tx);
                setTransactionResult(tx);
                setPendingPayment(null);
                setCurrentScreen("TransactionResult");
              }}
            />
          )}

        {/* RESULT */}
        {currentScreen === "TransactionResult" && transactionResult && (
          <TransactionResultScreen
            status="success"
            darkMode={darkMode}
            amount={transactionResult.amount}
            type={transactionResult.type}
            onDone={() => {
              setTransactionResult(null);
              setLastTransaction(null);
              goHome();
            }}
          />
        )}

        {/* HISTORY & RECEIPT */}
        {currentScreen === "TransactionsHistory" && (
          <TransactionsHistoryScreen
            transactions={transactions}
            onBack={goHome}
            darkMode={darkMode}
            openScreen={openScreen}
          />
        )}

        {currentScreen === "TransactionReceipt" && selectedTransaction && (
          <TransactionReceiptScreen
            transaction={selectedTransaction}
            status="success"
            onShare={handleShare}
            onDownload={() => handleDownload(selectedTransaction)}
            darkMode={darkMode}
            onDone={goHome}
          />
        )}
      </div>
    </CurrencyProvider>
  );
}
