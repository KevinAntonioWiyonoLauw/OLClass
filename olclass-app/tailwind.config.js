// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Pastikan semua file yang memerlukan Tailwind disertakan
  ],
  darkMode: 'class', // Mengaktifkan dark mode dengan strategi 'class'
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}