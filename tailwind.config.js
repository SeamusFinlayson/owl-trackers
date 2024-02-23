/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    screens: {
      "not-tiny": "440px",
    },
    extend: {
      colors: {
        default: {
          DEFAULT: "#dde1ee",
          dark: "#222639",
        },
        paper: {
          DEFAULT: "#f1f3f9",
          dark: "#3d4051",
        },
        text: {
          primary: {
            DEFAULT: "rgba(0, 0, 0, 0.87)",
            dark: "rgb(255, 255, 255)",
          },
          secondary: {
            DEFAULT: "rgba(0, 0, 0, 0.6)",
            dark: "rgb(255, 255, 255, 0.7)",
          },
          disabled: {
            DEFAULT: "rgba(0, 0, 0, 0.38)",
            dark: "rgb(255, 255, 255, 0.5)",
          }
        }
      }
    },
  },
  plugins: [],
  darkMode: "class"
};
