import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    // extend: {
    //   backgroundImage: {
    //     "red-packet":"url('./src/public/img/packet-bgd.png')",
    //     "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
    //     "gradient-conic":
    //       "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    //   },
    //   borderRadius: {
    //     '6xl' : "3.0rem",
    //     '7xl' : "3.5rem",
    //     '8xl' : "4.0rem",
    //   },
    //   colors: {
    //     'gold': '#FFE0B3',
    //   },
    // },
  },
  // darkMode: "class",
  plugins: [nextui()],
};
export default config;
