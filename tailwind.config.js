/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./view/**/*.ejs'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
};
