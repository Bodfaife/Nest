import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function AppAlert({ alert, onClose, darkMode = false }) {
  if (!alert) return null;
  const { type = 'info', title, message } = alert;

  const bg = type === 'success' ? (darkMode ? 'bg-emerald-800' : 'bg-emerald-50')
    : type === 'error' ? (darkMode ? 'bg-red-900' : 'bg-red-50')
    : (darkMode ? 'bg-gray-800' : 'bg-gray-50');

  const text = type === 'success' ? (darkMode ? 'text-emerald-200' : 'text-emerald-800')
    : type === 'error' ? (darkMode ? 'text-red-200' : 'text-red-700')
    : (darkMode ? 'text-gray-200' : 'text-gray-800');

  const icon = type === 'success' ? <CheckCircle size={18} className={type === 'success' ? 'text-emerald-500' : ''} />
    : type === 'error' ? <XCircle size={18} className="text-red-500" />
    : <Info size={18} className="text-gray-500" />;

  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), alert.timeout || 3500);
    return () => clearTimeout(t);
  }, [alert, onClose]);

  // position: allow top or bottom banners. Default is bottom for general alerts
  const positionClass = alert.position === 'top' ? 'top-4' : 'bottom-8';
  const animationClass = alert.position === 'top' ? 'animate-in slide-in-from-top duration-300' : 'animate-in slide-in-from-bottom duration-300';

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 ${positionClass} z-50 w-[92%] max-w-2xl rounded-xl shadow-lg border ${bg} ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${animationClass}`}>
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          {title && <div className={`font-bold ${text}`}>{title}</div>}
          {message && <div className={`text-sm mt-1 ${text}`}>{message}</div>}
        </div>
        <button onClick={() => onClose && onClose()} className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
