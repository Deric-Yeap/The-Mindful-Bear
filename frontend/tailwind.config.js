/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'urbanist-thin': ['Urbanist_100Thin', 'sans-serif'],
        'urbanist-extra-light': ['Urbanist_200ExtraLight', 'sans-serif'],
        'urbanist-light': ['Urbanist_300Light', 'sans-serif'],
        'urbanist-regular': ['Urbanist_400Regular', 'sans-serif'],
        'urbanist-medium': ['Urbanist_500Medium', 'sans-serif'],
        'urbanist-semi-bold': ['Urbanist_600SemiBold', 'sans-serif'],
        'urbanist-bold': ['Urbanist_700Bold', 'sans-serif'],
        'urbanist-extra-bold': ['Urbanist_800ExtraBold', 'sans-serif'],
        'urbanist-black': ['Urbanist_900Black', 'sans-serif'],
        'urbanist-thin-italic': ['Urbanist_100Thin_Italic', 'sans-serif'],
        'urbanist-extra-light-italic': [
          'Urbanist_200ExtraLight_Italic',
          'sans-serif',
        ],
        'urbanist-light-italic': ['Urbanist_300Light_Italic', 'sans-serif'],
        'urbanist-regular-italic': ['Urbanist_400Regular_Italic', 'sans-serif'],
        'urbanist-medium-italic': ['Urbanist_500Medium_Italic', 'sans-serif'],
        'urbanist-semi-bold-italic': [
          'Urbanist_600SemiBold_Italic',
          'sans-serif',
        ],
        'urbanist-bold-italic': ['Urbanist_700Bold_Italic', 'sans-serif'],
        'urbanist-extra-bold-italic': [
          'Urbanist_800ExtraBold_Italic',
          'sans-serif',
        ],
        'urbanist-black-italic': ['Urbanist_900Black_Italic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
