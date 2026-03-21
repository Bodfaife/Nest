import React, { useState, useEffect } from "react";
import { User, History, LogOut, Bell, Shield, Wallet, Download, Building2, Camera } from "lucide-react";

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

  const [showCompleteProfile, setShowCompleteProfile] = useState(true);
  const [profileData, setProfileData] = useState(defaultProfileData);

  useEffect(() => {
    const storedCompleted = localStorage.getItem(profileCompletedKey);
    setShowCompleteProfile(storedCompleted !== 'true');

    const storedProfile = localStorage.getItem(profileDataKey);
    const parsed = safeParse(storedProfile, null);
    if (parsed) {
      setProfileData({ ...defaultProfileData, ...parsed });
    } else {
      setProfileData(defaultProfileData);
    }
  }, [profileDataKey, profileCompletedKey]);

  const menuItems = [
    { icon: User, label: "Personal Information", color: "bg-emerald-50 text-emerald-600", action: () => setProfileSection("personal") },
    { icon: Bell, label: "Notifications", color: "bg-blue-50 text-blue-600", action: () => setProfileSection("notifications") },
    { icon: Shield, label: "Security & Privacy", color: "bg-purple-50 text-purple-600", action: () => setProfileSection("security") },
    { icon: Wallet, label: "Saved Cards", color: "bg-orange-50 text-orange-600", action: () => setProfileSection("cards") },
    { icon: Building2, label: "Bank Accounts", color: "bg-pink-50 text-pink-600", action: () => setProfileSection("accounts") },
    { icon: History, label: "Transaction History", color: "bg-gray-100 text-gray-600", action: () => setProfileSection("history") },
    { icon: Download, label: "Download Statement", color: "bg-indigo-50 text-indigo-600", action: () => setProfileSection("statement") },
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

      {showCompleteProfile && (
        <div className="p-6 rounded-2xl mb-6 bg-white border border-gray-100">
          <h3 className="text-lg font-black mb-4 text-gray-900">Complete Your Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date of Birth</label>
              <input type="date" value={profileData.dob} onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
              <select value={profileData.gender} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Occupation</label>
              <input type="text" value={profileData.occupation} onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="e.g. Student, Engineer" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
              <input type="text" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="Your address" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Next of Kin</label>
              <input type="text" value={profileData.nextOfKin} onChange={(e) => setProfileData({ ...profileData, nextOfKin: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Bank Verification Number</label>
              <input type="text" value={profileData.bvn} onChange={(e) => setProfileData({ ...profileData, bvn: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">National Identification Number</label>
              <input type="text" value={profileData.nationalId} onChange={(e) => setProfileData({ ...profileData, nationalId: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={profileData.enable2FA} onChange={(e) => setProfileData({ ...profileData, enable2FA: e.target.checked })} className="w-5 h-5" />
              <label className="text-sm font-bold">Enable Two-Factor Authentication</label>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Username</label>
              <input type="text" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="Display name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">State</label>
              <input type="text" value={profileData.state} onChange={(e) => setProfileData({ ...profileData, state: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Local Government Area</label>
              <input type="text" value={profileData.lga} onChange={(e) => setProfileData({ ...profileData, lga: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Religion</label>
              <input type="text" value={profileData.religion} onChange={(e) => setProfileData({ ...profileData, religion: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Relationship Status</label>
              <select value={profileData.relationshipStatus} onChange={(e) => setProfileData({ ...profileData, relationshipStatus: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50">
                <option value="">Select</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Number of Children</label>
              <input type="number" value={profileData.numberOfChildren} onChange={(e) => setProfileData({ ...profileData, numberOfChildren: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Country of Residence</label>
              <input type="text" value={profileData.countryOfResidence} onChange={(e) => setProfileData({ ...profileData, countryOfResidence: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Street Address of Residence</label>
              <input type="text" value={profileData.streetAddress} onChange={(e) => setProfileData({ ...profileData, streetAddress: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">City of Residence</label>
              <input type="text" value={profileData.cityOfResidence} onChange={(e) => setProfileData({ ...profileData, cityOfResidence: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Level of Education</label>
              <select value={profileData.levelOfEducation} onChange={(e) => setProfileData({ ...profileData, levelOfEducation: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50">
                <option value="">Select</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
                <option value="postgraduate">Postgraduate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Employment Status</label>
              <select value={profileData.employmentStatus} onChange={(e) => setProfileData({ ...profileData, employmentStatus: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50">
                <option value="">Select</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Source of Funds</label>
              <input type="text" value={profileData.sourceOfFunds} onChange={(e) => setProfileData({ ...profileData, sourceOfFunds: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Interests</label>
              <textarea value={profileData.interests} onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="What do you enjoy?" rows="3" />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full mt-6 py-3 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
          >
            Complete Profile
          </button>
        </div>
      )}

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
