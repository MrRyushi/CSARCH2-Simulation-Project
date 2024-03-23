/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{html,js}",
    "./**/*.{html,js}"
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

