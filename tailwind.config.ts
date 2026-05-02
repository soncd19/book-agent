import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        reader: ["var(--reader-font)", "Georgia", "Cambria", "serif"],
        ui: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          500: "#71717a",
          700: "#3f3f46",
          900: "#18181b"
        },
        sepia: {
          50: "#fbf7ea",
          100: "#f4ebd0",
          300: "#dcc995",
          900: "#392f21"
        }
      }
    }
  },
  plugins: []
};

export default config;
