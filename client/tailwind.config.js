/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Core palette */
        sky:      '#7BD5F5',
        violet:   '#787FF6',
        teal:     '#4ADEDE',
        azure:    '#1CA7EC',
        navy:     '#1F2F98',

        /* Semantic aliases */
        primary:     '#1CA7EC',
        'primary-dk':'#0e8ed1',
        'primary-lt':'#e0f5fd',
        'primary-md':'#7BD5F5',
        accent:      '#1F2F98',
        'accent-2':  '#2d3db0',
        teal2:       '#4ADEDE',
        violet2:     '#787FF6',
        bg:          '#f0f9ff',
        surface:     '#ffffff',
        'surface-2': '#e8f6fd',
        muted:       '#6ba3c4',
        star:        '#f59e0b',
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      fontWeight: { black: '900' },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        card:    '0 2px 16px rgba(28,167,236,0.12)',
        hover:   '0 8px 32px rgba(28,167,236,0.24)',
        deep:    '0 16px 48px rgba(31,47,152,0.18)',
        glass:   '0 4px 24px rgba(28,167,236,0.10), inset 0 1px 0 rgba(255,255,255,0.90)',
        teal:    '0 4px 16px rgba(74,222,222,0.35)',
        azure:   '0 4px 16px rgba(28,167,236,0.40)',
        violet:  '0 4px 16px rgba(120,127,246,0.35)',
      },
      backgroundImage: {
        'gradient-hero':   'linear-gradient(135deg, #1F2F98 0%, #1CA7EC 55%, #4ADEDE 100%)',
        'gradient-teal':   'linear-gradient(135deg, #4ADEDE 0%, #1CA7EC 100%)',
        'gradient-violet': 'linear-gradient(135deg, #787FF6 0%, #1F2F98 100%)',
        'gradient-card':   'linear-gradient(135deg, rgba(31,47,152,0.92) 0%, rgba(28,167,236,0.82) 100%)',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease-out both',
        'fade-in': 'fadeIn 0.25s ease-out both',
        shimmer:   'shimmer 1.5s infinite linear',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
