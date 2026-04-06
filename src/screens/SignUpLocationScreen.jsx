import React, { useState } from 'react';
import { Globe, MapPin, Home } from 'lucide-react';
import { supabase, fetchProfileByPhone } from "../lib/supabase";

// State/province lists per country
const STATES_BY_COUNTRY = {
  Nigeria: [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ],
  Ghana: ['Greater Accra', 'Ashanti', 'Northern', 'Eastern', 'Volta', 'Central', 'Western'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu'],
  'South Africa': ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape'],
  Uganda: ['Central', 'Western', 'Eastern', 'Northern'],
  Tanzania: ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza'],
  Cameroon: ['Centre', 'Littoral', 'West', 'Northwest', 'Southwest'],
  Senegal: ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor'],
  Zambia: ['Lusaka', 'Copperbelt', 'Southern', 'Eastern'],
  Zimbabwe: ['Harare', 'Bulawayo', 'Mashonaland West', 'Matabeleland South']
};

const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Uganda',
  'Tanzania',
  'Cameroon',
  'Senegal',
  'Zambia',
  'Zimbabwe'
];

export default function SignUpLocationScreen({ onSubmit, onBack }) {
  const [country, setCountry] = useState('Nigeria');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!country || !state || !address.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    // retrieve pending data (includes password)
    const signupPendingRaw = localStorage.getItem('signupPending');
    if (!signupPendingRaw) {
      alert('Signup data lost. Please start over.');
      setLoading(false);
      return;
    }
    const signupData = JSON.parse(signupPendingRaw);
    const email = signupData.email;
    const password = signupData.password;
    const fullName = signupData.fullName;

    try {
      if (signupData.phone) {
        const { data: existingPhone, error: phoneErr } = await fetchProfileByPhone(signupData.phone);
        if (phoneErr) throw phoneErr;
        if (existingPhone) {
          const { showAppAlert } = await import('../lib/appAlert');
          showAppAlert({
            type: 'error',
            message: 'This phone number is already registered. Use a different number or sign in.',
          });
          setLoading(false);
          return;
        }
      }

      // call Supabase to create account and send confirmation email
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}?flow=signup-verify`,
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
    } catch (e) {
      const { showAppAlert } = await import('../lib/appAlert');
      showAppAlert({ type: 'error', message: e.message || 'Failed to create account' });
      setLoading(false);
      return;
    }

    // proceed with existing location handling via parent
    await onSubmit({ country, state, address: address.trim() });
    setLoading(false);
  };

  return (
    <div className="h-full bg-white p-8 flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 pt-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img
            src="/Nest logo.png"
            alt="Nest Logo"
            className="w-10 h-10 rounded-xl"
          />
          <span className="text-2xl font-black text-emerald-900 tracking-tight">
            Nest.
          </span>
        </div>

        {/* Header */}
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Your Location
        </h2>
        <p className="text-gray-400 mb-10 font-medium">
          Help us know where you are. This information helps with personalization.
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Country */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState(''); // Reset state when country changes
                }}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A] text-gray-900"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* State (Nigeria-specific) */}
          {(() => {
            const list = STATES_BY_COUNTRY[country] || [];
            return (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  {list.length > 0 ? 'State / Province' : 'State / Province'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  {list.length > 0 ? (
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A] text-gray-900"
                    >
                      <option value="">Select a state</option>
                      {list.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter your state or province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]"
                    />
                  )}
                </div>
              </div>
            );
          })()}


          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Home Address
            </label>
            <div className="relative">
              <Home className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
              <textarea
                placeholder="Enter your home address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A] resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="py-8 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Complete Signup'}
        </button>

        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl font-bold text-[#00875A] bg-emerald-50 border border-emerald-100 active:scale-[0.98] transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}
