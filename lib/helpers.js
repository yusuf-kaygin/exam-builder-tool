export const findQuestionIndexes = ({ questions, currentQuestionId }) => {
  let questionIndex = 0;
  let questionsLessonIndex = 0;

  const indexesArr = _.map(questions, (item) => _.indexOf(_.pluck(item.list, "_id"), currentQuestionId));

  questionIndex = _.find(indexesArr, (num) => num !== -1);
  questionsLessonIndex = _.indexOf(indexesArr, questionIndex);

  return { questionIndex, questionsLessonIndex };
};

export const getFirstQuestion = ({ questions }) => {
  const questionsArr = _.flatten(_.pluck(questions, 'list'));
  return questionsArr[0];
};

export const getAnswerClass = ({ answerId, userAnswerId, answerCorrect, examOnGoing, hasUserExam, type }) => {
  const selected = answerId === userAnswerId ? 'selected' : '';
  const correct = !examOnGoing && answerCorrect ? 'correctAnswer' : '';

  if (type === 'test') {
    return `questionOption ${selected}`;
  }

  if (hasUserExam) {
    return `questionOption ${selected} ${correct}`;
  }

  return `questionOption`;
};

export const getUserAnswerId = ({ userAnswers, questionId }) => {
  const userAnswer = _.find(userAnswers, (item) => item.questionId === questionId)
  return !!userAnswer && userAnswer.answerId;
};
