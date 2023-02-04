/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./view/**/*.ejs'],
  theme: {
    extend: {
      colors: {
        'primary-50': 'rgb(240 253 244)',
        'primary-100': 'rgb(220 252 231)',
        'primary-200': 'rgb(187 247 208)',
        'primary-300': 'rgb(134 239 172)',
        'primary-400': 'rgb(74 222 128)',
        'primary-500': 'rgb(34 197 94)',
        'primary-600': 'rgb(22 163 74)',
        'primary-700': 'rgb(21 128 61)',
        'primary-800': 'rgb(22 101 52)',
        'primary-900': 'rgb(20 83 45)',

        'secondary-50': 'rgb(240 253 244)',
        'secondary-100': 'rgb(220 252 231)',
        'secondary-200': 'rgb(187 247 208)',
        'secondary-300': 'rgb(134 239 172)',
        'secondary-400': 'rgb(74 222 128)',
        'secondary-500': 'rgb(34 197 94)',
        'secondary-600': 'rgb(22 163 74)',
        'secondary-700': 'rgb(21 128 61)',
        'secondary-800': 'rgb(22 101 52)',
        'secondary-900': 'rgb(20 83 45)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
};
