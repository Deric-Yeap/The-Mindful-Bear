import axiosInstance from '../common/axiosInstance'

export const gachaFragment = () => {
  return axiosInstance.post('userFragment/gachaFragment')
}

export const getUserFragments = (id) => {
  return axiosInstance.get(`userFragment/getUserFragmentByUserId/${id}`)
}

export const deleteUserFragments = (id) => {
  return axiosInstance.delete(`userFragment/delete/${id}`)
}

export const updateUserFragment = async (id, userFragmentData) => {
  const formData = new FormData()

  if (userFragmentData.quantity !== undefined) {
    formData.append('quantity', userFragmentData.quantity)
  }

  try {
    const response = await axiosInstance.put(
      `userFragment/update/${id}`,
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
