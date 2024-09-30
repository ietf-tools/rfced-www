/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      fontFamily: {
        sans: '"Inter", sans-serif'
      },
      colors: {
        blue: {
          100: '#50B2DF',
          200: '#0B8CC5',
          300: '#1C62B6',
          400: '#18539B',
          900: '#002D3C',
          950: '#00101C'
        },
        yellow: {
          400: '#FFD13E',
          750: '#A78201'
        }
      }
    }
  }
}
