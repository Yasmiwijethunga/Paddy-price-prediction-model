/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f7f0',
          100: '#d9edd9',
          200: '#b5d9b5',
          300: '#84be84',
          400: '#559d55',
          500: '#2D6A4F',
          600: '#1F4E2E',
          700: '#1a3f28',
          800: '#163322',
          900: '#0f2316',
        },
        amber: {
          400: '#F5A623',
          500: '#E8A020',
          600: '#d18f1a',
        },
        surface: '#F4F6F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
