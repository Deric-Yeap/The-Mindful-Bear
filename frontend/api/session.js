import axiosInstance from '../common/axiosInstance'

export const createSession = async (data) => {
  return axiosInstance.post('session/create/', data)
}

export const listSession = async () => {
  return axiosInstance.get('session/list/')
}

export const getSession = async (sessionId) => {
  return axiosInstance.get(`session/detail/${sessionId}/`)
}


export const splitSession = async ({ period = 'daily', year, month } = {}) => {
  try {
    // Construct the URL based on the provided parameters
    let url = `session/split/?period=${period}`

    // Append year and month to the URL if they are provided
    if (year) url += `&year=${year}`
    if (month) url += `&month=${month}`

    // Make the API request
    const response = await axiosInstance.get(url)


    // Return the response data
    return response
  } catch (error) {
    console.error('Error fetching session split data:', error)
    throw error
  }
}


export const updateSession = async (data, sessionId) => {
  console.log(sessionId)
  return axiosInstance.put(`session/update/${sessionId}/`, data)
}
