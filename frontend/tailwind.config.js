/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        paper: "#ffffff",
        muted: "#f5f5f5",
        line: "#e4e4e7",
        soft: "#71717a",
        surface: "#fafafa",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        float: "0 20px 60px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 30%), linear-gradient(180deg, #09090b 0%, #18181b 100%)",
      },
    },
  },
  plugins: [],
};
