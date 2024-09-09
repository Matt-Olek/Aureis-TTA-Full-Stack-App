import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },

  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#99ffb1",
          "primary-focus": "#4C266A",
          "primary-content": "#000000",

          secondary: "#fe98e4",
          "secondary-focus": "#7B5295",
          "secondary-content": "#ffffff",

          accent: "#fefefe",
          "accent-focus": "#9E7DB3",
          "accent-content": "#1c1917",

          neutral: "#1c1917",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",

          "base-100": "#121212",
          "base-200": "#1c1917",
          "base-300": "#292524",
          "base-content": "#ffffff",

          info: "#4C266A",
          success: "#009485",
          warning: "#ffb647",
          error: "#fe8662",

          "--rounded-box": "1rem",
          "--rounded-btn": ".5rem",
          "--rounded-badge": "1.9rem",

          "--animation-btn": ".25s",
          "--animation-input": ".2s",

          "--btn-text-case": "uppercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
