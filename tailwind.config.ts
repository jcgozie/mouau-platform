import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1B4332",
          deep: "#0F2A20",
          light: "#2D5A45",
        },
        gold: {
          DEFAULT: "#C08A2E",
          light: "#D9A64E",
          dark: "#96691F",
        },
        soil: "#6B4226",
        paper: "#FBFAF6",
        ink: "#16211C",
        sage: {
          DEFAULT: "#D9E2D3",
          dim: "#EFF3EC",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-plex)", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
