import axiosInstance from '../common/axiosInstance'

// export const createSession = async (data) => {
//   return axiosInstance.post('session/create/', data)
// }

// export const listSession = async () => {
//   return axiosInstance.get('session/list/')
// }

// export const getSession = async (sessionId) => {
//   return axiosInstance.get(`session/detail/${sessionId}/`)
// }


export const splitUserSession = async ({ year, month } ={}) => {
  try {
    // Construct the URL based on the provided parameters
    let url = `userSession/split-exercise/`

    // Check if `year` or `month` are provided and add parameters accordingly
    const params = [];
    if (year) params.push(`year=${year}`);
    if (month) params.push(`month=${month}`);

    // Append the parameters to the URL
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }

    // Make the API request
    const response = await axiosInstance.get(url)
    console.log("response",response)

    // Return the response data
    return response.dates
  } catch (error) {
    console.error('Error fetching session split data:', error)
    throw error
  }
}


export const updateSession = async (data, sessionId) => {
  console.log(sessionId)
  return axiosInstance.put(`session/update/${sessionId}/`, data)
}

export const createUserSession = async (data) => {
  return axiosInstance.post('userSession/create/', data)
}
