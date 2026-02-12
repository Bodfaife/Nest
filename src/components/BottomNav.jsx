import { Home, Wallet, User } from "lucide-react"; // removed Target and CreditCard

export default function BottomNav({ active, setActive, darkMode }) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "savings", icon: Wallet, label: "Savings" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 flex justify-around py-3 z-50 border-t transition-colors
      ${darkMode
        ? "bg-gray-900 border-gray-700 text-gray-100"
        : "bg-white border-gray-200 text-gray-900"}`}
    >
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className={`flex flex-col items-center text-xs ${
            active === id
              ? darkMode ? "text-teal-400" : "text-teal-600"
              : "text-gray-400 dark:text-gray-400"
          }`}
        >
          <Icon size={22} />
          {label}
        </button>
      ))}
    </div>
  );
}
