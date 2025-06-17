module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          600: '#660000', // VT Maroon
        },
        orange: {
          300: '#FF6B00', // VT Orange
        },
      },
    },
  },
  plugins: [],
}