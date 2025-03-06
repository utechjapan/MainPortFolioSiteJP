// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  // Safelist any class starting with fa, fas, fab, far, etc.
  safelist: [
    {
      pattern: /^(fa|fas|fab|far|fal|fad)-/,
    },
  ],
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
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
