/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        panel: "var(--color-panel)",
        panelLine: "var(--color-panelLine)",
        accent: "var(--color-accent)",
        savings: "var(--color-savings)",
        surge: "var(--color-surge)",
        muted: "var(--color-muted)",
        paper: "var(--color-paper)",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
