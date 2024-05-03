/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      "not-tiny": "440px",
    },
    extend: {
      transitionProperty: {
        height: "height",
        // padding: "padding",
      },
      colors: {
        tracker: {
          light: {
            fuchsia: "rgb(202, 145, 213)",
            pink: "rgb(214, 133, 174)",
            red: "rgb(219, 119, 119)",
            orange: "rgb(214, 142, 104)",
            yellow: "rgb(197, 173, 120)",
            lime: "rgb(158, 174, 142)",
            emerald: "rgb(104, 191, 163)",
            cyan: "rgb(137, 181, 191)",
            blue: "rgb(154, 177, 211)",
          },
        },
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
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
