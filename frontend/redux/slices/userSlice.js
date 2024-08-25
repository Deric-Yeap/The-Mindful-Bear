import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    email: '',
    dateOfBirth: '',
    gender: null,
    department: null,
  },
  reducers: {
    setUserDetails: (state, action) => {
      const { userId, email, dateOfBirth, gender, department } = action.payload;
      state.userId = userId;
      state.email = email;
      state.dateOfBirth = dateOfBirth;
      state.gender = gender;
      state.department = department;
    },
    clearUserDetails: (state) => {
      state.userId = null;
      state.email = '';
      state.dateOfBirth = '';
      state.gender = null;
      state.department = null;
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
