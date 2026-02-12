import React from "react";
import { User, History, LogOut, Bell, Shield, ChevronRight, Camera, Wallet, Download, Building2 } from "lucide-react";

export default function ProfileScreen({ user, onLogout, openScreen, darkMode, profilePicture, onProfilePictureChange }) {
  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      color: "bg-emerald-50 text-emerald-600",
      action: () => openScreen("PersonalInformation"),
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      color: "bg-blue-50 text-blue-600",
      action: () => openScreen("Notifications"),
    },
    {
      icon: Shield,
      label: "Security & Privacy",
      color: "bg-purple-50 text-purple-600",
      action: () => openScreen("SecurityPrivacy"),
    },
    {
      icon: Wallet,
      label: "Saved Cards",
      color: "bg-orange-50 text-orange-600",
      action: () => openScreen("SavedCards"),
    },
    {
      icon: Building2,
      label: "Bank Accounts",
      color: "bg-pink-50 text-pink-600",
      action: () => openScreen("SavedAccounts"),
    },
    {
      icon: History,
      label: "Transaction History",
      color: "bg-gray-100 text-gray-600",
      action: () => openScreen("TransactionHistory"),
    },
    {
      icon: Download,
      label: "Download Statement",
      color: "bg-indigo-50 text-indigo-600",
      action: () => openScreen("DownloadStatement"),
    },
  ];

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`p-6 pb-24 animate-in fade-in duration-300 ${bgClass}`}>

      {/* Avatar and User Info */}
      <div className="flex flex-col items-center mb-10 pt-4">
        <div className="relative group mb-6">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-xl overflow-hidden cursor-pointer transition-all ${
            darkMode ? 'bg-gray-800' : 'bg-emerald-50'
          }`}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              "👤"
            )}
          </div>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onProfilePictureChange(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
            className="absolute bottom-1 right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center bg-[#00875A] hover:bg-emerald-700 transition-all cursor-pointer"
            title="Upload profile picture"
          >
            <Camera size={16} className="text-white" />
          </button>
        </div>

        <h2 className={`text-2xl font-black ${textPrimary}`}>
          {user?.fullName ? user.fullName.split(' ')[0] : "User"}
        </h2>
        <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${textSecondary}`}>
          {user?.membership || "Nest Member"}
        </p>
        {user?.accountNumber && (
          <p className={`text-xs font-mono mt-2 ${textSecondary}`}>
            Account: {user.accountNumber}
          </p>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-2 mb-8">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
              darkMode 
                ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 active:bg-gray-600' 
                : 'border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`font-bold ${textPrimary}`}>{item.label}</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${textSecondary} group-hover:translate-x-1 transition-transform`} />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={onLogout}
        className={`w-full flex items-center justify-between p-4 rounded-2xl mt-6 border transition-all ${
          darkMode 
            ? 'bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30 active:bg-red-900/40' 
            : 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100 active:bg-red-50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            darkMode ? 'bg-red-900/40' : 'bg-red-100'
          }`}>
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-black">Sign Out</span>
        </div>
      </button>

      {/* Footer Info */}
      <div className={`p-4 rounded-2xl mt-8 text-center ${
        darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
      }`}>
        <p className="text-xs">Nest App v1.0.0</p>
        <p className="text-[10px] mt-1">© 2026 Nest Savings. All rights reserved.</p>
      </div>
    </div>
  );
}
