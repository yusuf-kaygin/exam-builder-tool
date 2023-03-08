import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import ExamQuestionsList from '../components/exam-questions-list';

const composer = ({ context }, onData) => {
  const { LocalState } = context();

  const userAnswersInExam = LocalState.get('USER_ANSWERS_IN_EXAM');

  const userAnswers = !!userAnswersInExam && userAnswersInExam.answers || [];
  const elapsedTime = !!userAnswersInExam && userAnswersInExam.elapsedTime || 0;

  const questions = LocalState.get('EXAMS_QUESTIONS_WITH_ANSWERS');
  const selectedQuestionId = LocalState.get('SELECTED_QUESTION_ID_IN_EXAM');

  const hasUserExam = LocalState.get('HAS_USER_EXAM_ON_EXAMS_STARTUP');
  const userExam = LocalState.get('USER_EXAM_DOC');

  if (questions) {
    onData(null, { questions, selectedQuestionId, userExam, hasUserExam, userAnswers, elapsedTime });
  }
};


export const depsMapper = (context, actions) => ({
  setSelectedQuestionId: actions.exam.setSelectedQuestionId,
  saveAnswersToDb: actions.exam.saveAnswersToDb,
  context: () => context,
});


export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ExamQuestionsList);
