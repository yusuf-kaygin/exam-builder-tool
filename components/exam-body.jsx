import React from 'react';
import Question from '../containers/question';
import ExamStarter from './exam-starter';
import ExamControlBar from './exam-control-bar';
import Quiz from './quiz.jsx';





export default class ExamBody extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {userExam }  = this.props;

    if(userExam){
      this.props.setStudentName(userExam.user.namesurname ? userExam.user.namesurname : userExam.user.name);
    }

  }

  renderBody = ({ exam, startTheExam, hasUserExam, userExam, translate, description }) => {
    const QuizOrExam = (exam.type === 'summative' || exam.type === 'formative' || exam.type === 'reward' || exam.type === 'quiz' || exam.type === 'test') ? <Quiz exam={exam} questions={exam.questions} userExam={userExam} />  : <Question userExam={userExam} exam={exam} /> ;
    return hasUserExam ? QuizOrExam : <ExamStarter onClickStart={startTheExam} translate={translate} description={description} />
  }

  render() {
    const { exam, startTheExam, hasUserExam, userExam, translate, description }  = this.props;
    return (
      <div>
        <div className="inbox-body">
          <div>
            {this.renderBody({ exam, startTheExam, hasUserExam, userExam, translate, description })}
          </div>
        </div>
        { /* <ExamControlBar showFinishButton={examOnGoing} onClickFinish={completeTheExam} translate={translate} userId={userId} /> */ }
      </div>
    );
  }
}

