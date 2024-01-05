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
        main: '#222020',
        sub: '#2a2828',
      },
      colors: {
        highlight: '#d74242',
        main: '#222020',
        sub: '#2a2828',
      },
      border: {
        highlight: '#d74242',
        main: '#222020',
        sub: '#2a2828',
      },
    },
  },
  plugins: [],
};
export default config;
