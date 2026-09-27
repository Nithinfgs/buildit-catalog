/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#062B32',
          forest: '#063F36',
          ink: '#071C20',
        },
        primary: {
          DEFAULT: '#062B32',
          dark: '#071C20',
          forest: '#063F36',
          secondary: '#54756D',
        },
        surface: {
          page: '#F4F3ED',    // Off-white canvas
          card: '#FAFAF6',    // Warm white card
          secondary: '#ECEBE3',
          dark: '#062B32',
          ink: '#071C20',
        },
        lime: {
          DEFAULT: '#D8F43A', // Purposeful action / status accent
          hover: '#C7E42E',
          subtle: '#EEF8B2',
        },
        content: {
          primary: '#102326', // High contrast dark text
          secondary: '#66736F', // Muted technical text
          muted: '#8A9995',
          inverse: '#F4F3ED',
        },
        stroke: {
          DEFAULT: '#D7DDD8', // Crisp industrial border
          crisp: '#D7DDD8',
          dark: '#1C3E3A',
          subtle: '#E2E6E2',
        }
      },
      borderRadius: {
        'btn': '7px',
        'input': '8px',
        'card': '10px',
        'panel': '14px',
        'hero': '16px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'crisp': 'none', // No floating shadows
        'popover': '0 8px 24px -4px rgba(7, 28, 32, 0.15)',
        'modal': '0 20px 40px -10px rgba(7, 28, 32, 0.3)',
        'lime-glow': '0 0 16px rgba(216, 244, 58, 0.25)',
      }
    },
  },
  plugins: [],
}
