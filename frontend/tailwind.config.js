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
      colors: {
        mindful: {
          brown: {
            100: '#251404',
            90: '#372315',
            80: '#4F3422',
            70: '#704A33',
            60: '#926247',
            50: '#AC836C',
            40: '#C0A091',
            30: '#D6C2B8',
            20: '#E8DDD9',
            10: '#F7F4F2',
          },
        },
        optimistic: {
          gray: {
            100: '#161513',
            90: '#292723',
            80: '#3F3C36',
            70: '#5A545E',
            60: '#736866',
            50: '#928D86',
            40: '#ACA9A5',
            30: '#C9C7C5',
            20: '#E1E1E0',
            10: '#F5F5F5',
          },
        },
        serenity: {
          green: {
            100: '#191E10',
            90: '#29321A',
            80: '#3D4A26',
            70: '#5A6838',
            60: '#7D944D',
            50: '#9BB068',
            40: '#B4C48D',
            30: '#CFD9B5',
            20: '#E5EAD7',
            10: '#F0F2E8',
          },
        },
        empathy: {
          orange: {
            100: '#431407',
            90: '#7C2D12',
            80: '#9A3412',
            70: '#C2410C',
            60: '#EA580C',
            50: '#F97310',
            40: '#FB8B28',
            30: '#FDBA74',
            20: '#FED7AA',
            10: '#FFF0E5',
          },
        },
        zen: {
          yellow: {
            100: '#4A2006',
            90: '#713F12',
            80: '#854D0E',
            70: '#A16207',
            60: '#CABA04',
            50: '#EAB308',
            40: '#FACC15',
            30: '#FED047',
            20: '#FFE08A',
            10: '#FFF8C3',
          },
        },
        kind: {
          purple: {
            100: '#2E1065',
            90: '#4E248E',
            80: '#5D2AA4',
            70: '#7035CC',
            60: '#7F4E5E2',
            50: '#8B5CF6',
            40: '#A78BFA',
            30: '#C4B5FD',
            20: '#DDD6FE',
            10: '#EDE9FE',
          },
        },
        present: {
          red: {
            100: '#4C0519',
            90: '#881337',
            80: '#9F1239',
            70: '#BE123C',
            60: '#E11D48',
            50: '#F43F5E',
            40: '#FB7185',
            30: '#FDA4AF',
            20: '#FECDD3',
            10: '#FFE4E6',
          },
        },
      },
      inset: {
        18: '4.5rem',
      },
      screens: {
        xs: '365dp', // Max width for extra small devices (e.g., older iPhones, small Android phones)
        sm: '456dp', // Max width for small devices (e.g., Pixel 8)
        md: '540dp', // Max width for medium devices (e.g., iPhone 11/12/13, Pixel 6/7)
        lg: '768dp', // Max width for large devices (e.g., iPhone 12 Pro Max, larger Android devices)
        xl: '1024dp', // Max width for extra-large devices (e.g., tablets, larger screens)
      },
    },
  },
  plugins: [],
}
