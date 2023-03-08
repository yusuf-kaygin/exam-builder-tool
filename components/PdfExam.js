import React from "react";
import { notifier } from '/client/js/notifier';
import { _ } from "lodash";
import PDFViewer from 'mgr-pdf-viewer-react';
import ExamHeader from "../components/ExamHeader";
import ExamOptikForm from "../components/ExamOptikForm";
import ExamResult from "../components/ExamResult";

class PdfExam extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      examName: "",
      pdfFile: "",
      suggestedTime: 0,
      questionCount: 0,
      elapsedTime: 0,
      result: { wrong: 0, correct: 0, empty: 0, grade: 0 },
      completed: false,
      examId: "",
      answers: [],
      answersJson: {},
      numPages: null,
      pageNumber: 1,
    };
  }

  componentDidMount() {
    const examId = this.props.examId;
    const userId = this.props.userId;

    NProgress.start();
    Meteor.call("exams.getPdfExamInfos", {examId, userId} , (err, res) => {
      NProgress.done();
      if (err) {
        notifier.send(err.reason, "error");
      }
      else {
        this.setState({
          ...res,
          examId,
          loading: false,
        });
      }
    });
  }

  handleAnswerQuestion(questionIndex, answerLabel, correctLabel, lessonValue, topicValue) {

    const examId = this.props.match.params._id;
    const elapsedTime = this.getElapsedTime();
    const lesson = lessonValue ? lessonValue : '';
    const topic = topicValue ? topicValue : '';

    let questionWithAnswers = this.state.answers;
    let questionWithAnswersNew  =  questionWithAnswers.map((el, index) => {
      return {
        questionId : index,
        answerLabel : questionIndex == el.questionId ? answerLabel : el.answerLabel,
        correctLabel : el.correctLabel
      };
    });

    let questionWithAnswersJson = this.state.answersJson;
    const questionWithAnswersJsonNew = questionWithAnswersJson.map(el => {
      const list = el.list.map(question => {
        if (question.questionId === questionIndex) {
          Object.assign(question, { answerLabel });
        }
        return question;
      });
      Object.assign(el, { list });
      return el;
    });

    this.setState({ answers: questionWithAnswersNew, answersJson: questionWithAnswersJsonNew});

    Meteor.call(
      "exams.answerQuestionPdf",
      examId,
      questionIndex,
      answerLabel,
      correctLabel,
      elapsedTime,
      lesson,
      topic
    );
  }

  handleCompleteTheExam() {
    const examId = this.props.match.params._id;
    const elapsedTime = this.getElapsedTime();

    Meteor.call("exams.completeTheExam", examId, elapsedTime, err => {
      if (!err) {
        return this.props.history.push(`/exams/${examId}/finish`);
      } else {
        this.props.history.push("/exams");
        return Materialize.toast(err, 2000, "t-error");
      }
    });
  }

  getElapsedTime() {
    const remainingTime =
      (this.header &&
        this.header.refs.timer &&
        this.header.refs.timer.state.remainingTime) ||
      0;
    return remainingTime === 0
      ? 0
      : (this.state.suggestedTime * 60 - remainingTime) * 1000;
  }

  render() {
    const { pdfFile } = this.state;
    return (
      <section className="content">
        {this.state.loading ? (
          <div className="row">
            <div className="col s12">
              <div className="card z-depth-1 padding-15">
                <div className="row">
                  <h5>Sınav hazırlanıyor...</h5>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12">
                <ExamResult
                  showResult={this.state.completed}
                  examResult={this.state.result}
                  examTime={this.state.suggestedTime}
                  elapsedTime={this.state.elapsedTime}
                />
            </div>
            <div className="col-md-9">
              <PDFViewer scale="1.4"
                document={{
                  url: `${pdfFile}`,
                }}
              />
            </div>
            <div className="col-md-3">
              <div className="row">
                <ExamOptikForm
                    showResult={this.state.completed}
                    list={this.state.answers}
                    listJson={this.state.answersJson}
                    questionCount={this.state.questionCount}
                    onSaveAnswer={(questionIndex, answerLabel, correctLabel, lesson, topic) =>
                      this.handleAnswerQuestion(questionIndex, answerLabel, correctLabel, lesson, topic)
                    }
                  />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default PdfExam;
