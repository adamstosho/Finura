/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'finura-blue': '#1A6AFF',
        'deep-navy': '#0A1833',
        'mint-green': '#2FFFCF',
        'coral-pink': '#FF5C7C',
        'gold-accent': '#FFD600',
        'soft-white': '#F9FAFB',
        'slate-gray': '#6B7A90',
        'light-gray': '#E5EAF1',
        'medium-gray': '#B0B8C1',
        'dark-gray': '#232B3A',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, #1A6AFF 0%, #2FFFCF 100%)',
        'button-gradient': 'linear-gradient(90deg, #1A6AFF 0%, #FF5C7C 100%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceBlink: {
          '0%, 100%': { transform: 'translateY(0)', opacity: 1 },
          '50%': { transform: 'translateY(-6px)', opacity: 0.6 },
        },
        textBlink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'bounce-blink': 'bounceBlink 2s ease-in-out infinite',
        'text-blink': 'textBlink 3s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};