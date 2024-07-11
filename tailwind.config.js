/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#4f46e5",
                "primary-hover": "#6366f1",
                dark: "#111827",
            },
        },
    },
    plugins: [],
};
