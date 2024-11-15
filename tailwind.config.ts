import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
    },
    colors: {
      'sky-blue': '#5DB3DC',
      'light-blue': '#274784',
      'deep-blue': '#15264F',
      'dark-blue': '#0F1B38',

      'saturated-blue': '#00288C',
      'text-blue': '#368FEA',

      'dark-black': '#161616',

      'inactive-grey': '#434E64',
    },
    borderRadius: {
      DEFAULT: '10px'
    },
    blur: {
      'overlay': '10px',
    },
    fontSize: {
      'xsm': ['9.9px', {
        lineHeight: '12.8px',
        letterSpacing: '0.16px',
        fontWeight: '500',
      }],
      'sm': ['12px', {
        lineHeight: '15.6px',
        letterSpacing: '0.16px',
        fontWeight: '500',
      }],
      'md': ['14px', {
        lineHeight: '18.2px',
        letterSpacing: '0.16px',
        fontWeight: '500',
      }],
      'lg': ['16px', {
        lineHeight: '1.3rem',
        letterSpacing: '0.16px',
        fontWeight: '400',
      }],
      'xl': ['20px', {
        lineHeight: '26px',
        letterSpacing: '0.16px',
        fontWeight: '600',
      }],
      'xxl': ['28px', {
        lineHeight: '36.4px',
        letterSpacing: '0.16px',
        fontWeight: '600',
      }],
    }
  },
  plugins: [],
};

export default config;
