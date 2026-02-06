/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "neon-cyan": "#06b6d4",
        "neon-purple": "#8b5cf6",
        "neon-pink": "#ec4899",
        "neon-green": "#10b981",
        "neon-red": "#ef4444",

        "root-cyan": "#00F2FF",
        "root-purple": "#A74BCA",
        "root-fond": "#0D1744",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s infinite",
        glow: "glow 1.5s ease-in-out infinite alternate",
        "slide-up": "slide-up 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        glow: {
          from: {
            boxShadow: "0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4",
          },
          to: {
            boxShadow: "0 0 20px #06b6d4, 0 0 30px #06b6d4, 0 0 40px #06b6d4",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
