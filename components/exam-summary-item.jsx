import React from 'react';

const getLessonsResult = ({ results=[], lessonId }) => {
  let lessonResults = { correct: 0, wrong: 0, empty: 0 };

  const findLesson = _.find(results, (doc) => doc.lesson && doc.lesson._id === lessonId);

  if (findLesson && findLesson.result) {
    lessonResults = { ...findLesson.result };
  }

  return lessonResults;
};

const ExamSummaryItem = ({ results, lesson }) => {
  const lessonId = lesson && lesson._id ? lesson._id : '';
  const { correct, wrong, empty } = getLessonsResult({ results, lessonId });

  return (
    <span className="exam-summary pull-right">
      <span className="badge correct" title="Doğru">{correct}</span>
      <span className="badge wrong" title="Yanlış">{wrong}</span>
      <span className="badge empty" title="Boş">{empty}</span>
    </span>
  );
};

export default ExamSummaryItem;
