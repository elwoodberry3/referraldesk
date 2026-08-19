import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        ink: "#111827",
        body: "#374151",
        muted: "#6B7280",
        line: "#E5E7EB",
        canvas: "#F9FAFB",
      },
    },
  },
  plugins: [],
};
export default config;
