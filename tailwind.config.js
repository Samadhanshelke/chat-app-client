/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Adjust based on your folder structure
  theme: {
    extend: {
      keyframes: {
        'tooltip-appear': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'tooltip-appear': 'tooltip-appear 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
