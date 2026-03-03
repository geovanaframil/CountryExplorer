/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "ce-background": "#020617",
        "ce-surface": "#020617",
        "ce-surface-elevated": "#020617",
        "ce-accent": "#22c55e",
        "ce-accent-soft": "rgba(34, 197, 94, 0.12)",
        "ce-text-main": "#e5e7eb",
        "ce-text-muted": "#64748b",
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Roboto", "sans-serif"],
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "spin-slower": "spin-slow 40s linear infinite",
        "float-soft": "float-soft 6s ease-in-out infinite",
        blink: "blink 1.2s ease-in-out infinite",
      },
      boxShadow: {
        "glow-emerald": "0 0 80px rgba(16, 185, 129, 0.35)",
      },
    },
  },
  plugins: [],
};
