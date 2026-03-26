import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#0A0A0A",
        charcoal: "#1A1A1A",
        "charcoal-light": "#252525",
        ivory: "#F5F1E9",
        "ivory-muted": "#EAE6DF",
        brass: "#C6A75E",
        "brass-light": "#D4AF37",
        "brass-muted": "rgba(198, 167, 94, 0.6)",
        silver: "#B0B0B0",
        champagne: "#F7E7CE",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-jost)", "Jost", "Helvetica Neue", "sans-serif"],
        editorial: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 5rem)", { lineHeight: "1.1", letterSpacing: "0.12em" }],
        "display-lg": ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "1.2", letterSpacing: "0.1em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.25", letterSpacing: "0.08em" }],
        "display-sm": ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.3", letterSpacing: "0.06em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "128": "32rem",
        "144": "36rem",
      },
      letterSpacing: {
        "luxury-wide": "0.25em",
        "luxury-wider": "0.35em",
        widest: "0.4em",
      },
      transitionDuration: {
        "400": "400ms",
        "700": "700ms",
        "1000": "1000ms",
      },
      boxShadow: {
        "brass-glow": "0 0 40px rgba(198, 167, 94, 0.15)",
        "brass-glow-hover": "0 0 60px rgba(198, 167, 94, 0.25)",
      },
      animation: {
        "zoom-slow": "zoom-slow 20s ease-out forwards",
      },
      keyframes: {
        "zoom-slow": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
      },
      aspectRatio: {
        "portrait-editorial": "3/4",
        "portrait-tall": "2/3",
      },
    },
  },
  plugins: [],
};

export default config;
