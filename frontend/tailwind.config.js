/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaf7",
          100: "#d2f2ea",
          200: "#a8e5d8",
          300: "#72d2c1",
          400: "#3fb7a6",
          500: "#249b8b",
          600: "#1f7c71",
          700: "#1d645c",
          800: "#1c514b",
          900: "#1b4340",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
