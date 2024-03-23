/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{html,js}",
    "./**/*.{html,js}",
    './index.html'
  ],
  theme: {
    extend: { 
        width: {
            "inputWidth": '59%'
        }
    },
  },
  plugins: []
}

