// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // pastikan sesuai struktur project-mu
  ],
  theme: {
    extend: {},
  },
  darkMode: false, // ⛔ Nonaktifkan dark mode sepenuhnya
  plugins: [],
}