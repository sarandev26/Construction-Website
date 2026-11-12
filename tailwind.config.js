/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: '#E3F25B',
          hover: '#d5e44a',
          light: '#f2f8a8',
        },
        olive: {
          DEFAULT: '#1B1D0F',
          surface: '#252714',
          card: '#17190d',
          dark: '#111209',
        },
        cream: {
          DEFAULT: '#F2EFE6',
          dark: '#E7E3D6',
          light: '#FAF8F3',
        },
        ink: {
          DEFAULT: '#111111',
          soft: '#222222',
        },
        muted: {
          DEFAULT: '#8A8A80',
          dark: 'rgba(242, 239, 230, 0.65)',
        }
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        sans: ['Urbanist', 'sans-serif'],
      },
      borderRadius: {
        '20': '20px',
        '24': '24px',
        '28': '28px',
        '32': '32px',
        '36': '36px',
        '40': '40px',
      },
      lineHeight: {
        'tight-hero': '1.05',
        'tight-h2': '1.1',
      },
      letterSpacing: {
        'tight-heading': '-0.02em',
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.16)',
        'nav': '0 12px 32px rgba(27, 29, 15, 0.08)',
        'glow-lime': '0 0 24px rgba(227, 242, 91, 0.35)',
      }
    },
  },
  plugins: [],
}
