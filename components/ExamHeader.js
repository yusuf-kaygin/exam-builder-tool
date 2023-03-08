import React from "react";
import { Link } from "react-router-dom";
import Timer from "./Timer";

class ExamHeader extends React.Component {
  constructor() {
    super();
    this.state = { error: false };
  }
  componentDidMount() {
    $(".modal").modal();
  }

  handleCheckEnteredExam() {
    const { examId } = this.props;
    Meteor.call("exams.checkEnteredExam", examId, err => {
      if (!err) return;
      this.setState({ error: true });
    });
  }

  render() {
    const {
      examName,
      completeTheExam,
      examTime,
      elapsedTime,
      startTimer,
      notAnsweredQuestionCount
    } = this.props;

    const { error } = this.state;

    return (
      <div>
        <div id="completeTheExam" className="modal">
          {!error ? (
            <div>
              {" "}
              <div className="modal-content">
                <h4>Sınav Bitirme Onayı</h4>
                {notAnsweredQuestionCount && notAnsweredQuestionCount > 0 ? (
                  <p>
                    Henüz tamamlanmamış{" "}
                    <span style={{ color: "red" }}>
                      {notAnsweredQuestionCount}
                    </span>{" "}
                    sorunuz bulunmaktadır. Yinede tamamlamak ister misiniz ?
                  </p>
                ) : (
                  <p>Sınavı tamamlamak istediğinizden emin misiniz?</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="modal-content">
                <h4>Sınav Tekrar Uyarısı</h4>
                <p>Bu sınava daha önce girmişsiniz.</p>
              </div>
              <div className="modal-footer">
                <Link
                  to={"/exams/"}
                  className="modal-action modal-close waves-effect waves-light btn btn-default"
                  style={{ marginRight: "1rem" }}
                >
                  SONUÇLARI GÖR
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="card z-depth-1 padding-15">
          <h5>{examName}</h5>
          <div className="col s12">
            {startTimer && (
              <div>
                <div id="coutdown-question">
                  <Timer
                    ref="timer"
                    suggestedTime={examTime * 60}
                    elapsedTime={elapsedTime / 1000}
                    onFinishTimer={() => completeTheExam()}
                  />
                </div>
                <a
                  onClick={this.handleCheckEnteredExam.bind(this)}
                  href="#completeTheExam"
                  className="waves-effect waves-light btn gradient-45deg-red-pink z-depth-2 modal-trigger"
                  title="Sınavı Bitir"
                >
                  SINAVI BİTİR
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ExamHeader;
