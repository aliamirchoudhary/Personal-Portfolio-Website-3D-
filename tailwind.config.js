/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep':    '#0a0a0f',
        'surface':    '#12121a',
        'accent':     '#7c3aed',
        'cyan':       '#06b6d4',
        'glow':       '#a78bfa',
        'text-pri':   '#f1f5f9',
        'text-sec':   '#94a3b8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"',         'sans-serif'],
        mono:    ['"JetBrains Mono"','monospace'],
      },
    },
  },
  plugins: [],
}
