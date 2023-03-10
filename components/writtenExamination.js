import React, { Component } from "react";
import { getCdnUrl } from "../../../../lib/cdn-url";
import { NProgress } from "meteor/mrt:nprogress";
import { notifier } from "/client/js/notifier";
import { FlowRouter } from "meteor/kadira:flow-router";
import _ from "lodash";

class WrittenExamination extends Component {
  state = {
    loading: true,
    examInfo: null,
    lessonAnswers: null,
  };

  componentDidMount() {
    this.getExam();
  }

  getExam() {
    let { examId, userId } = this.props;
    Meteor.call("getExamInfo", examId, userId, (err, res) => {
      if (err) return;
      console.log(res);

      let groupLessonAnswer = _.groupBy(res.answers, "lesson");
      let lessonAnswers = new Array();
      delete res.answers;

      for (const [key, value] of Object.entries(groupLessonAnswer)) {
        lessonAnswers.push({
          title: key,
          answers: value,
        });
      }
      this.setState({ examInfo: res, loading: false, lessonAnswers });
    });
  }

  givePoint = (questionId, point, examPoint) => {
    this.changeState(questionId, point, "point");

    if (!point) return;
    if (point > examPoint)
      return notifier.send(
        `Bu soruya en fazla ${examPoint} puan verebilirsiniz.`,
        "error"
      );

    NProgress.start();
    let { _id } = this.state.examInfo;
    Meteor.call("userExam.rateQuestion", _id, questionId, point, () =>
      NProgress.done()
    );
  };

  errorQuestion = (questionId) => {
    let item = document.getElementById(questionId);
    item.style.border = "5px solid darkred";
  };

  styleFixed = () => {
    let items = document.querySelectorAll(".question-box");
    var index = 0,
      length = items.length;
    for (; index < length; index++) {
      items[index].style.border = "1px solid rgb(211 211 211)";
    }
  };

  checkInputs = () => {
    this.styleFixed();
    let { lessonAnswers } = this.state;
    let isSecure = true;
    lessonAnswers.forEach((lesson) => {
      lesson.answers.forEach((answer) => {
        if (!isSecure) return;
        let { point, examPoint, status } = answer;

        if (!status) {
          // window.location.href = `#${answer.questionId}`;
          this.errorQuestion(answer.questionId);
          isSecure = false;
          notifier.send(`B??t??n sorular??n durumu i??aretlenmi?? olmal??.`, "error");
          return;
        }
        if (answer.status == "empty") {
          point = 0;
        }

        if (!point && point !== 0) {
          // window.location.href = `#${answer.questionId}`;
          this.errorQuestion(answer.questionId);
          isSecure = false;
          notifier.send(`B??t??n sorular puanlanmal??.`, "error");
          return;
        }

        if (examPoint < point) {
          // window.location.href = `#${answer.questionId}`;
          this.errorQuestion(answer.questionId);
          isSecure = false;
          notifier.send(
            `Soruya verdi??iniz puan soru puan??ndan fazla olmamal??. `,
            "error"
          );
          return;
        }
      });

      if (!isSecure) return;
    });

    return isSecure;
  };

  examReadingCompleted = () => {
    let isSecure = this.checkInputs();
    if (!isSecure) return;

    if (!confirm("Bitirmek istedi??inize emin misiniz ?")) return;
    NProgress.start();
    let { examId, userId } = this.props;
    Meteor.call("exams.readingCompleted", examId,userId, () => {
      NProgress.done();
      notifier.send(`Okuma tamamland??.`);
      FlowRouter.go(`/exam/${examId}/evaluate`);
    });
  };

  changeState = (questionId, value, type) => {
    let changeObject;
    this.state.lessonAnswers.forEach((lesson) => {
      changeObject = lesson.answers.find((o) => o.questionId == questionId);
      if (changeObject !== undefined) {
        if (type == "status") changeObject.status = value;
        if (type == "point") changeObject.point = value;
      }
    });
  };

  questionStatus = (questionId, questionStatus) => {
    if (questionStatus == "null") return;
    this.changeState(questionId, questionStatus, "status");

    NProgress.start();
    let { _id } = this.state.examInfo;
    Meteor.call(
      "userExam.questionStatus",
      _id,
      questionId,
      questionStatus,
      () => NProgress.done()
    );
  };

  header() {
    const { examInfo } = this.state;
    return (
      <div className="exam-header">
        <div>
          <div>
            <img src={getCdnUrl(examInfo.user.avatar)} />
          </div>
          <div>{examInfo.user.namesurname}</div>
        </div>

        <div>
          <div>{examInfo.exam.name}</div>
          <div>
            Tamamlama s??resi - {Math.round(examInfo.elapsedTime / (1000 * 60))}{" "}
            dakika
          </div>
        </div>

        {examInfo.isExamChecked && (
          <div className="exam-read">
            <div>
              <b>{examInfo.result.correct}</b> Do??ru
            </div>
            <div>
              <b>{examInfo.result.wrong}</b> Yanl????
            </div>
            <div>
              <b>{examInfo.result.empty}</b> Bo??
            </div>
            <div>
              <b>{examInfo.result.grade} </b> Puan
            </div>
          </div>
        )}

        {!examInfo.isExamChecked && (
          <button
            className="btn btn-dark"
            onClick={this.examReadingCompleted}
            title="Puanlamay?? bitirmek i??in t??kla."
          >
            Bitir
          </button>
        )}
      </div>
    );
  }

  body() {
    const { lessonAnswers, examInfo } = this.state;
    console.log(lessonAnswers);
    return (
      <div className="exam-body">
        <div className="questions">
          {lessonAnswers.map((lesson, index) => (
            <div key={index} className="row lesson-item">
              <div className="lesson-title">{lesson.title}</div>
              <div className="hr" />
              <div className="lesson-question">
                {lesson.answers.map((question, index) => (
                  <div className="col-sm-6" key={question.questionId}>
                    <div
                      className={`question-box ${
                        examInfo.isExamChecked && question.status == "true"
                          ? "correct-question"
                          : ""
                      }${
                        examInfo.isExamChecked && question.status == "false"
                          ? "wrong-question"
                          : ""
                      }${
                        examInfo.isExamChecked && question.status == "empty"
                          ? "empty-question"
                          : ""
                      }
                    `}
                      id={question.questionId}
                    >
                      <div className="question-header">
                        <div>{index + 1}. Soru</div>
                        <div>{question.examPoint} PUAN</div>
                      </div>
                      <div className="question">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: question.question,
                          }}
                        />
                      </div>

                      <div className="answer">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: question.answerText,
                          }}
                        />
                      </div>
                      <div className="point">
                        <div>
                          {question.topic} | {question.subTopic}
                        </div>

                        {examInfo.isExamChecked &&
                        question.status !== "empty" ? (
                          <div>
                            <b>{question.point ? question.point : 0} Puan verildi</b>
                          </div>
                        ) : (
                          ""
                        )}

                        {!examInfo.isExamChecked &&
                        question.status !== "empty" ? (
                          <div>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              max={question.examPoint}
                              onChange={(e) =>
                                this.givePoint(
                                  question.questionId,
                                  Number(e.target.value),
                                  Number(question.examPoint)
                                )
                              }
                              defaultValue={question.point}
                            />

                            <select
                              name="question-status"
                              className="form-control"
                              defaultValue={
                                question.status ? question.status : ""
                              }
                              onChange={(e) =>
                                this.questionStatus(
                                  question.questionId,
                                  e.target.value
                                )
                              }
                            >
                              <option defaultChecked="checked" value="null">
                                Durum
                              </option>
                              <option value="true">Do??ru</option>
                              <option value="false">Yanl????</option>
                              {/* <option value="empty">Bo??</option> */}
                            </select>
                          </div>
                        ) : (
                          ""
                        )}

                        {question.status == "empty" && <b>Bo?? B??rak??lm????</b>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="written-examination">
        {!loading && (
          <div>
            {this.header()}
            {this.body()}
          </div>
        )}

        {loading && <div>Yukleniyor</div>}
      </div>
    );
  }
}

export default WrittenExamination;
