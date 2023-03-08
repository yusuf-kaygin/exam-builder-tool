import React from 'react';
import { getAnswerClass } from '../lib/helpers';
import { getDiffBetweenStartAndEnd } from '/lib/helpers';
import { getCdnUrl,getCdnUrlForHtml } from '../../../../lib/cdn-url';

const handleClickAnswer = (onClickAnswer, examOnGoing, answerDoc, answeringStartedAt) => {
  const elapsedTime = getDiffBetweenStartAndEnd(answeringStartedAt, new Date());
  if (examOnGoing) {
    onClickAnswer({ ...answerDoc, elapsedTime });
  }
};

const renderAnswerItems = ({ answers, userAnswerId, examOnGoing, questionId, answeringStartedAt, onClickAnswer, type }) => {
  const optionsText = ['A', 'B', 'C', 'D', 'E'];

  return answers.map((answer, i) => {
    const answerClass = getAnswerClass({
      answerId: answer._id,
      userAnswerId,
      answerCorrect: answer.correct,
      examOnGoing,
      hasUserExam: true,
      type
    });

    const answerDoc = {
      questionId,
      answerId: answer._id,
      correct: answer.correct,
      point: answer.point,
    };

    return (
      <div key={i}>
        <span className={answerClass} onClick={()=> handleClickAnswer(onClickAnswer, examOnGoing, answerDoc, answeringStartedAt)}>
          {optionsText[i]}
        </span>

        <div dangerouslySetInnerHTML={{ __html: getCdnUrlForHtml(answer.html) }} />
      </div>
    );
  });
}


const QuestionAnswers = ({ answers, userAnswerId, examOnGoing, questionId, answeringStartedAt, onClickAnswer, type }) => (
  <div className="answersBody">
    {renderAnswerItems({ answers, userAnswerId, examOnGoing, questionId, answeringStartedAt, onClickAnswer, type })}
  </div>
)

export default QuestionAnswers;
