/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orelega: ['"Orelega One"', "serif"],
        markazi: ['"Markazi Text"', "serif"],
      },
    },
  },
  plugins: [],
}
