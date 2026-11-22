/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#100C0A',
          surface: '#1A1411',
          card: '#211711',
          cardHover: '#2A1E17',
          coffee: '#5B3826',
          coffeeLight: '#845338',
          gold: '#C9A46A',
          goldLight: '#E2C38E',
          goldDark: '#9E7E47',
          cream: '#F5EBDD',
          creamLight: '#FAF4EB',
          warmWhite: '#FFF9F0',
          muted: '#A8998C',
          border: 'rgba(201, 164, 106, 0.15)',
          borderStrong: 'rgba(201, 164, 106, 0.35)',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(201, 164, 106, 0.25)',
        'gold-glow-lg': '0 0 45px -5px rgba(201, 164, 106, 0.35)',
        'coffee-glow': '0 0 35px -5px rgba(91, 56, 38, 0.4)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(201, 164, 106, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #C9A46A 0%, #E2C38E 50%, #9E7E47 100%)',
        'coffee-gradient': 'linear-gradient(180deg, rgba(33, 23, 17, 0.9) 0%, rgba(16, 12, 10, 0.95) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0' },
          '50%': { transform: 'translateY(-20px) scaleX(1.2)', opacity: '0.5' },
          '100%': { transform: 'translateY(-40px) scaleX(1.5)', opacity: '0' },
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'steam': 'steam 3s ease-out infinite',
      }
    },
  },
  plugins: [],
}
