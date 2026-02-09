/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/features/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1a264a',
                    light: 'rgba(26, 38, 74, 0.55)',
                    dark: '#2d395b',
                },
                bg: {
                    primary: '#f7f8fd',
                    secondary: '#f1f2f7',
                    card: '#ffffff',
                    sidebar: '#f1f2f7',
                },
                text: {
                    primary: '#000000',
                    secondary: '#797a7c',
                    tertiary: '#a9aaad',
                    light: '#f7f8fd',
                    'on-primary': '#e5e7ec',
                },
                border: {
                    DEFAULT: '#e5e7eb',
                    light: 'rgba(229, 231, 235, 0.5)',
                },
                success: {
                    DEFAULT: '#14ae5c',
                    bg: '#dff4e9',
                    light: '#16a34a',
                    text: '#d1fae5',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    bg: '#fef3c7',
                    light: '#fde5bf',
                },
                error: {
                    DEFAULT: '#dc2626',
                    bg: '#fee2e2',
                },
                info: {
                    DEFAULT: '#838ca1',
                    bg: 'rgba(219, 234, 254, 0.34)',
                },
                chart: {
                    primary: '#838ca1',
                    secondary: '#2d395b',
                    accent1: '#9d2c34',
                    accent2: '#133dbd',
                    accent3: '#924b66',
                }
            },
            fontFamily: {
                primary: ['var(--font-primary)', 'sans-serif'],
                secondary: ['var(--font-secondary)', 'sans-serif'],
            },
            fontSize: {
                '8px': '8px',
                '12px': '12px',
                '14px': '14px',
                '18px': '18px',
                '20px': '20px',
                '24px': '24px',
                '36px': '36px',
            },
            borderRadius: {
                '2': '2px',
                '5': '5px',
                '7': '7px',
                '8': '8px',
                '10': '10px',
                '20': '20px',
            },
            spacing: {
                '2px': '2px',
                '5px': '5px',
                '8px': '8px',
                '10px': '10px',
                '12px': '12px',
                '14px': '14px',
                '20px': '20px',
                '24px': '24px',
                '25px': '25px',
                '30px': '30px',
                '34px': '34px',
                '38px': '38px',
                '41px': '41px',
                '47px': '47px',
                '56px': '56px',
                '70px': '70px',
                'sidebar': '217px',
                'header': '56px',
            },
            boxShadow: {
                sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
};
