import axiosInstance from '../common/axiosInstance'

export const CreateFormAndQuestion = (data) => {
  return axiosInstance.post('form/create-form-and-questions', data)
}

export const getForms = async () => {
  return axiosInstance.get('form/get')
}

async function fetchOptionSet(optionSetId) {
  return axiosInstance.get(`option/getOptions/${optionSetId}`);  
}

export const getFormQuestions = async (formId) => {
  response = await axiosInstance.get(`form/get-form-and-questions/${formId}`);
  const formName = response.form_name
  response = response.questions;
  const enhancedData = await Promise.all(
    response.map(async (item) => {
      const optionSet = await fetchOptionSet(item.optionSet);  
      return { ...item, optionValues: optionSet };  
    })
  );
  console.log(enhancedData)
  return {formName, enhancedData};
}

export const setFormQuestion = async (sessionId, answers) => {  
  const formattedAnswers = Object.keys(answers).map(questionId => ({
    QuestionID: parseInt(questionId),        
    Response: answers[questionId]
  }));

  return await axiosInstance.post('formQuestion/bulk_create/', 
    {
      // SessionID: sessionId,
      SessionID: 58,
      data: formattedAnswers
    }
  );  
}