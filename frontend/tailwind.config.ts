import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        highlight: '#d74242',
        subHighlight: '#ffa5a5',
        main: '#1a1919',
        sub1: '#2a2828',
        sub2: '#222020',
      },
      colors: {
        highlight: '#d74242',
        subHighlight: '#ffa5a5',
        main: '#1a1919',
        sub1: '#2a2828',
        sub2: '#222020',
      },
      border: {
        highlight: '#d74242',
        subHighlight: '#ffa5a5',
        main: '#1a1919',
        sub1: '#2a2828',
        sub2: '#222020',
      },
      boxShadow: {
        rightShadow: '1px 0 7px 0',
      },
    },
  },
  plugins: [],
};
export default config;
