/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'color-lightest': 'var(--color-lightest)',
        'color-light': 'var(--color-light)',
        'color-dark': 'var(--color-dark)',
        'color-darkest': 'var(--color-darkest)',
        'color-hover': 'var(--color-hover)',
      }
    },
  },
  plugins: [],
}

