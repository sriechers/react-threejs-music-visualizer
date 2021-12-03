const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = defaultTheme.fontFamily;
fontFamily['sans'] = ["'Lato'", 'Helvetica', 'Arial', 'sans-serif']

module.exports = {         
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',  
  theme: {
    fontFamily: fontFamily,
    extend: {
      colors: {
        black: '#0F1010',
        "dark-gray": "#181a1a",
        primary: '#f71e4d'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
