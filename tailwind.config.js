/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['"PP Neue Montreal"', 'sans-serif'],
        diatype:  ['ABC Diatype', 'sans-serif'],
        lausanne: ['"PP Neue Montreal"', 'sans-serif'],
        basier:   ['Basier', 'monospace'],
        abc:      ['ABCPlus', 'sans-serif'],
        presura:  ['GT Presura', 'monospace'],
      },
    },
  },
  plugins: [],
}
