import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import isShownNavReducer from './slices/isShownNavSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    isShownNav: isShownNavReducer,
  },
})
