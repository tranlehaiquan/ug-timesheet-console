/** @type {import('tailwindcss').Config} */
let colors = {
  'transparent': 'transparent',
  'inherit': 'inherit',

  'blue-darker': '#0063b4',
  'blue-dark': '#0077d8',
  'blue': '#008cff',
  'blue-light': '#4baeff',
  'blue-lighter': '#cce8fe',
  'blue-lightest': '#e8f6ff',

  'grey': '#9aa2b2',
  'grey-light': '#d4d7de',
  'grey-lighter': '#e5e7ee',
  'grey-lightest': '#f3f5f9',

  'white': '#ffffff',
  'black/5': 'rgba(0,0,0,0.5)',
  'black/2': 'rgba(0,0,0,0.2)',

  'navy': '#223049',
  'navy-light': '#485875',
  'navy-lighter': '#6d7991',
  'navy-lightest': '#94a1B7',

  'teal-darker': '#0e7c70',
  'teal-dark': '#249387',
  'teal': '#3da499',
  'teal-light': '#72d3c9',
  'teal-lighter': '#d2f1ed',
  'teal-lightest': '#dcf4f1',

  'pink-darker': '#b03d7c',
  'pink-dark': '#b03d7c',
  'pink': '#cc619c',
  'pink-light': '#df8bb9',
  'pink-lighter': '#f5d3e6',
  'pink-lightest': '#f8ddec',

  'saphire-blue-darker': '#3975a0',
  'saphire-blue-dark': '#3975a0',
  'saphire-blue': '#5891ba',
  'saphire-blue-light': '#82b3d5',
  'saphire-blue-lighter': '#d0e5f3',
  'saphire-blue-lightest': '#daeaf5',

  'lime-green-darker': '#40710a',
  'lime-green-dark': '#609625',
  'lime-green': '#7cb342',
  'lime-green-light': '#a5d66f',
  'lime-green-lighter': '#ddf3c3',
  'lime-green-lightest': '#e4f6d0',

  'indigo-darker': '#132584',
  'indigo-dark': '#2137aa',
  'indigo': '#4352a8',
  'indigo-light': '#5e6fc7',
  'indigo-lighter': '#bac1ea',
  'indigo-lightest': '#cfd4f1',

  'seablue-darker': '#00679f',
  'seablue-dark': '#0079bb',
  'seablue': '#0288d1',
  'seablue-light': '#47acdb',
  'seablue-lighter': '#b3d9ed',
  'seablue-lightest': '#b6daee',

  'brown-darker': '#7e2e1b',
  'brown-dark': '#923b26',
  'brown': '#b85f4b',
  'brown-light': '#d57a66',
  'brown-lighter': '#f4c1b6',
  'brown-lightest': '#f7d4cc',

  'maroon-darker': '#47122e',
  'maroon-dark': '#5b2442',
  'maroon': '#713e5a',
  'maroon-light': '#8f5976',
  'maroon-lighter': '#ccafbf',
  'maroon-lightest': '#dfccd7',

  'rose-darker': '#862d42',
  'rose-dark': '#ac3a54',
  'rose': '#cb647c',
  'rose-light': '#d2798e',
  'rose-lighter': '#eac2cb',
  'rose-lightest': '#ecc6cf',

  'green-darker': '#1e8034',
  'green-dark': '#369a4c',
  'green': '#59b66e',
  'green-light': '#85d096',
  'green-lighter': '#d9f3e0',
  'green-lightest': '#ebf6ed',

  'red-darker': '#ac1307',
  'red-dark': '#c12f24',
  'red': '#d55248',
  'red-light': '#f77e75',
  'red-ligher': '#ffd1cd',
  'red-lightest': '#faeae9',

  'purple-darker': '#642fb3',
  'purple-dark': '#6e46a9',
  'purple': '#8d68c3',
  'purple-light': '#b193dc',
  'purple-ligher': '#e5d9f6',
  'purple-lightest': '#ebe3f8',

  'cyan-darker': '#047798',
  'cyan-dark': '#1a98bb',
  'cyan': '#3aa9ca',
  'cyan-light': '#5ebed9',
  'cyan-ligher': '#b6e4f1',
  'cyan-lightest': '#e2f4f9',

  'yellow-darker': '#b58603',
  'yellow-dark': '#d9a10b',
  'yellow': '#efb009',
  'yellow-light': '#f9dc5c',
  'yellow-ligher': '#fff5ca',
  'yellow-lightest': '#fff7d6',

  'orange-darker': '#a04c04',
  'orange-dark': '#ce660f',
  'orange': '#e3761c',
  'orange-light': '#ef954a',
  'orange-ligher': '#ffdcbf',
  'orange-lightest': '#fbeee3'
}

module.exports = {
  prefix: "sk-",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "xxs": ".625rem",
      },
      colors,
    },
  },
  plugins: [],
}
