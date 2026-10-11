/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F4EFE6',
          300: '#EDE4D5',
        },
        ivory: '#FAF8F5',
        coral: {
          50: '#FFF5F2',
          100: '#FFEAE4',
          200: '#FFD5CA',
          300: '#FFAB97',
          400: '#FF7D60',
          500: '#FF5733',
          600: '#E84723',
          700: '#C73617',
          800: '#9E2D16',
          900: '#7E2816',
        },
        terracotta: '#E05D44',
        lavender: {
          50: '#F8F6FD',
          100: '#F1ECFA',
          200: '#E5DCF6',
          300: '#CFBFEE',
          400: '#B099E2',
          500: '#9273D4',
          600: '#7B5ABF',
          700: '#6445A2',
        },
        charcoal: {
          50: '#F6F6F7',
          100: '#E8E8EA',
          600: '#52515A',
          700: '#3D3B47',
          800: '#2A2833',
          900: '#1C1A24',
          950: '#121118',
        },
        peach: {
          50: '#FFF8F6',
          100: '#FFF0EC',
          200: '#FFE2DB',
          300: '#FFC8BB',
        },
        warmgray: {
          50: '#FBFBFC',
          100: '#F5F5F7',
          200: '#EBEBED',
          300: '#D5D5DA',
          400: '#A1A0A9',
          500: '#71707A',
          600: '#52515A',
        },
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(42, 40, 51, 0.05), 0 1px 4px -1px rgba(42, 40, 51, 0.03)',
        'warm-md': '0 8px 24px -4px rgba(42, 40, 51, 0.08), 0 2px 6px -2px rgba(42, 40, 51, 0.04)',
        'warm-lg': '0 16px 36px -6px rgba(42, 40, 51, 0.1), 0 4px 12px -2px rgba(42, 40, 51, 0.05)',
        'coral-glow': '0 10px 25px -5px rgba(232, 71, 35, 0.35)',
        'lavender-glow': '0 10px 25px -5px rgba(123, 90, 191, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
