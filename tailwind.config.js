/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
        "./hooks/**/*.{ts,tsx}",
        "./utils/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // primary: "#0A2E44", // inavy
                // primary: "#4A5568", // steel grey
                primary: "#4f46e5", // indigo-600
                "primary-hover": "#6366f1", // indigo-500
                secondary: "#114C70", // different navy
                dark: "#111827",
            },
        },
    },
    plugins: [],
};
