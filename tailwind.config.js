/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                primary: ['Bricolage Grotesque', 'sans-serif'],
                secondary: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: '#1a264a',
                'primary-light': 'rgba(26, 38, 74, 0.55)',
                'primary-dark': '#2d395b',
                secondary: '#000000', // Adjusted based on variables.css
            }
        },
    },
    plugins: [],
}
