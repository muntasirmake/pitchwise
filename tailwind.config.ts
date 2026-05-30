import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          navy: "#132440",
          mist: "#f9fafc",
        },
      },
      fontFamily: {
        display: ["Merriweather", "Georgia", "serif"],
        body: ["Georgia", "serif"],
        logo: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
