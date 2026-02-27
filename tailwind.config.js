/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          600: '#0284c7',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        }
      },
      screens: {
        'print': {'raw': 'print'},
      }
    }
  },
  plugins: [],
}
