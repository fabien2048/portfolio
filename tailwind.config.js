/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        diatype:  ['"ABC Diatype"', 'sans-serif'],
        lausanne: ['"Lausanne"', 'sans-serif'],
        monument: ['MonumentMono', 'monospace'],
      },
    },
  },
  plugins: [],
}
