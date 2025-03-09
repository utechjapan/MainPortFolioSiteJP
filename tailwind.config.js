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
    {
      pattern: /^text-/,
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            maxWidth: '100%',
            lineHeight: 1.8,
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.dark'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.900'),
              fontWeight: '700',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.800'),
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.DEFAULT'),
              fontStyle: 'italic',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.light'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.white'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.DEFAULT'),
              color: theme('colors.gray.400'),
            },
            strong: {
              color: theme('colors.white'),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};