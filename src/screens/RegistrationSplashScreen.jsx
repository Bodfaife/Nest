import React, { useEffect, useState } from "react";

export default function RegistrationSplashScreen({ user, onDone }) {
  const [step, setStep] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    // Generate unique 10-digit account number
    if (!accountNumber) {
      setAccountNumber(
        Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("")
      );
    }
    const steps = [
      { text: "Registering account...", delay: 4000 },
      { text: "Creating account...", delay: 4000 },
      { text: `Welcome to Nest, ${user?.fullName?.split(" ")[0] || "User"}!\nYour Nest account number is\n${accountNumber}` }
    ];
    if (step < steps.length - 1) {
      const timeout = setTimeout(() => setStep(step + 1), steps[step].delay);
      return () => clearTimeout(timeout);
    } else if (step === steps.length - 1) {
      // Show last step for 30s then continue
      const timeout = setTimeout(() => onDone(accountNumber), 10000);
      return () => clearTimeout(timeout);
    }
  }, [step, user, accountNumber, onDone]);

  const steps = [
    "Registering account...",
    "Creating account...",
    `Welcome to Nest, ${user?.fullName?.split(" ")[0] || "User"}!\nYour Nest account number is\n${accountNumber}`
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12 font-['Plus_Jakarta_Sans',_sans-serif]">
      <img src="/Nest logo.png" alt="Nest Logo" className="w-16 h-16 mb-8 rounded-xl" />
      <div className="text-2xl font-black text-emerald-900 text-center whitespace-pre-line animate-pulse">
        {steps[step]}
      </div>
    </div>
  );
}
