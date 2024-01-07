/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        MainBodyColor1: '#f5f5b8',
        FontColor: '#192560',
        FontColor1 : '#000D4F',
        MainBodyColor2: '#F2FF26',
        MainBodyColor3: '#94FF94',
      },
      backgroundColor: {
        'custom-green': '#ddfdec',
        'custom-offwhite': '#fefefc'
      }
    }
  },
  plugins: []
}
