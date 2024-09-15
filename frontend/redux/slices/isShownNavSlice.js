import { createSlice } from '@reduxjs/toolkit'
const isShownNavSlice = createSlice({
  name: 'isShownNav',
  initialState: {
    isShownNav: true,
  },
  reducers: {
    setIsShownNav: (state) => {
      state.isShownNav = !state.isShownNav
    },
    clearIsShownNav: (state) => {
      state.isShownNav = true
    },
  },
})

export const { setIsShownNav, clearIsShownNav } = isShownNavSlice.actions
export default isShownNavSlice.reducer
