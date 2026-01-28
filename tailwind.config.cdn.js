tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0071E3', // Apple Blue
          600: '#0066CC',
          700: '#0059B3',
        },
        apple: {
          dark: '#1D1D1F',
          gray: '#86868B',
          light: '#F5F5F7',
        },
        accent: {
          blue: '#0071E3',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  }
}