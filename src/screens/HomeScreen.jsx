import React from "react";
import { ArrowUpRight, ArrowDownLeft, Sun, Moon, Lock } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function HomeScreen({
  transactions = [],
  user,
  openScreen,
  darkMode,
  toggleDarkMode,
  balance,
  savingsBalance,
}) {
  const currencyContext = useCurrency();
  const formatAmount =
    currencyContext?.formatAmount || ((amt) => `₦${amt.toLocaleString()}`);

  const hasSavings = savingsBalance > 0;

  return (
    <div
      className={`px-6 pb-32 min-h-screen animate-fade-in ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-6">
        <h1 className="text-2xl font-bold">
          Hello, {user?.fullName ? user.fullName.split(' ')[0] : "User"} 👋
        </h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>


      {/* Savings Status Card */}
      <div
        className={`rounded-3xl p-6 mb-8 shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {!hasSavings ? (
          <>
            <p className="text-lg font-semibold mb-2">No savings yet</p>
            <p className="text-sm text-gray-400 mb-6">
              Start saving and lock your money till your chosen date.
            </p>

            <button
              onClick={() => openScreen("Deposit")}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              <ArrowUpRight size={18} />
              Start Saving
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Lock size={18} className="text-emerald-600" />
              <span className="font-semibold">Active Savings</span>
            </div>

            <p className="text-3xl font-bold mb-2">
              {formatAmount(savingsBalance)}
            </p>

            <p className="text-sm text-gray-400 mb-6">
              Locked • Withdrawal date will be enforced
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => openScreen("Deposit")}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium ${
                  darkMode
                    ? "bg-emerald-600/30 hover:bg-emerald-600/40"
                    : "bg-emerald-500/20 hover:bg-emerald-500/30"
                }`}
              >
                <ArrowUpRight size={16} />
                Save More
              </button>

              <button
                onClick={() => user?.savingsPlan?.isActive ? null : openScreen("Withdraw")}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium ${
                  user?.savingsPlan?.isActive
                    ? darkMode
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : darkMode
                      ? "bg-emerald-600/30 hover:bg-emerald-600/40"
                    : "bg-emerald-500/20 hover:bg-emerald-500/30"
                }`}
                disabled={user?.savingsPlan?.isActive}
              >
                <ArrowDownLeft size={16} />
                Withdraw
              </button>
            </div>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Recent Activity</h2>
          <button
            onClick={() => openScreen("TransactionHistory")} // fixed screen name
            className="text-gray-400"
          >
            ▶
          </button>
        </div>

        <div className="space-y-4 pb-4">
          {transactions.slice(0, 5).map((t) => {
            const isDeposit = t.type === "save" || t.type === "topup";

            let title = "";
            if (t.type === "save") title = "Savings Deposit";
            else if (t.type === "topup") title = "Top Up";
            else title = "Withdrawal";

            return (
              <div
                key={t.id}
                onClick={() => openScreen("TransactionReceipt", t)} // open receipt
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-50 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDeposit
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isDeposit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`font-bold text-sm ${
                    isDeposit ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isDeposit ? "+" : "-"}
                  {formatAmount(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
