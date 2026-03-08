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
        brand: {
          50: '#E3F0FE',
          100: '#C7E1FD',
          200: '#8FC3FB',
          300: '#57A5F9',
          400: '#1F87F7',
          500: '#0A6ED1',
          600: '#0A66C2',
          700: '#085BA5',
          800: '#064F88',
          900: '#004182',
        },
        neutral: {
          900: '#191919',
          600: '#666666',
          400: '#A0A0A0',
          100: '#F3F2EF',
        },
        border: '#D0D0D0',
        success: '#057642',
        warning: '#E0A100',
        danger: '#C73428',
        info: '#0A66C2',
      },
    },
  },
  plugins: [],
};
export default config;
