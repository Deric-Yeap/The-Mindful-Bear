import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    refreshToken: null,
  },
  reducers: {
    setTokens: (state, action) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
    },
    clearTokens: (state) => {
      state.token = null
      state.refreshToken = null
    },
  },
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer
