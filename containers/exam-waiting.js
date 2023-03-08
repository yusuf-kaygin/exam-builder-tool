import ExamWaiting  from '../components/exam-waiting';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context }, onData) => {
  const { translate } = context();
  onData(null, { translate });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(ExamWaiting);
