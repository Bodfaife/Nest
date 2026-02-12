
import React, { useState } from 'react';
import { User, Mail, Phone, Lock } from 'lucide-react';

function validatePassword(pw) {
  if (!pw) return '';
  if (pw.length < 6) return 'Password must be at least 6 characters.';
  if (!/[A-Z]/.test(pw)) return 'Include at least one uppercase letter.';
  if (!/[a-z]/.test(pw)) return 'Include at least one lowercase letter.';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Include at least one symbol.';
  return '';
}

export default function SignUpScreen({ onSignUp, onNavigateToSignIn, darkMode }) {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState('email');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);

  const passwordWarning = touched ? validatePassword(password) : '';
  const confirmWarning = touched && confirmPassword && password !== confirmPassword ? 'Passwords do not match.' : '';

  function handleContactChange(e) {
    const val = e.target.value;
    setContact(val);
    if (/^\d{7,}$/.test(val.replace(/\D/g, ''))) {
      setContactType('phone');
    } else {
      setContactType('email');
    }
  }

  function handleSignUp() {
    setTouched(true);
    if (!fullName || !contact || !password || !confirmPassword) return;
    if (passwordWarning || confirmWarning) return;
    onSignUp({ fullName, [contactType]: contact, password });
  }

  return (
    <div className="h-full bg-white p-8 flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 pt-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/Nest logo.png" alt="Nest Logo" className="w-10 h-10 rounded-xl" />
          <span className="text-2xl font-black text-emerald-900 tracking-tight">Nest.</span>
        </div>

        {/* Header */}
        <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-400 mb-10 font-medium">Join the Nest family today.</p>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                placeholder="Faith Bode" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email or Phone Number</label>
            <div className="relative">
              {contactType === 'email' ? (
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              ) : (
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              )}
              <input 
                type="text" 
                placeholder="faith@example.com or 08012345678" 
                value={contact}
                onChange={handleContactChange}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]" 
              />
            </div>
            {passwordWarning && <div className="text-xs text-red-500 mt-1 ml-1">{passwordWarning}</div>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]" 
              />
            </div>
            {confirmWarning && <div className="text-xs text-red-500 mt-1 ml-1">{confirmWarning}</div>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pb-4">
        <button 
          onClick={handleSignUp} 
          className="w-full py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
        >
          Get Started
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
