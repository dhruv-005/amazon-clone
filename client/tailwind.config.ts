import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          nav: '#131921',
          subnav: '#232f3e',
          yellow: '#ffd814',
          yellowHover: '#f7ca00',
          orange: '#ffa41c',
          orangeHover: '#fa8900',
          bg: '#eaeded',
          blue: '#007185',
          blueHover: '#004b57',
          red: '#cc0c39',
          dealRed: '#b12704',
          gold: '#febd69',
          green: '#007600',
        },
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
