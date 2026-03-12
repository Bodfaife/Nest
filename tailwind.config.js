/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: "class", // important
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Darker grays for proper dark mode (like Facebook/WhatsApp)
        dark: {
          bg: '#0a0a0a',      // Near black background
          surface: '#1a1a1a',  // Dark surface
          border: '#2a2a2a',   // Dark border
          hover: '#2f2f2f',    // Dark hover state
        }
      }
    },
  },
  plugins: [],
};
