import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0A2E4D",
        sand: "#D6B98C",
        cream: "#F8F5EF",
        charcoal: "#2F2F2F",
        muted: "#777777",
        line: "#E6E2DA"
      },
      fontFamily: {
        heading: ["Montserrat", "Arial", "sans-serif"],
        body: ["Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(10, 46, 77, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
