/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Grayscale theme
        background: '#0A0A0A',
        card: '#141414',
        elevated: '#1A1A1A',
        border: '#2A2A2A',
        primary: '#FFFFFF',
        secondary: '#A0A0A0',
        tertiary: '#6B6B6B',
        muted: '#404040',
      }
    },
  },
  plugins: [],
}