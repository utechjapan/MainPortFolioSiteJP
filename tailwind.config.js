// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8a63d2",
          dark: "#645986",
        },
        dark: {
          bg: "#121212",
          card: "#252525",
          sidebar: "#171717",
          border: "#333333",
        },
        light: {
          bg: "#f5f5f5",
          card: "#ffffff",
          sidebar: "#f0f0f0",
          border: "#e5e5e5",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: { color: theme("colors.primary.DEFAULT") },
            strong: { color: theme("colors.gray.800") },
            code: { color: theme("colors.gray.700") },
            blockquote: { color: theme("colors.gray.600") },
            h1: { color: theme("colors.gray.900") },
            h2: { color: theme("colors.gray.900") },
            h3: { color: theme("colors.gray.900") },
            h4: { color: theme("colors.gray.900") },
          },
        },
        dark: {
          css: {
            color: theme("colors.gray.300"),
            a: { color: theme("colors.primary.DEFAULT") },
            strong: { color: theme("colors.white") },
            code: { color: theme("colors.gray.300") },
            blockquote: { color: theme("colors.gray.400") },
            h1: { color: theme("colors.white") },
            h2: { color: theme("colors.white") },
            h3: { color: theme("colors.white") },
            h4: { color: theme("colors.white") },
            h5: { color: theme("colors.white") },
            h6: { color: theme("colors.white") },
          },
        },
      }),
      transitionProperty: {
        theme:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
      },
      transitionDuration: {
        300: "300ms",
        500: "500ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ addVariant }) {
      addVariant("dark", ".dark &");
    },
  ],
  safelist: [
    "text-white",
    "text-gray-900",
    "dark:text-white",
    "dark:text-gray-300",
    "bg-light-card",
    "dark:bg-dark-card",
    "text-gray-700",
    "dark:text-gray-400",
    "text-gray-600",
    "transition-colors",
  ],
};
