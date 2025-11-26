import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF2121",  // main red
          dark: "#D11919",     // hover red
          soft: "#FFF5F5",     // very light background
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 18px 45px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
