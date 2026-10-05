import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        surface: {
          DEFAULT: "rgba(18, 20, 29, 0.7)",
          solid: "#12141d",
          hover: "rgba(28, 31, 46, 0.8)",
          active: "rgba(35, 39, 58, 0.9)",
        },
        accent: {
          blue: "#38bdf8",
          indigo: "#6366f1",
          violet: "#a855f7",
        },
      },
      animation: {
        "mesh-pulse": "meshPulse 20s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "shimmer-slide": "shimmerSlide 2s linear infinite",
      },
      keyframes: {
        meshPulse: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)", opacity: "0.45" },
          "50%": { transform: "translate3d(5%, 4%, 0) scale(1.08)", opacity: "0.6" },
        },
        shimmerSlide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
