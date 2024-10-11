module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        '96': '24rem', // Adding a custom height utility
        '120': '30rem', // Adding another custom height utility
      },
    },
  },
  plugins: [require('tailwindcss-unsplash')],
};
