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
          DEFAULT: "#1B2A4A",
          800: "#233457",
          900: "#141F38",
        },
        parchment: {
          DEFAULT: "#F6F1E4",
          50: "#FBF8F1",
          100: "#F6F1E4",
          200: "#ECE3CC",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E0C15C",
          dark: "#9A7B18",
        },
        sky: {
          DEFAULT: "#A7C4E0",
          deep: "#5F86B3",
        },
        charcoal: "#22252B",
      },
      fontFamily: {
        display: ["var(--font-source-serif)", "Georgia", "serif"],
        body: ["var(--font-public-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "card-punch": "radial-gradient(circle, rgba(27,42,74,0.08) 0%, rgba(27,42,74,0.08) 60%, transparent 61%)",
      },
    },
  },
  plugins: [],
};
