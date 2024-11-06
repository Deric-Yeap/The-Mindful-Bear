import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import isShownNavReducer from './slices/isShownNavSlice'
import userAchievementsReducer from './slices/userAchievementSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    isShownNav: isShownNavReducer,
    achievements: userAchievementsReducer,
  },
})
