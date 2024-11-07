import { createSlice } from '@reduxjs/toolkit'

const userAchievementsSlice = createSlice({
  name: 'userAchievements',
  initialState: {
    userAchievements: [],
    newlyAttainedAchievements: [],
  },
  reducers: {
    setUserAchievements: (state, action) => {
      state.userAchievements = action.payload
    },
    setNewlyAttainedAchievements: (state, action) => {
      state.newlyAttainedAchievements = action.payload
    },
    clearAchievements: (state) => {
      state.userAchievements = []
      state.newlyAttainedAchievements = []
    },
    clearNewlyAttainedAchievements: (state) => {
      state.newlyAttainedAchievements = []
    },
  },
})

export const {
  setUserAchievements,
  clearUserAchievements,
  setNewlyAttainedAchievements,
  clearNewlyAttainedAchievements,
} = userAchievementsSlice.actions
export default userAchievementsSlice.reducer
