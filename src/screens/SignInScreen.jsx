import React, { useState } from 'react';
import { Eye, Mail } from 'lucide-react';
import api from '../helpers/apiClient';

export default function SignInScreen({ onSignIn, onNavigateToSignUp, onNavigateToForgotPassword, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full bg-white p-8 flex flex-col animate-in fade-in duration-500">
      <div className="flex-1 pt-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/Nest logo.png" alt="Nest Logo" className="w-10 h-10 rounded-xl" />
          <span className="text-2xl font-black text-emerald-900 tracking-tight">Nest.</span>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome.</h2>
        <p className="text-gray-400 mb-10 font-medium">Please sign in to your account.</p>

        {/* Inputs */}
        <div className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email or Phone</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                placeholder="email@example.com or 08012345678" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]" 
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A]" 
              />
              <Eye 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 cursor-pointer" 
                onClick={() => setShowPassword(!showPassword)} 
              />
            </div>
            <p 
              onClick={onNavigateToForgotPassword}
              className="text-right text-xs font-bold text-[#00875A] pt-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              Forgot Password?
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pb-4">
        <button 
          onClick={async () => {
            try {
              const identifier = (email || '').toString().trim();
              const data = await api.login(identifier, password);
              const token = data.accessToken || localStorage.getItem('accessToken');
              if (!token) throw new Error('No token received');
              const user = await api.getMe(token);
              if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                onSignIn(user);
              }
            } catch (e) {
              alert('Invalid credentials or server error');
              setPassword('');
            }
          }} 
          className="w-full py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
        >
          Sign In
        </button>
        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account? 
          <span 
            onClick={onNavigateToSignUp} 
            className="text-[#00875A] font-black ml-2 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
