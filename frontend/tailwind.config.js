/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#646cff",
        secondary: "#535bf2",
        'vt': {
          maroon: '#861F41',
          orange: '#E87722',
          'maroon-dark': '#6E1A36',
          'orange-dark': '#C26B1E'
        }
      },
    },
  },
  plugins: [],
} 