/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-current": "#005fa3",
        "primary-disabled": "#c4e3f4",
        primary: "#007cc2",
        secondary: "#0a1121",
        tertiary: "#6c707a",
        "dark-gray": "#37454d",
        "light-gray": "#afb3bc",
        "gray-200": "#f3f4f5",
        "gray-50": "#6c707a",
        gray: "#979797",
        "lighter-red": "#fff2f2",
        "light-red": "#ffe0df",
        red: "#ffc1c0",
        "dark-red": "#db3734",
        "password-empty": "#dbdde1",
        "password-weak": "#db3734",
        "password-mid": "#fc9e15",
        "password-strong": "#316300",
        "password-placeholder": "#cdd0d2",
      },
      fontFamily: {
        primary: "ProximaVara",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
};
