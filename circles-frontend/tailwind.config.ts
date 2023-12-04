import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#101010",
          100: "#f2f2f2",
          500: "#999999",
        },
        inputGray: "#F4F4F4",
        darkerInputGray: "#EEEEEE",
      },
      fontSize: {
        "2xs": "0.6rem",
      },
    },
  },
  plugins: [],
};
export default config;
