/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./view/**/*.ejs'],
  theme: {
    extend: {
      colors: {
        '####GREEN####': '###GREEN###',
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
        '####INDIGO####': '###INDIGO###',
        'secondary-50': 'rgb(238 242 255)',
        'secondary-100': 'rgb(224 231 255)',
        'secondary-200': 'rgb(199 210 254)',
        'secondary-300': 'rgb(165 180 252)',
        'secondary-400': 'rgb(129 140 248)',
        'secondary-500': 'rgb(99 102 241)',
        'secondary-600': 'rgb(79 70 229)',
        'secondary-700': 'rgb(67 56 202)',
        'secondary-800': 'rgb(55 48 163)',
        'secondary-900': 'rgb(49 46 129)',
        '####BLUE####': '###BLUE###',
        'tertiary-50': 'rgb(239 246 255)',
        'tertiary-100': 'rgb(219 234 254)',
        'tertiary-200': 'rgb(191 219 254)',
        'tertiary-300': 'rgb(147 197 253)',
        'tertiary-400': 'rgb(96 165 250)',
        'tertiary-500': 'rgb(59 130 246)',
        'tertiary-600': 'rgb(37 99 235)',
        'tertiary-700': 'rgb(29 78 216)',
        'tertiary-800': 'rgb(30 64 175)',
        'tertiary-900': 'rgb(30 58 138)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
};
