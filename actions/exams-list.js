export default {
  changeLimit({ LocalState }, limit) {
    LocalState.set('EXAMS_LIST_LIMIT', parseInt(limit, 10));
  },
  changeSearchQuery({ LocalState }, searchQuery) {
    LocalState.set('EXAMS_LIST_SEARCH_QUERY', searchQuery);
  },
};

