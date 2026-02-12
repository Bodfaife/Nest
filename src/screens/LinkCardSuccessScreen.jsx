import React from "react";
import { CheckCircle } from "lucide-react";

const LinkCardSuccessScreen = ({ onDone, darkMode }) => {
  return (
    <div className={`h-full flex flex-col items-center justify-center animate-in slide-in-from-right duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}> 
      <CheckCircle size={64} className="text-emerald-500 mb-6" />
      <h1 className="text-2xl font-black mb-2">Card Linked Successfully!</h1>
      <p className="text-center text-sm mb-8">Your card has been securely linked and saved. You can now use it for deposits and payments.</p>
      <button
        onClick={onDone}
        className="w-full max-w-xs py-4 rounded-2xl font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
      >
        Continue
      </button>
    </div>
  );
};

export default LinkCardSuccessScreen;
