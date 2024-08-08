/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#4f46e5", // indigo-600
                "primary-hover": "#6366f1", // indigo-500
                dark: "#111827",
            },
        },
    },
    plugins: [],
};
