/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'race-dark': '#0a0a0c',
        'race-panel': '#151518',
        'race-panel-light': '#1e1e24',
        'race-accent': '#ff1e1e',
        'safe': '#00e676',
        'warning': '#ffea00',
        'danger': '#ff1744'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
