import axiosInstance from '../common/axiosInstance';

export const CreateFormAndQuestion = (data) => {
  return axiosInstance.post('form/create-form-and-questions', data);
};

export const UpdateFormAndQuestion = (formId, data) => {
  return axiosInstance.put(`form/update-form-and-questions/${formId}`, data);
};

export const getForms = async () => {
  return axiosInstance.get('form/get');
};

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
  const formattedAnswers = Object.keys(answers).map((questionId) => ({
    QuestionID: parseInt(questionId, 10),
    Response: answers[questionId],
  }));

  return await axiosInstance.post('formQuestion/bulk_create/', {
    SessionID: sessionId,
    FormID: formId,
    data: formattedAnswers,
  });
};

export const deleteQuestion = (id) => {
  return axiosInstance.delete(`/form/delete/${id}`);
};

export const deleteForm = (formId) => {
  return axiosInstance.delete(`form/delete/${formId}`);
};

export const createLandmarkRatings = async (sessionID) => {
  try {
    const landmarks = await axiosInstance.get(`users/session-landmarks/${sessionID}/`);
    const form = await getFormQuestions('88');
    const oldQuestions = form.questions;
    const newQuestions = [];
    const landmarkImageMap = {};

    landmarks.forEach((landmark) => {
      landmarkImageMap[landmark.landmark_name] = landmark.image_file_url;
    });

    landmarks.forEach((landmark) => {
      const landmarkName = landmark.landmark_name;
      const exerciseName = landmark.exercise.exercise_name;
      const landmarkExists = form.questions.some((question) =>
        question.question.includes(landmarkName)
      );

      if (!landmarkExists) {
        newQuestions.push({
          question: `How would you rate the landmark ${landmarkName}?`,
          order: landmark.landmark_id,
          optionSet: 5,
        });
      }

      const exerciseExists = form.questions.some((question) =>
        question.question.includes(exerciseName) && question.question.includes(landmarkName)
      );

      if (!exerciseExists) {
        newQuestions.push({
          question: `How would you rate the exercise ${exerciseName} at ${landmarkName}?`,
          order: landmark.exercise.exercise_id,
          optionSet: 5,
        });
      }
    });

    const combinedList = [...newQuestions, ...oldQuestions];
    const wrappedObject = { questions: combinedList };
    const update = await UpdateFormAndQuestion('88', wrappedObject);

    update.questions = update.questions
      .filter((question) =>
        landmarks.some((landmark) => question.question.includes(landmark.landmark_name))
      )
      .map((question) => {
        const landmarkName = landmarks.find((landmark) =>
          question.question.includes(landmark.landmark_name)
        ).landmark_name;
        return {
          ...question,
          image_file_url: landmarkImageMap[landmarkName],
        };
      });

    return update;
  } catch (error) {
    console.error(error);
  }
};
