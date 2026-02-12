import React from "react";

export default function CreateSavingsPromptScreen({ onCreate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12 font-['Plus_Jakarta_Sans',_sans-serif]">
      <img src="/Nest logo.png" alt="Nest Logo" className="w-12 h-12 mb-6 rounded-xl" />
      <h2 className="text-2xl font-black text-emerald-900 mb-2">Create Your First Savings</h2>
      <p className="text-gray-500 mb-6 text-center max-w-xs">Start your journey to financial freedom. Create a savings plan to begin.</p>
      <button onClick={onCreate} className="w-full max-w-xs py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all mt-2">
        Create Savings
      </button>
    </div>
  );
}
