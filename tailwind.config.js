/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-cream': '#F7F3EA',
                'brand-beige': '#EBE3D5',
                'brand-sand': '#D2B48C',
                'brand-brown': '#4A3728',
                'brand-dark': '#1A1110',
                'brand-white': '#FFFFFF',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                'luxury': '32px',
                'arch': '160px',
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
                'luxury': '0 20px 60px -12px rgba(74, 55, 40, 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'parallax': 'parallax var(--parallax-offset) linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
