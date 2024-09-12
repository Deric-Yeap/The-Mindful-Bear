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
