import axiosInstance from '../common/axiosInstance'


export const profScoreSession = async ({ period = 'daily', year, month } = {}) => {
  try {
    // Construct the URL based on the provided parameters
    let url = `formSession/prof-score/?period=${period}`

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

export const profPercentScoreSession = async ({  year, month, pss, sms } = {}) => {
    try {
      // Construct the URL based on the provided parameters
    let url = `formSession/prof-percent-score/`

    // Check if `year` or `month` are provided and add parameters accordingly
    const params = [];
    if (year) params.push(`year=${year}`);
    if (month) params.push(`month=${month}`);
    if (pss) params.push(`pss=${pss}`)
    if (sms) params.push(`sms=${sms}`)

    // Append the parameters to the URL
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    console.log("url", url) 

    // Make the API request
    const response = await axiosInstance.get(url)
    console.log("response", response)
    return response
    } catch (error) {
      console.error('Error fetching session split data:', error)
      throw error
    }
  }

  