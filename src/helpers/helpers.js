export const formatCurrency = (amount) => {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
