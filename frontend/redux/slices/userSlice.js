import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    email: '',
    dateOfBirth: '',
    gender: {
      key: null,
      value: '',
      disable: false,
    },
    department: {
      key: null,
      value: '',
      disable: false,
    },
    isStaff: false,
    name: '',
  },
  reducers: {
    setUserDetails: (state, action) => {
      const {
        user_id,
        email,
        date_of_birth,
        gender,
        department,
        is_staff,
        name,
      } = action.payload
      state.userId = user_id
      state.email = email
      state.dateOfBirth = date_of_birth
      state.gender = gender
      state.department = department
      state.isStaff = is_staff
      state.name = name
    },
    clearUserDetails: (state) => {
      state.userId = null
      state.email = ''
      state.dateOfBirth = ''
      state.gender = {
        key: null,
        value: '',
        disable: false,
      }
      state.department = {
        key: null,
        value: '',
        disable: false,
      }
      state.isStaff = false
      state.name = ''
    },
  },
})

export const { setUserDetails, clearUserDetails } = userSlice.actions
export default userSlice.reducer
