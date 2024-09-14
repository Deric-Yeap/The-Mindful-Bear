import axiosInstance from '../common/axiosInstance'

export const journalCalendarSumary = (data) => {
  return axiosInstance.post('journal/calendar/', data)
}

export const journalCountByYear = (params) => {
  return axiosInstance.get('journal/journal_count_year/', { params })
}

export const createJournal = (data) => {
  return axiosInstance.post('journal/create/', data)
}

export const audioUpload = (formData) => {
  return axiosInstance.post('journal/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const speechToText = (formData) => {
  return axiosInstance.post('journal/speech_to_text/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
