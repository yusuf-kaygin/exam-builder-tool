import ExamBody from '../components/exam-body';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, userId, examId, examStatus, exam }, onData) => {
  const { FlowRouter, LocalState, Roles } = context();

  const userExam = LocalState.get('USER_EXAM_DOC');
  const hasUserExam = LocalState.get('HAS_USER_EXAM_ON_EXAMS_STARTUP');
  const isStudent = Roles.userIsInRole(userId, ['staff']);
  const examType = exam && exam.type;
  const description = exam && exam.description;
  if (typeof hasUserExam === 'boolean') {

    if (isStudent && userExam && examType === 'summative' && (userExam.status === 'completed') &&  (examStatus === 'ongoing')) {
      FlowRouter.go('/exam/waiting-to-complete');
      return;
    }

    onData(null, { hasUserExam, userExam, description });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(ExamBody);
