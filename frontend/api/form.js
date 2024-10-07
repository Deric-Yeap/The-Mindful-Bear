import axiosInstance from '../common/axiosInstance'

export const CreateFormAndQuestion = (data) => {
  return axiosInstance.post('form/create-form-and-questions', data)
}

export const UpdateFormAndQuestion = (formId, data) => {
  return axiosInstance.put(`form/update-form-and-questions/${formId}`, data)
}

export const getForms = async () => {
  return axiosInstance.get('form/get')
}

async function fetchOptionSet(optionSetId) {
  return axiosInstance.get(`option/getOptions/${optionSetId}`);
}

async function fetchOptionSetName(optionSetId) {
  return axiosInstance.get(`option_set/get/${optionSetId}`);
}

export const getFormQuestions = async (formId) => {
  return axiosInstance.get(`form/get-form-and-questions/${formId}`);
};

export const setFormQuestion = async (sessionId, formId, answers) => {    
  const formattedAnswers = Object.keys(answers).map(questionId => ({
    QuestionID: parseInt(questionId),        
    Response: answers[questionId]
  }));

  return await axiosInstance.post('formQuestion/bulk_create/', 
    {
      SessionID: sessionId,
      FormID: formId,
      data: formattedAnswers
    }
  );  
}

export const deleteQuestion = (id) => {
  return axiosInstance.delete(`/form/delete/${id}`)
}

export const deleteForm = (formId) => {
  return axiosInstance.delete(`form/delete/${formId}`)
}