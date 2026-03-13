import React, { useState } from 'react';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { supabase } from "../lib/supabase";

function validatePassword(pw) {
  if (!pw) return '';
  if (pw.length < 6) return 'Password must be at least 6 characters.';
  if (!/[A-Z]/.test(pw)) return 'Include at least one uppercase letter.';
  if (!/[a-z]/.test(pw)) return 'Include at least one lowercase letter.';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Include at least one symbol.';
  return '';
}

function validatePhone(phone) {
  if (!phone) return 'Phone number is required.';
  // Nigerian phone format: 080, 081, 090, 091, 070, etc.
  const phoneRegex = /^(\+234|0)[789]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Enter a valid Nigerian phone number (11 digits starting with 0 or 234).';
  }
  return '';
}

export default function SignUpScreen({ onSignUp, onNavigateToSignIn, onProceedToLocation }) {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);
  // loading used only to disable button briefly, not to indicate account creation
  const [loading, setLoading] = useState(false);

  const passwordWarning = touched ? validatePassword(password) : '';
  const confirmWarning =
    touched && confirmPassword && password !== confirmPassword
      ? 'Passwords do not match.'
      : '';
  const phoneWarning = touched ? validatePhone(phone) : '';

  function handleSignUp() {
    setTouched(true);

    if (!fullName || !contact || !phone || !password || !confirmPassword) return;
    if (passwordWarning || confirmWarning || phoneWarning) return;

    setLoading(true);
    // quickly store interim data and move to part 2
    const email = contact.trim().toLowerCase();
    const cleanPhone = phone.replace(/\s/g, '');

    localStorage.setItem('signupPending', JSON.stringify({
      fullName,
      email,
      phone: cleanPhone,
      password,
      createdAt: Date.now()
    }));

    // small timeout so loading spinner is visible briefly
    setTimeout(() => {
      setLoading(false);
      if (onProceedToLocation) {
        onProceedToLocation({ fullName, email, phone: cleanPhone });
      } else if (onSignUp) {
        onSignUp({ fullName, email });
      }
    }, 200);
  }

  return (
    <div className="h-full bg-white p-8 flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 pt-12">
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
          Create Account
        </h2>
        <p className="text-gray-400 mb-10 font-medium">
          Step 1: Your Details
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="email"
                placeholder="john@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="tel"
                placeholder="080 1234 5678"
                value={phone}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  if (cleaned.length <= 11) {
                    setPhone(cleaned);
                  }
                }}
                onBlur={() => setTouched(true)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]"
              />
            </div>
            {phoneWarning && (
              <div className="text-xs text-red-500 mt-1 ml-1">{phoneWarning}</div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]"
              />
            </div>
            {passwordWarning && (
              <div className="text-xs text-red-500 mt-1 ml-1">{passwordWarning}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]"
              />
            </div>
            {confirmWarning && (
              <div className="text-xs text-red-500 mt-1 ml-1">{confirmWarning}</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="py-8">
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          Continue
        </button>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?
          <span
            onClick={onNavigateToSignIn}
            className="text-[#00875A] font-black ml-2 cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}