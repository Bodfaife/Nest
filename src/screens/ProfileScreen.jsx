import React from "react";
import { User, Smartphone, History, LogOut, Bell, Shield, ChevronRight } from "lucide-react";

export default function ProfileScreen({ user, onLogout, openScreen, darkMode }) {
  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      color: "bg-emerald-50 text-emerald-600",
    },
    { icon: Bell, label: "Notifications", color: "bg-blue-50 text-blue-600" },
    {
      icon: Shield,
      label: "Security & Privacy",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Smartphone,
      label: "Linked Devices",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: History,
      label: "Transactions History",
      color: "bg-gray-100 text-gray-600",
      action: () => openScreen("TransactionsHistory"),
    },
  ];

  return (
    <div className={`p-6 pb-24 animate-in fade-in duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* Avatar and User Info */}
      <div className="flex flex-col items-center mb-10 pt-8">
        <div className="relative">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-xl ${darkMode ? "bg-gray-800" : "bg-emerald-50"}`}>
            👤
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center bg-[#00875A]">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>

        <h2 className="text-2xl font-black mt-4">
          {user?.name || "User"}
        </h2>
        <p className="text-sm font-bold uppercase tracking-widest mt-1 text-gray-400">
          {user?.membership || "Nest Premium"}
        </p>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border ${darkMode ? "border-gray-700 bg-gray-800 active:bg-gray-700" : "border-gray-50 bg-white active:bg-gray-50"} transition-all group`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={darkMode ? "font-bold text-white" : "font-bold text-gray-700"}>{item.label}</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-300"} group-hover:translate-x-1 transition-transform`} />
          </button>
        ))}

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center justify-between p-4 rounded-2xl mt-6 border ${darkMode ? "bg-red-800 border-red-700 text-red-400 active:bg-red-700" : "bg-red-50/50 border-red-50 text-red-500 active:bg-red-50"}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${darkMode ? "bg-red-700" : "bg-red-100"}`}>
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-black">{darkMode ? "Sign Out" : "Sign Out"}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
