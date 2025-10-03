/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary1: '#781112',
        primary2: '#BC1F27',
        primary3: '#FFB302',
        primary4: '#DB9101',
        primary5: '#6E090C',
        maroon: '#800000',
        gold: '#FFD700',
      },
      backgroundImage: {
        'palette-gradient': 'linear-gradient(90deg, #781112, #BC1F27, #FFB302, #DB9101, #6E090C)',
      },
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
        'spin-vertical': 'spinVertical 1s ease-in-out', // 👈 vertical spin
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        spinVertical: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' }, // 👈 vertical rotation
        },
      },
    },
  },
  plugins: [],
};


