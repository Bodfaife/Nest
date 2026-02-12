import React, { createContext, useContext, useState, useEffect } from 'react';

// Define context
const CurrencyContext = createContext();

// Provider component
export const CurrencyProvider = ({ children }) => {
  // Load saved currency from localStorage or default to NGN
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('appCurrency') || 'NGN';
  });

  // Update localStorage whenever currency changes
  const setCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('appCurrency', newCurrency);
  };

  // Map currency codes to signs
  const currencySymbols = {
    USD: '$',
    NGN: '₦',
    EUR: '€',
  };

  // Format amounts based on selected currency
  const formatAmount = (amount) => {
    const sign = currencySymbols[currency] || '';
    return `${sign}${Number(amount).toLocaleString()}`;
  };

  const currencySymbol = currencySymbols[currency] || '₦';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook for easier consumption
export const useCurrency = () => useContext(CurrencyContext);
