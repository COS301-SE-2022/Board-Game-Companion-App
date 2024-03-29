const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname), './src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors:{
        'Pcolour1': '#00cf0e', 
        'Pcolour2': '#28662c',
        'Pcolour3': '#98d20b',
      }
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
};
