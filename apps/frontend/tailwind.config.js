/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 中性色用 CSS 变量，支持暗色模式自动切换
        ios: {
          bg: 'var(--ios-bg)',
          card: 'var(--ios-card)',
          label: 'var(--ios-label)',
          secondary: 'var(--ios-secondary)',
          separator: 'var(--ios-separator)',
          fill: 'var(--ios-fill)',
          // 系统主题色（明暗通用）
          blue: '#0a84ff',
          green: '#30d158',
          red: '#ff453a',
          orange: '#ff9f0a',
          pink: '#ff375f',
          purple: '#bf5af2',
          teal: '#64d2ff',
          yellow: '#ffd60a',
        },
        shell: 'var(--app-shell-bg)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'SF Pro Display',
          'Helvetica Neue',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        soft: '0 4px 20px rgba(0,0,0,0.06)',
        tab: '0 -1px 12px rgba(0,0,0,0.06)',
      },
      maxWidth: {
        app: '480px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
    },
  },
  plugins: [],
};
