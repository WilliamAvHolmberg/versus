import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'"Apple Color Emoji"',
  				'"Segoe UI Emoji"',
  				'"Segoe UI Symbol"',
  				'"Noto Color Emoji"',
  			],
  		},
  		fontSize: {
  			xs: ['0.75rem', { lineHeight: '1.125rem' }],
  			sm: ['0.875rem', { lineHeight: '1.25rem' }],
  			base: ['1rem', { lineHeight: '1.5rem' }],
  			lg: ['1.125rem', { lineHeight: '1.75rem' }],
  			xl: ['1.25rem', { lineHeight: '1.875rem' }],
  			'2xl': ['1.5rem', { lineHeight: '2rem' }],
  			'3xl': ['1.875rem', { lineHeight: '2.375rem' }],
  			'4xl': ['2.25rem', { lineHeight: '2.75rem' }],
  			'5xl': ['3rem', { lineHeight: '3.5rem' }],
  		},
  		spacing: {
  			'4xs': '0.125rem',  // 2px
  			'3xs': '0.25rem',   // 4px
  			'2xs': '0.375rem',  // 6px
  			xs: '0.5rem',       // 8px
  			sm: '0.75rem',      // 12px
  			md: '1rem',         // 16px
  			lg: '1.25rem',      // 20px
  			xl: '1.5rem',       // 24px
  			'2xl': '2rem',      // 32px
  			'3xl': '2.5rem',    // 40px
  			'4xl': '3rem',      // 48px
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: '1rem',
  			'2xl': '1.25rem',
  		},
  		boxShadow: {
  			'subtle': '0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05)',
  			'elevated': '0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05)',
  			'floating': '0 8px 16px rgba(0, 0, 0, 0.08), 0 16px 32px rgba(0, 0, 0, 0.08)',
  		},
  		animation: {
  			'gradient-x': 'gradient-x 10s ease-in-out infinite alternate',
  			'fade-in': 'fade-in 0.5s ease-out',
  		},
  		keyframes: {
  			'gradient-x': {
  				'0%, 100%': {
  					'background-size': '200% 200%',
  					'background-position': 'left center',
  				},
  				'50%': {
  					'background-size': '200% 200%',
  					'background-position': 'right center',
  				},
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)',
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)',
  				},
  			},
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
