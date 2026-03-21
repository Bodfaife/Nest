import React, { useState, useEffect } from "react";
import { User, History, LogOut, Bell, Shield, ChevronRight, Camera, Wallet, Download, Building2, CheckCircle } from "lucide-react";

export default function ProfileScreen({ user, onLogout, openScreen, darkMode, profilePicture, onProfilePictureChange, setProfileSection }) {
  const [showCompleteProfile, setShowCompleteProfile] = useState(() => {
    const completed = localStorage.getItem('profileCompleted');
    return !completed;
  });

  const [profileData, setProfileData] = useState({
    dob: '',
    gender: '',
    occupation: '',
    address: '',
    nextOfKin: '',
    bvn: '',
    nationalId: '',
    enable2FA: false,
    username: '',
    state: '',
    lga: '',
    religion: '',
    relationshipStatus: '',
    numberOfChildren: '',
    countryOfResidence: '',
    streetAddress: '',
    cityOfResidence: '',
    levelOfEducation: '',
    employmentStatus: '',
    sourceOfFunds: '',
    interests: ''
  });
  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      color: "bg-emerald-50 text-emerald-600",
      action: () => setProfileSection("personal"),
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      color: "bg-blue-50 text-blue-600",
      action: () => setProfileSection("notifications"),
    },
    {
      icon: Shield,
      label: "Security & Privacy",
      color: "bg-purple-50 text-purple-600",
      action: () => setProfileSection("security"),
    },
    {
      icon: Wallet,
      label: "Saved Cards",
      color: "bg-orange-50 text-orange-600",
      action: () => setProfileSection("cards"),
    },
    {
      icon: Building2,
      label: "Bank Accounts",
      color: "bg-pink-50 text-pink-600",
      action: () => setProfileSection("accounts"),
    },
    {
      icon: History,
      label: "Transaction History",
      color: "bg-gray-100 text-gray-600",
      action: () => setProfileSection("history"),
    },
    {
      icon: Download,
      label: "Download Statement",
      color: "bg-indigo-50 text-indigo-600",
      action: () => setProfileSection("statement"),
    },
  ];

  const bgClass = darkMode ? 'bg-black' : 'bg-gray-50';
  const textPrimary = "text-gray-900";
  const textSecondary = "text-gray-500";

  return (
    <div className={`p-6 pb-24 animate-in fade-in duration-300 ${bgClass}`}>

      {/* Avatar and User Info */}
      <div className="flex flex-col items-center mb-10 pt-4">
        <div className="relative group mb-6">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-xl overflow-hidden cursor-pointer transition-all ${
            darkMode ? 'bg-gray-950' : 'bg-emerald-50'
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

      {/* Complete Profile Section */}
      {showCompleteProfile && (
        <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-lg font-black mb-4 ${textPrimary}`}>Complete Your Profile</h3>
          <div className="space-y-4">
            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date of Birth</label>
              <input type="date" value={profileData.dob} onChange={(e) => setProfileData({...profileData, dob: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
              <select value={profileData.gender} onChange={(e) => setProfileData({...profileData, gender: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Occupation</label>
              <input type="text" value={profileData.occupation} onChange={(e) => setProfileData({...profileData, occupation: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} placeholder="e.g. Student, Engineer" />
            </div>
            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
              <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} placeholder="Your address" />
            </div>
            {/* Next of Kin */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Next of Kin</label>
              <input type="text" value={profileData.nextOfKin} onChange={(e) => setProfileData({...profileData, nextOfKin: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* BVN */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Bank Verification Number</label>
              <input type="text" value={profileData.bvn} onChange={(e) => setProfileData({...profileData, bvn: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* National ID */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">National Identification Number</label>
              <input type="text" value={profileData.nationalId} onChange={(e) => setProfileData({...profileData, nationalId: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* 2FA */}
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={profileData.enable2FA} onChange={(e) => setProfileData({...profileData, enable2FA: e.target.checked})} className="w-5 h-5" />
              <label className="text-sm font-bold">Enable Two-Factor Authentication</label>
            </div>
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Username</label>
              <input type="text" value={profileData.username} onChange={(e) => setProfileData({...profileData, username: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} placeholder="Display name" />
            </div>
            {/* State */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">State</label>
              <input type="text" value={profileData.state} onChange={(e) => setProfileData({...profileData, state: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* LGA */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Local Government Area</label>
              <input type="text" value={profileData.lga} onChange={(e) => setProfileData({...profileData, lga: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* Religion */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Religion</label>
              <input type="text" value={profileData.religion} onChange={(e) => setProfileData({...profileData, religion: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* Relationship Status */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Relationship Status</label>
              <select value={profileData.relationshipStatus} onChange={(e) => setProfileData({...profileData, relationshipStatus: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`}>
                <option value="">Select</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            {/* Number of Children */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Number of Children</label>
              <input type="number" value={profileData.numberOfChildren} onChange={(e) => setProfileData({...profileData, numberOfChildren: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* Country of Residence */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Country of Residence</label>
              <input type="text" value={profileData.countryOfResidence} onChange={(e) => setProfileData({...profileData, countryOfResidence: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* Street Address */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Street Address of Residence</label>
              <input type="text" value={profileData.streetAddress} onChange={(e) => setProfileData({...profileData, streetAddress: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* City of Residence */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">City of Residence</label>
              <input type="text" value={profileData.cityOfResidence} onChange={(e) => setProfileData({...profileData, cityOfResidence: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* Level of Education */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Level of Education</label>
              <select value={profileData.levelOfEducation} onChange={(e) => setProfileData({...profileData, levelOfEducation: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`}>
                <option value="">Select</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
                <option value="postgraduate">Postgraduate</option>
              </select>
            </div>
            {/* Employment Status */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Employment Status</label>
              <select value={profileData.employmentStatus} onChange={(e) => setProfileData({...profileData, employmentStatus: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`}>
                <option value="">Select</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
              </select>
            </div>
            {/* Source of Funds */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Source of Funds</label>
              <input type="text" value={profileData.sourceOfFunds} onChange={(e) => setProfileData({...profileData, sourceOfFunds: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} />
            </div>
            {/* Interests */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Interests</label>
              <textarea value={profileData.interests} onChange={(e) => setProfileData({...profileData, interests: e.target.value})} className={`w-full p-3 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50'}`} placeholder="What do you enjoy?" rows="3" />
            </div>
          </div>
          <button
            onClick={() => {
              // Validate required fields
              if (!profileData.dob || !profileData.gender || !profileData.occupation || !profileData.address) return;
              // Save to localStorage or user
              localStorage.setItem('profileData', JSON.stringify(profileData));
              localStorage.setItem('profileCompleted', 'true');
              setShowCompleteProfile(false);
            }}
            className="w-full mt-6 py-3 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
          >
            Complete Profile
          </button>
        </div>
      )}

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
