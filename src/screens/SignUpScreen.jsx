import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

export default function SignUpScreen({ onSignUp, onNavigateToSignIn, darkMode }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="h-full bg-white p-8 flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 pt-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#00875A] rounded-xl flex items-center justify-center text-white font-black text-xl">N</div>
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
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="email" 
                placeholder="faith@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pb-64">
        <button 
          onClick={() => onSignUp({ fullName, email, password })} 
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
