import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
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
      'xsm': ['0.620rem', {
        lineHeight: '0.800rem',
        letterSpacing: '0.01rem',
        fontWeight: '500',
      }],
      'sm': ['0.750rem', {
        lineHeight: '0.975rem',
        letterSpacing: '0.01em',
        fontWeight: '500',
      }],
      'md': ['0.875rem', {
        lineHeight: '1.138rem',
        letterSpacing: '0.01em',
        fontWeight: '500',
      }],
      'lg': ['1rem', {
        lineHeight: '1.3rem',
        letterSpacing: '0.01em',
        fontWeight: '400',
      }],
      'xl': ['1.25rem', {
        lineHeight: '1.625rem',
        letterSpacing: '0.01em',
        fontWeight: '600',
      }],
      'xxl': ['1.750rem', {
        lineHeight: '2.275rem',
        letterSpacing: '0.01em',
        fontWeight: '600',
      }],
    }
  },
  plugins: [],
};

export default config;
