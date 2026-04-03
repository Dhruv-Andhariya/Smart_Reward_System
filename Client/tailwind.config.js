/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f5ff",
          100: "#cceafe",
          200: "#99d6fd",
          300: "#66c1fc",
          400: "#33adfb",
          500: "#0098fa",
          600: "#007acc",
          700: "#005b99",
          800: "#003d66",
          900: "#001e33"
        },
        midnight: "#070f1d"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Sora", "sans-serif"]
      },
      boxShadow: {
        glass: "0 24px 60px rgba(0, 0, 0, 0.35)"
      }
    },
  },
  plugins: [],
}

