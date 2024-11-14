import axiosInstance from '../common/axiosInstance'


export const generalScoreSession = async ({ period = 'daily', year, month } = {}) => {
  try {
    // Construct the URL based on the provided parameters
    let url = `formSQession/gen-score//?period=${period}`

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

