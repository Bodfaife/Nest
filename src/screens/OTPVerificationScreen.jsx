import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Mail, CheckCircle, AlertCircle, Loader } from "lucide-react";

const OTPVerificationScreen = ({ 
  onBack, 
  onVerify, 
  email = "user@example.com",
  darkMode = false,
  onResendOTP = null 
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef(null);

  // Auto-focus OTP input
  useEffect(() => {
    otpInputRef.current?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
    
    // Auto-submit if 6 digits entered
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const handleVerify = async (otpValue = otp) => {
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP code");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate API verification (in real app, verify with backend)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if OTP is correct (in real app, verify with backend)
      // For demo, any 6-digit code works, but show success animation
      setSuccess(true);
      
      // Call the onVerify callback after animation
      setTimeout(() => {
        onVerify && onVerify(otpValue);
      }, 1500);
    } catch (err) {
      setError(err.message || "OTP verification failed. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown === 0) {
      setOtp("");
      setError("");
      setSuccess(false);
      setResendCooldown(60);
      onResendOTP && onResendOTP();
    }
  };

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const inputBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200";
  const secondaryText = darkMode ? "text-gray-400" : "text-gray-500";
  const errorColor = darkMode ? "text-red-400" : "text-red-600";
  const successColor = darkMode ? "text-emerald-400" : "text-emerald-600";
  const buttonBg = darkMode ? "bg-[#00FF9D] text-gray-900" : "bg-[#00875A] text-white";
  const buttonDisabledBg = "bg-gray-400 cursor-not-allowed text-white";

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right transition-all duration-300`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 flex items-center gap-3 p-6 border-b ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-full transition-all ${
            darkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verify Your Email</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Icon */}
        <div className={`p-4 rounded-full mb-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <Mail
            size={32}
            className={success ? successColor : darkMode ? "text-blue-400" : "text-blue-600"}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3">Verify Your Email</h2>

        {/* Subtitle */}
        <p className={`text-center mb-2 ${secondaryText}`}>
          We've sent a 6-digit code to
        </p>
        <p className="text-center font-semibold mb-8">{email}</p>

        {/* OTP Input */}
        <div className="w-full max-w-md mb-6">
          <label className={`block text-sm font-bold mb-3 ${secondaryText}`}>
            Enter OTP Code
          </label>
          <input
            ref={otpInputRef}
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={handleOTPChange}
            disabled={isVerifying || success}
            placeholder="000000"
            maxLength="6"
            className={`w-full p-4 text-center text-4xl font-bold tracking-[0.5em] rounded-2xl border-2 outline-none transition-all ${
              inputBg
            } ${
              success
                ? `${darkMode ? "border-emerald-500 bg-emerald-500/10" : "border-emerald-500 bg-emerald-50"}`
                : error
                ? `${darkMode ? "border-red-500 bg-red-500/10" : "border-red-500 bg-red-50"}`
                : `${darkMode ? "border-gray-700 focus:border-blue-500" : "border-gray-200 focus:border-blue-500"}`
            } ${isVerifying || success ? "opacity-70" : ""}`}
          />
          {error && (
            <div className={`flex items-center gap-2 mt-3 ${errorColor}`}>
              <AlertCircle size={16} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className={`flex items-center gap-2 mt-3 ${successColor} animate-pulse`}>
              <CheckCircle size={16} />
              <p className="text-sm font-medium">OTP verified successfully!</p>
            </div>
          )}
        </div>

        {/* Resend OTP */}
        <div className="w-full max-w-md text-center mb-8">
          <p className={`text-sm ${secondaryText} mb-3`}>
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Didn't receive the code?"}
          </p>
          <button
            onClick={handleResendOTP}
            disabled={resendCooldown > 0}
            className={`w-full py-3 rounded-2xl font-bold transition-all ${
              resendCooldown > 0
                ? `${darkMode ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-500"} cursor-not-allowed`
                : `${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`
            }`}
          >
            Resend OTP
          </button>
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={otp.length !== 6 || isVerifying || success}
          className={`w-full max-w-md py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            otp.length === 6 && !isVerifying && !success
              ? `${buttonBg} active:scale-95 shadow-lg`
              : buttonDisabledBg
          }`}
        >
          {isVerifying && <Loader size={20} className="animate-spin" />}
          {isVerifying ? "Verifying OTP..." : success ? "Verified ✓" : "Verify OTP"}
        </button>

        {/* Info Box */}
        <div
          className={`w-full max-w-md mt-8 p-4 rounded-2xl text-sm ${
            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"
          }`}
        >
          <p>
            OTP codes are valid for 10 minutes. If you don't receive the code, check
            your spam folder or request a new one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationScreen;
