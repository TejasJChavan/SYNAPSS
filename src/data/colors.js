// Centralized color palette used across the app
export const colors = {
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
};

// Convert hex color to rgba string with given alpha (0-1)
export function rgba(hex, alpha = 1) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    const h = hex.replace("#", "");
    const bigint = parseInt(
        h.length === 3
            ? h
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : h,
        16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default colors;
