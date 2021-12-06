const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
      },
      backgroundImage: {
        decorative: "url('/img/decorative.jpeg')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
