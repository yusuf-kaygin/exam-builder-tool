import React, { Component } from 'react';
import ExamQuestionsListItem from './exam-questions-list-item';
import ExamNavigationBar from './exam-navigation-bar';
import ExamTimer from './exam-timer';
import { findQuestionIndexes } from '../lib/helpers';

export default class ExamQuestionsList extends Component {
  constructor(props) {
    super(props);

    this.goQuestion = this.goQuestion.bind(this);
  }
  componentDidMount() {
    const { currentQuestionId, setSelectedQuestionId } = this.props;

    if (currentQuestionId) {
      setSelectedQuestionId(currentQuestionId)
    } else {
      this.goQuestion(1);
    }
  }
  componentWillUnmount() {
    const { setSelectedQuestionId } = this.props;
    setSelectedQuestionId(''); //unset selected questionId
  }
  goQuestion(incValue) {
    const { questions, selectedQuestionId, setSelectedQuestionId } = this.props;

    const questionsArr = _.flatten(_.pluck(questions, 'list'));
    const questionsId = _.pluck(questionsArr, '_id');

    const index = _.indexOf(questionsId, selectedQuestionId);
    const question = questionsId[index + incValue];

    if (question) {
      setSelectedQuestionId(question);
    }
  }

  renderQuestionListItems(questionsLessonIndex) {
    const { questions, selectedQuestionId, setSelectedQuestionId, userExam, hasUserExam, userAnswers } = this.props;
    return questions.map(({ lesson, list }, i) => (
      <ExamQuestionsListItem
        key={i}
        index={i}
        lesson={lesson}
        lessonIndex={questionsLessonIndex}
        questionsOfLesson={list}
        selectedQuestionId={selectedQuestionId}
        onClickQuestion={(qId) => setSelectedQuestionId(qId)}
        hasUserExam={hasUserExam}
        userExam={userExam}
        userAnswers={userAnswers} />
    ))
  }
// control for exam type test 
  renderExamTimer({suggestedTime, userExam, elapsedTime, completeTheExam, saveAnswersToDb, translate}) {
    return suggestedTime === 0 ? '' : <ExamTimer
					suggestedTime={suggestedTime}
					onGoing={userExam && userExam.status === 'ongoing'}
					elapsedTime={elapsedTime}
					onFinish={completeTheExam}
					tickCallback={saveAnswersToDb}
					translate={translate} /> ;
  }
  //control for exam type test
  renderExamNavigatorBar({suggestedTime, questionIndex, translate}) {
    return suggestedTime === 0 ? '' :   <ExamNavigationBar
					  questionLoading={false}
					  questionIndex={questionIndex || 0}
					  onClickNext={this.goQuestion}
					  onClickPrevious={this.goQuestion}
					  translate={translate} /> ;
  }

  render() {
    const { exam, questions, suggestedTime, userExam, selectedQuestionId, elapsedTime, completeTheExam, saveAnswersToDb, translate } = this.props;
    const { questionIndex, questionsLessonIndex } = findQuestionIndexes({ questions, currentQuestionId: selectedQuestionId });

    return (
      <div>
	{this.renderExamTimer({suggestedTime, userExam, elapsedTime, completeTheExam, saveAnswersToDb, translate})}
        <div className="inbox-body hidden-xs" style={{ height: window.innerHeight - 120, overflowY: "auto" }}>
          <div className="panel-group" id="accordion1">
            {this.renderQuestionListItems(questionsLessonIndex)}
          </div>
        </div>
	{this.renderExamNavigatorBar({suggestedTime, questionIndex, translate})}
      </div>
    );
  }
};
