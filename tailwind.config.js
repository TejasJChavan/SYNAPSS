/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                blue1: "#1e3a8a",
                blue2: "#1e40af",
                blue3: "#1d4ed8",
                blue4: "#2563eb",
                blue5: "#3b82f6",
                blue6: "#60a5fa",
                blue7: "#93c5fd",
                blue8: "#bfdbfe",
                blue9: "#dbeafe",
                blue10: "#eff6ff",
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
