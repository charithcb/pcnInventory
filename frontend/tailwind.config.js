/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        accent: '#0f172a',
      },
      boxShadow: {
        card: '0 15px 30px -12px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
