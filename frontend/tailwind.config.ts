import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05080d',
        surface: 'rgba(255,255,255,0.04)',
        gold: '#FFB800',
        'gold-2': '#FF7A00',
        'gold-3': '#FFE066',
        blue: '#00D4FF',
        purple: '#7B2FFF',
        green: '#00FF88',
        text: '#f0f4f8',
        muted: '#607080',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
