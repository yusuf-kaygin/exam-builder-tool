import React from "react";
import $ from "jquery";

class ExamOptikForm extends React.Component {
  constructor() {
    super();
    this.state = {
      openIndex: 0,
    };
  }
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {}

  RenderOption(answerLabel, questionWithAnswer, questionIndex) {
    let { onSaveAnswer, showResult } = this.props;
    let lesson = questionWithAnswer.lesson ? questionWithAnswer.lesson  : "";
    let topic = questionWithAnswer.topic ? questionWithAnswer.topic  : "";
    let optionClass = answerLabel === questionWithAnswer.answerLabel ? "selected" : "";
    if (showResult && answerLabel === questionWithAnswer.correctLabel) {
      optionClass += " correctAnswer";
    }

    return (
      <span
        key={questionIndex + answerLabel}
        className={`questionOption ${optionClass}`}
        onClick={() =>
          onSaveAnswer(
            questionIndex,
            answerLabel,
            questionWithAnswer.correctLabel,
            lesson,
            topic
          )
        }
      >
        {answerLabel}
      </span>
    );
  }

  render() {

    const options = ["A", "B", "C", "D", "E"];
    return ( this.props.list.length > 0 ? (
        <ul
          style={{ margin: 0 }}
        >
          <li
            key={0}
            onClick={() => {
              this.setState({ openIndex: 0 });
            }}
          >
                {this.props.list.map((questionWithAnswer, questionIndex) => (
                  <a
                    href="#!"
                    key={questionWithAnswer.questionId}
                    className={`questionRow`}
                  >
                    <span className="question-index">{questionIndex + 1}.</span>
                    {options.map(answerLabel =>
                      this.RenderOption(
                        answerLabel,
                        questionWithAnswer,
                        questionIndex
                      )
                    )}
                  </a>
                ))}
          </li>
        </ul>
    ) : (
        <ul
          style={{ margin: 0 }}
        >
          {this.props.listJson.map((el, i) => (
            <li
              key={i}
              onClick={() => {
                this.setState({ openIndex: i });
              }}
            >
              <div className="collapsible-header" style={{ fontSize: "16px", fontWeight: "400", paddingBottom: "5px" , paddingTop: "2px" }}>
                {el.lessonName}
              </div>
                {el.list.map((questionWithAnswer) => (
                  <a
                    href="#!"
                    key={questionWithAnswer.questionId}
                    className={`questionRow`}
                  >
                    <span className="question-index">{questionWithAnswer.questionId + 1}.</span>
                    {options.map(answerLabel =>
                      this.RenderOption(
                        answerLabel,
                        questionWithAnswer,
                        questionWithAnswer.questionId
                      )
                    )}
                  </a>
                ))}
            </li>
          ))}
        </ul>
    ));
  }
}

export default ExamOptikForm;
