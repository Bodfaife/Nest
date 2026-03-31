import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Mail, Phone, MapPin } from 'lucide-react';

const defaultProfileData = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  dob: '',
  gender: '',
  occupation: '',
  address: '',
  nextOfKin: '',
  nextOfKinPhone: '',
  bvn: '',
  nationalId: '',
  enable2FA: false,
};

export default function CompleteProfileScreen({ user, onBack, onUserChange }) {
  const userKey = (user?.email || user?.accountNumber || user?.phone || 'guest').toString().trim().toLowerCase();
  const profileCompletedKey = `profileCompleted:${userKey}`;
  const profileDataKey = `profileData:${userKey}`;

  const [completeProfileData, setCompleteProfileData] = useState(defaultProfileData);
  const [bvnVerified, setBvnVerified] = useState(false);
  const [nationalIdVerified, setNationalIdVerified] = useState(false);

  const verifyBVN = async (bvn) => {
    // Mock verification - in real app, call API
    if (bvn.length === 11 && /^\d+$/.test(bvn)) {
      // Simulate API call
      setTimeout(() => {
        setBvnVerified(true);
      }, 1000);
    } else {
      setBvnVerified(false);
    }
  };

  const verifyNationalId = async (id) => {
    // Mock verification
    if (id.length >= 8) {
      setTimeout(() => {
        setNationalIdVerified(true);
      }, 1000);
    } else {
      setNationalIdVerified(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(profileDataKey);
    if (saved) {
      try {
        setCompleteProfileData({ ...defaultProfileData, ...JSON.parse(saved) });
      } catch (e) {
        setCompleteProfileData(defaultProfileData);
      }
    }
  }, [profileDataKey]);

  const handleCompleteProfileSave = () => {
    if (!completeProfileData.dob || !completeProfileData.gender || !completeProfileData.occupation || !completeProfileData.address) {
      return;
    }
    localStorage.setItem(profileDataKey, JSON.stringify(completeProfileData));
    localStorage.setItem(profileCompletedKey, 'true');
    if (onUserChange) {
      onUserChange({ ...user, ...completeProfileData });
    }
    onBack();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white animate-in slide-in-from-right">
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-200">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Complete Your Profile</h1>
      </div>

      {/* Form */}
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Phone Number</label>
            <input
              type="tel"
              value={completeProfileData.phone}
              onChange={(e) => setCompleteProfileData({ ...completeProfileData, phone: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Date of Birth</label>
            <input
              type="date"
              value={completeProfileData.dob}
              onChange={(e) => setCompleteProfileData({ ...completeProfileData, dob: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50" />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Gender</label>
            <select
              value={completeProfileData.gender}
              onChange={(e) => setCompleteProfileData({ ...completeProfileData, gender: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Occupation</label>
            <input
              type="text"
              value={completeProfileData.occupation}
              onChange={(e) => setCompleteProfileData({ ...completeProfileData, occupation: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Address</label>
            <input
              type="text"
              value={completeProfileData.address}
              onChange={(e) => setCompleteProfileData({ ...completeProfileData, address: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Next of Kin</label>
            <input
              type="text"
              value={completeProfileData.nextOfKin}
              onChange={(e) => setCompleteProfileData({ ...completeProfileData, nextOfKin: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Next of Kin Phone</label>
            <input
              type="tel"
              value={completeProfileData.nextOfKinPhone}
              onChange={(e) => setCompleteProfileData({ ...completeProfileData, nextOfKinPhone: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">BVN</label>
            <input
              type="text"
              value={completeProfileData.bvn}
              onChange={(e) => {
                const value = e.target.value;
                setCompleteProfileData({ ...completeProfileData, bvn: value });
                if (value.length === 11) verifyBVN(value);
                else setBvnVerified(false);
              }}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            />
            {completeProfileData.bvn && (
              <p className={`text-xs mt-1 ${bvnVerified ? 'text-green-600' : 'text-red-600'}`}>
                {bvnVerified ? '✓ BVN verified' : '✗ Invalid BVN'}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">National ID</label>
            <input
              type="text"
              value={completeProfileData.nationalId}
              onChange={(e) => {
                const value = e.target.value;
                setCompleteProfileData({ ...completeProfileData, nationalId: value });
                if (value.length >= 8) verifyNationalId(value);
                else setNationalIdVerified(false);
              }}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            />
            {completeProfileData.nationalId && (
              <p className={`text-xs mt-1 ${nationalIdVerified ? 'text-green-600' : 'text-red-600'}`}>
                {nationalIdVerified ? '✓ National ID verified' : '✗ Invalid National ID'}
              </p>
            )}
          </div>

          <button
            onClick={handleCompleteProfileSave}
            className="w-full py-3 rounded-xl font-bold bg-[#00875A] text-white hover:bg-[#006f48] transition mt-6"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}