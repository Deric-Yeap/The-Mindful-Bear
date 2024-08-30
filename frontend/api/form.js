import axiosInstance from '../common/axiosInstance'

export const CreateFormAndQuestion = (data) => {
  return axiosInstance.post('form/create-form-and-questions', data)
}

