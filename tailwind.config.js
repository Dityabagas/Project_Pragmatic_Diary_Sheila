/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        elite: ['"Special Elite"', 'serif'],
        courier: ['"Courier Prime"', 'monospace'],
        oswald: ['Oswald', 'sans-serif'],
      },
      colors: {
        board: {
          bg: '#1a1a18',
          surface: '#222220',
          card: '#F5E8CC',
          photo: '#2a2a2a',
          sticky: '#FFE17D',
        },
        crime: {
          red: '#CC1111',
          'red-glow': '#FF3333',
          ink: '#1A1A1A',
          stamp: '#8B0000',
          badge: '#B22222',
          tape: 'rgba(240,230,200,0.45)',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(204,17,17,0.6)' },
          '50%': { boxShadow: '0 0 20px 8px rgba(204,17,17,0.9)' },
        },
        stamp_in: {
          '0%': { opacity: '0', transform: 'rotate(-12deg) scale(1.4)' },
          '60%': { opacity: '1', transform: 'rotate(-12deg) scale(0.95)' },
          '100%': { opacity: '1', transform: 'rotate(-12deg) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slideUp: 'slideUp 0.4s ease-out forwards',
        pulse_glow: 'pulse_glow 2s ease-in-out infinite',
        stamp_in: 'stamp_in 0.4s ease-out 0.3s both',
      },
    },
  },
  plugins: [],
}
