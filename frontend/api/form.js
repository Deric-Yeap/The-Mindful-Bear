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

// export const setFormQuestion = async (sessionId, questionId, response) => {
//   const data = {
//     SessionID: sessionId,
//     QuestionID: questionId,
//     Response: response,
//   };
//   console.log(data)
//   return await axiosInstance.post('formQuestion/create/', data);  
// }

export const setFormQuestion = async (sessionId, answers) => {  
  return await axiosInstance.post('formQuestion/create/', 
    {
    SessionID: sessionId,
    data : answers
    }
  );  
}

