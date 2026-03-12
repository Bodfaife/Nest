import React, { useState } from 'react';
import { Globe, MapPin, Home } from 'lucide-react';

// Nigerian states list
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

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

  const handleSubmit = () => {
    if (!country || !state || !address.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({ country, state, address: address.trim() });
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
          {country === 'Nigeria' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                State
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A] text-gray-900"
                >
                  <option value="">Select a state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* State (for other countries) */}
          {country !== 'Nigeria' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                State / Province
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="text"
                  placeholder="Enter your state or province"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]"
                />
              </div>
            </div>
          )}

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
            <p className="text-xs text-gray-400 mt-1 ml-1">This helps with delivery and support</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="py-8 space-y-3">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
        >
          Complete Signup
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
