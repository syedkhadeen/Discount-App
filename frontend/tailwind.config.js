/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm & Appetizing Theme (Food-Friendly)
        background: '#FFF8F0', // Off White
        surface: '#FFFFFF', // Pure white for surfaces
        primary: {
          50: '#FFEBEE', // Very light tomato
          100: '#FFCDD2', // Light tomato
          200: '#EF9A9A', // Soft tomato
          300: '#E57373', // Medium tomato
          400: '#EF5350', // Bright tomato
          500: '#E53935', // Tomato Red (main color)
          600: '#D32F2F', // Darker tomato
          700: '#C62828', // Deep tomato
          800: '#B71C1C', // Very deep tomato
          900: '#8E0000'  // Darkest tomato
        },
        secondary: {
          50: '#FFF3E0', // Very light orange
          100: '#FFE0B2', // Light orange
          200: '#FFCC80', // Soft orange
          300: '#FFB74D', // Medium orange
          400: '#FFA726', // Warm Orange (main color)
          500: '#FB8C00', // Warm Orange (darker)
          600: '#F57C00', // Dark orange
          700: '#EF6C00', // Deep orange
          800: '#E65100', // Very deep orange
          900: '#BF360C'  // Darkest orange
        },
        accent: {
          50: '#FFFDE7', // Very light lemon
          100: '#FFF9C4', // Light lemon
          200: '#FFF59D', // Soft lemon
          300: '#FFF176', // Medium lemon
          400: '#FFEE58', // Bright lemon
          500: '#FDD835', // Lemon Yellow (main color)
          600: '#FBC02D', // Darker lemon
          700: '#F9A825', // Deep lemon
          800: '#F57F17', // Very deep lemon
          900: '#F57C00'  // Darkest lemon
        },
        success: {
          100: '#C8E6C9', // Light green
          400: '#66BB6A', // Success green
          700: '#388E3C'   // Dark success green
        },
        text: {
          primary: '#2E2E2E', // Dark Brown/Charcoal for main text
          secondary: '#5D4037', // Warm brown for secondary text
          disabled: '#9E9E9E', // For disabled text
          hint: '#8D6E63',    // For hints and placeholders
          onPrimary: '#FFFFFF', // White text on primary colors
          onSecondary: '#2E2E2E' // Dark text on secondary colors for better contrast
        },
        muted: '#BCAAA4', // Muted warm gray
        
        // Dark mode (for evening/night viewing)
        dark: {
          background: '#1A1A1A', // Dark background
          surface: '#2D2D2D', // Slightly lighter surface
          text: '#F5F5F5', // Light text
          primary: {
            400: '#EF5350', // Brighter tomato for dark mode
            500: '#E53935', // Main tomato for dark mode
          },
          secondary: {
            400: '#FFA726', // Brighter orange for dark mode
            500: '#FB8C00', // Main orange for dark mode
          },
          accent: {
            400: '#FFEE58', // Brighter lemon for dark mode
            500: '#FDD835', // Main lemon for dark mode
          },
          success: {
            400: '#66BB6A', // Success green for dark mode
            500: '#4CAF50', // Main success green for dark mode
          },
          text: {
            primary: '#F5F5F5', // Light text for dark mode
            secondary: '#FFCC80', // Light orange for secondary text
            disabled: '#9E9E9E', // Disabled text
            hint: '#BCAAA4',    // Hints and placeholders
            onPrimary: '#FFFFFF', // White text on primary colors
            onSecondary: '#2E2E2E' // Dark text on secondary colors
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
