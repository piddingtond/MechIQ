import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mq: {
          bg:      '#0d0f14',
          surface: '#161a22',
          surface2:'#1e2330',
          border:  '#2a3040',
          amber:   '#f59e0b',
          amber2:  '#fbbf24',
          text:    '#e8eaf0',
          muted:   '#8892a4',
          green:   '#22c55e',
          red:     '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
export default config;
