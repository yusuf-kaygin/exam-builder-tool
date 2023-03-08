import Question from '../components/question';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, userExam, testQuestionId }, onData) => {
  const { Meteor, Collections, LocalState } = context();

  const selectedQuestionId = LocalState.get('SELECTED_QUESTION_ID_IN_EXAM');
  const userAnswersInExam = LocalState.get('USER_ANSWERS_IN_EXAM');

  const questionId = testQuestionId || selectedQuestionId ;
  const userAnswers = !!userAnswersInExam && userAnswersInExam.answers || [];

  if (questionId && userExam && Meteor.subscribe('Questions.single', questionId).ready()) {
    const question = Collections.Questions.findOne(questionId);
    const examOnGoing = userExam.status === 'ongoing';
    const answeringStartedAt = new Date();

    onData(null, { question, examOnGoing, answeringStartedAt, userAnswers });
  }
};

export const depsMapper = (context, actions) => ({
  saveAnswer: actions.exam.saveAnswer,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Question);
