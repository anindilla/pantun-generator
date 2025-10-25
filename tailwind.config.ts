import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Kampung-style color palette
        'kampung': {
          'brown': '#8B4513',
          'dark-brown': '#654321',
          'light-brown': '#D2B48C',
          'cream': '#F5F5DC',
          'green': '#228B22',
          'dark-green': '#006400',
          'gold': '#FFD700',
          'terracotta': '#E2725B',
        },
        'pantun': {
          'primary': '#8B4513',
          'secondary': '#228B22',
          'accent': '#FFD700',
          'background': '#F5F5DC',
          'text': '#2F1B14',
        }
      },
      fontFamily: {
        'indonesian': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Georgia', 'Times New Roman', 'serif'],
      },
      backgroundImage: {
        'kampung-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23D2B48C\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
export default config
