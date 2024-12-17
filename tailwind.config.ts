import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        shake: "shake 0.2s ease-in-out infinite alternate",
        line: "line 0.8s ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "0%": { transform: "translateY(-1%)" },
          "100%": { transform: "translateY(3%)" },
        },
        line: {
          "0%": { strokeDashoffset: "22" },
          "22%": { strokeDashoffset: "22" },
          "50%": { strokeDashoffset: "0" },
          "51%": { strokeDashoffset: "0" },
          "80%": { strokeDashoffset: "-22" },
          "100%": { strokeDashoffset: "-22" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
