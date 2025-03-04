// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8a63d2',
          dark: '#645986',
        },
        dark: {
          bg: '#121212',
          card: '#252525',
          sidebar: '#171717',
          border: '#333333',
        },
        light: {
          bg: '#f5f5f5',
          card: '#ffffff',
          sidebar: '#f0f0f0',
          border: '#e5e5e5',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.300'),
            h1: { color: theme('colors.white') },
            h2: { color: theme('colors.white') },
            h3: { color: theme('colors.white') },
            h4: { color: theme('colors.white') },
            h5: { color: theme('colors.white') },
            h6: { color: theme('colors.white') },
            a: { color: theme('colors.primary.DEFAULT') },
            strong: { color: theme('colors.white') },
            code: { color: theme('colors.gray.300') },
            blockquote: { color: theme('colors.gray.400') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}