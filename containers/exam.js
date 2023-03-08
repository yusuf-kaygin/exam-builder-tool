import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import Exam from '../components/exam';

const composer = ({ context, examId, userId, questionId }, onData) => {
  const { Meteor, Collections, FlowRouter, translate } = context();

  const examSubs = Meteor.subscribe('Exams.single', examId);

  if (examSubs.ready()) {
    const exam = Collections.Exams.findOne(examId);
    onData(null, { exam, translate });
  }
};

export const depsMapper = (context, actions) => ({
  setUserExam: actions.exam.setUserExam,
  unsetUserExam: actions.exam.unsetUserExam,
  setQuestionsWithAnswers: actions.exam.setQuestionsWithAnswers,
  unsetQuestionsWithAnswers: actions.exam.unsetQuestionsWithAnswers,
  startTheExam: actions.exam.startTheExam,
  completeTheExam: actions.exam.completeTheExam,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Exam);
