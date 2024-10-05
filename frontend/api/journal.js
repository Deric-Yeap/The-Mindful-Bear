import axiosInstance from '../common/axiosInstance'

export const journalCalendarSumary = (data) => {
  return axiosInstance.post('journal/calendar/', data)
}

export const journalCountByYear = (params) => {
  return axiosInstance.get('journal/journal_count_year/', { params })
}

export const journalEntriesByDate = (params) => {
  return axiosInstance.get('journal/journal_entries_by_date/', { params })
}

export const journalEntriesByPeriod = (params) => {
  return axiosInstance.get('journal/journal_entries_by_period/', { params })
}

export const journalEntryById = (id) => {
  return axiosInstance.get(`journal/journal_entry/${id}/`)
}

export const deleteJournal = (id) => {
  return axiosInstance.delete(`journal/journal_entry/${id}/`)
}

export const editJournal = (id, data) => {
  return axiosInstance.put(`journal/journal_entry/${id}/`, data)
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

export const journalStreak = () => {
  return axiosInstance.get('journal/journal_streak/')
}