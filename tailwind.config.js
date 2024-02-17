/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "not-tiny": "440px",
    },
    extend: {
    },
  },
  plugins: [],
  darkMode: "class"
};
