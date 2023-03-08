import React from 'react';
import QuestionAnswers from './question-answers';
import QuestionVideo from './question-video';
import { getUserAnswerId } from '../lib/helpers.js';
import 'katex/dist/katex.min.css';
import { getCdnUrl,getCdnUrlForHtml } from '../../../../lib/cdn-url';

const Question = ({ exam, question, userAnswers, saveAnswer, examOnGoing, answeringStartedAt, questionNumber }) => {
  const questionNumberForQuiz = (exam && exam.type === 'quiz') ? (questionNumber + 1).toString() : '';
  return (
    <div className="panel">
      <div className="panel-body">
        <div className="questionBody">
          <div dangerouslySetInnerHTML={{ __html: getCdnUrlForHtml(questionNumberForQuiz + question.html)}} />
        </div>

        <QuestionAnswers
          answers={question.answers}
          userAnswerId={getUserAnswerId({ userAnswers, questionId: question._id })}
          questionId={question._id}
          onClickAnswer={saveAnswer}
          examOnGoing={examOnGoing}
          answeringStartedAt={answeringStartedAt}
          type={exam.type}
           />
        <QuestionVideo video={question.video} examOnGoing={examOnGoing} />
      </div>
    </div>
  );
}
Question.propTypes = {
  question: React.PropTypes.object,
  onAnswer: React.PropTypes.func,
};

export default Question;
