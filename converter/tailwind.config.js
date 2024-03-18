/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./dist/index.html",
    "./index.html"
  ],
  theme: {
    extend: { 
    },
  },
  plugins: [],
  purge: [
    "./index.html",
  ],
}

