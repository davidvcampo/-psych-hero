/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2E5C",
          800: "#2A458A",
          900: "#10203F",
        },
        parchment: {
          DEFAULT: "#F6F1E4",
          50: "#FBF8F1",
          100: "#F6F1E4",
          200: "#ECE3CC",
        },
        gold: {
          DEFAULT: "#C2A94E",
          light: "#DBC583",
          dark: "#967D34",
        },
        sky: {
          DEFAULT: "#A9C8EF",
          deep: "#5C82BE",
        },
        charcoal: "#22252B",
      },
      fontFamily: {
        display: ["var(--font-source-serif)", "Georgia", "serif"],
        body: ["var(--font-public-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "card-punch": "radial-gradient(circle, rgba(27,46,92,0.08) 0%, rgba(27,46,92,0.08) 60%, transparent 61%)",
      },
    },
  },
  plugins: [],
};