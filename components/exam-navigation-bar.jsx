import React from 'react';

const ExamNavigationBar = ({ questionIndex, onClickNext, onClickPrevious, questionLoading, translate }) => (
  <div className="examNavigationBar">
    <span className="questionNumber">{questionIndex + 1}. {translate('soru')}</span>
    <button disabled={questionLoading} type="button" className="btn btn-sm btn-white pull-right exam-nav-button next" onClick={() => onClickNext(1)}>
      <span className="hidden-xs">{translate('ileri')} </span><i className="fa fa-chevron-right"></i>
    </button>
    <button disabled={questionLoading} type="button" className="btn btn-sm btn-white pull-right exam-nav-button prev" onClick={() => onClickPrevious(-1)}>
      <i className="fa fa-chevron-left"></i> <span className="hidden-xs">{translate('geri')}</span>
    </button>
  </div>
);

ExamNavigationBar.propTypes = {
  questionNumber: React.PropTypes.number,
  onClickNext: React.PropTypes.func,
  onClickPrevious: React.PropTypes.func,
  questionLoading: React.PropTypes.bool,
};

export default ExamNavigationBar;
