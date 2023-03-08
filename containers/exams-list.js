import ExamsList from '../components/exams-list';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { getExamsListParameters } from '/lib/parameters/exams';

export const composer = ({ context }, onData) => {
  const { Meteor, Collections, LocalState, translate } = context();

  const limit = LocalState.get('EXAMS_LIST_LIMIT') || 10;
  const searchQuery = LocalState.get('EXAMS_LIST_SEARCH_QUERY');
  const userId = Meteor.userId();

  if (Meteor.subscribe('Exams.inList', { searchQuery, limit, userId }).ready()) {
    const params = getExamsListParameters({ searchQuery, limit, userId });
    const exams = Collections.Exams.find(params.find, params.options).fetch();
    onData(null, { exams, userId, translate });
  }
};

export const depsMapper = (context, actions) => ({
  onChangeLimit: actions.examsList.changeLimit,
  onClickSearch: actions.examsList.changeSearchQuery,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ExamsList);
