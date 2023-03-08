import React from 'react';
import Question from '../containers/question';

const Quiz = ({ exam, questions, userExam }) => {
  const questionList = _.pluck(questions, 'list');
  const questionIds = _.flatten(questionList);

  return (
    <div>
      {
        userExam.proposal  ?
        <div className="center">
          <div className="alert alert-warning fade in" dangerouslySetInnerHTML={{ __html: userExam.proposal }} />
        </div>
        :
        questionIds.map((questionId, questionNumber) =>    {
          return(
            <div className="col-lg-6" key={questionNumber}>
              <Question exam={exam} testQuestionId={questionId} userExam={userExam} questionNumber={questionNumber} />
            </div>

          )
        })
      }
    </div>
  )
};


export default Quiz;
