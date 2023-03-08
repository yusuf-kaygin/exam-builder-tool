import React from 'react';
import { getAnswerClass, getUserAnswerId } from '../lib/helpers';
import ExamSummaryItem from './exam-summary-item';

const selectedStyle = (selectedQuestionId, questionId) => {
  return questionId === selectedQuestionId ? { backgroundColor: '#ECECEC' } : {};
};

const renderQuestionOptions = ({ userAnswerId, answers, examOnGoing, hasUserExam }) => {
  const optionsText = ['A', 'B', 'C', 'D', 'E'];

  return answers.map((answer, i) => {
    const answerClass = getAnswerClass({
      answerId: answer._id,
      userAnswerId,
      answerCorrect: answer.correct,
      examOnGoing,
      hasUserExam
    });

    return <span key={i} className={answerClass}>{optionsText[i]}</span>;
  });
};

const renderExamSummaryItem = ({ userExam, lesson }) => {
  const examCompleted = userExam && userExam.status === 'completed' && userExam.resultsByLessons;
  return examCompleted ?
    <ExamSummaryItem results={userExam.resultsByLessons} lesson={lesson} />
    : <noscript />;
};

const ExamQuestionsListItem = ({
  index, lesson, questionsOfLesson,
  selectedQuestionId, onClickQuestion, lessonIndex,
  userExam, userAnswers, hasUserExam,
}) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="row">
        <div className="col-lg-6 lesson-name">
          <a href={`#${lesson._id}`} data-parent="#accordion1" data-toggle="collapse" className={`accordion-toggle ${index === lessonIndex ? '' : 'collapsed'}`}>
            {lesson.name}
          </a>
        </div>
        <div className="col-lg-6">
          {renderExamSummaryItem({ userExam, lesson })}
        </div>
      </div>
    </div>
    <div className="panel-collapse collapse in" id={`${lesson._id}`}>
      <div className="panel-body questionsListOfLesson">
        <ol>
          {
            questionsOfLesson.map((question, i) => (
              <li key={i}>
                <div onClick={() => onClickQuestion(question._id)} style={selectedStyle(selectedQuestionId, question._id)}>
                  {
                    renderQuestionOptions({
                      userAnswerId: getUserAnswerId({ userAnswers, questionId: question._id }),
                      answers: question.answers,
                      examOnGoing: userExam && userExam.status === 'ongoing',
                      hasUserExam,
                    })
                  }
                </div>
              </li>
            ))
          }
        </ol>
      </div>
    </div>
  </div>
);

ExamQuestionsListItem.propTypes = {
  index: React.PropTypes.number,
  lessonIndex: React.PropTypes.number,
  lesson: React.PropTypes.object,
  examId: React.PropTypes.string,
  questionsOfLesson: React.PropTypes.array,
  selectedQuestionId: React.PropTypes.string,
  onClickQuestion: React.PropTypes.func,
  listHeight: React.PropTypes.number,
  userExam: React.PropTypes.object,
};

export default ExamQuestionsListItem;
