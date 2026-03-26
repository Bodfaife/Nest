import React, { useState, useEffect } from "react";
import { User, History, LogOut, Bell, Shield, Wallet, Download, Building2, Camera, ChevronRight } from "lucide-react";

const defaultProfileData = {
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
};

const safeParse = (value, fallback = null) => {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch (e) { return fallback; }
};

export default function ProfileScreen({
  user,
  onLogout,
  openScreen,
  profilePicture,
  onProfilePictureChange,
  setProfileSection,
  onProfileSave
}) {
  const userKey = (user?.email || user?.accountNumber || user?.phone || "guest").toString().trim().toLowerCase();
  const profileDataKey = `profileData:${userKey}`;
  const profileCompletedKey = `profileCompleted:${userKey}`;

  // Profile completion moved to Personal Information section
  const [profileData, setProfileData] = useState(defaultProfileData);

  useEffect(() => {
    const storedProfile = localStorage.getItem(profileDataKey);
    const parsed = safeParse(storedProfile, null);
    if (parsed) {
      setProfileData({ ...defaultProfileData, ...parsed });
    } else {
      setProfileData(defaultProfileData);
    }
  }, [profileDataKey]);

  const menuItems = [
    { icon: User, label: "Personal Information", color: "bg-emerald-50 text-emerald-600", action: () => setProfileSection("personal") },
    { icon: Bell, label: "Notifications", color: "bg-blue-50 text-blue-600", action: () => setProfileSection("notifications") },
    { icon: Shield, label: "Security & Privacy", color: "bg-purple-50 text-purple-600", action: () => setProfileSection("security") },
    { icon: Wallet, label: "Saved Cards", color: "bg-orange-50 text-orange-600", action: () => openScreen("SavedCards") },
    { icon: Building2, label: "Bank Accounts", color: "bg-pink-50 text-pink-600", action: () => openScreen("SavedAccounts") },
    { icon: History, label: "Transaction History", color: "bg-gray-100 text-gray-600", action: () => openScreen("TransactionHistory") },
    { icon: Download, label: "Download Statement", color: "bg-indigo-50 text-indigo-600", action: () => openScreen("DownloadStatement") },
  ];

  const handleSaveProfile = () => {
    if (!profileData.dob || !profileData.gender || !profileData.occupation || !profileData.address) {
      return;
    }

    localStorage.setItem(profileDataKey, JSON.stringify(profileData));
    localStorage.setItem(profileCompletedKey, 'true');

    setShowCompleteProfile(false);

    if (typeof onProfileSave === 'function') {
      onProfileSave(profileData);
    }
  };

  return (
    <div className="p-6 pb-24 animate-in fade-in duration-300 bg-gray-50">
      <div className="flex flex-col items-center mb-10 pt-4">
        <div className="relative group mb-6">
          <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-xl overflow-hidden cursor-pointer transition-all bg-emerald-50">
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
                  reader.onload = (event) => onProfilePictureChange(event.target.result);
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

        <h2 className="text-2xl font-black text-gray-900">{user?.fullName ? user.fullName.split(' ')[0] : 'User'}</h2>
        <p className="text-sm font-bold uppercase tracking-widest mt-1 text-gray-500">{user?.membership || 'Nest Member'}</p>
        {user?.accountNumber && <p className="text-xs font-mono mt-2 text-gray-500">Account: {user.accountNumber}</p>}
      </div>


      <div className="space-y-2 mb-8">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`${item.color} w-11 h-11 rounded-xl flex items-center justify-center`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
      >
        Log Out
      </button>
    </div>
  );
}
