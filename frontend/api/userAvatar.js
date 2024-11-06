import axiosInstance from '../common/axiosInstance'

export const getUserAvatars = (id) => {
  return axiosInstance.get(`userAvatar/getUserAvatarByUserId/${id}`)
}

export const createUserAvatar = async (userAvatarData) => {
  const formData = new FormData()
  const { user, avatar } = userAvatarData

  if (user) formData.append('user', user)
  if (avatar) formData.append('avatar', avatar)

  try {
    const response = await axiosInstance.post('userAvatar/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  } catch (error) {
    const errorMessage =
      error.response?.data?.error_description ||
      error.response?.data ||
      error.message
    console.error('Error creating user avatar:', errorMessage)
    throw new Error(errorMessage)
  }
}

export const updateUserAvatar = async (id, userAvatarData) => {
  const formData = new FormData()
  if (userAvatarData.user) formData.append('user', userAvatarData.user)
  if (userAvatarData.avatar) formData.append('avatar_id', userAvatarData.avatar)
  if (typeof userAvatarData.is_selected !== 'undefined') {
    formData.append('is_selected', userAvatarData.is_selected)
  }
  try {
    const response = await axiosInstance.put(
      `userAvatar/update/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response
  } catch (error) {
    console.log(
      'Error Description:',
      error.response?.data?.error_description ||
        error.response?.data ||
        error.message
    )
    throw error
  }
}
