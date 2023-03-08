import React from 'react';
import ExamBody from '../containers/exam-body';
import ExamQuestionsList from '../containers/exam-questions-list';
import jsPdf from 'jspdf';
import html2canvas from 'html2canvas';

export default class Exam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      studentName: '',
    };

    this.completeTheExam = this.completeTheExam.bind(this);
    this.startTheExam = this.startTheExam.bind(this);
    this.setStudentName = this.setStudentName.bind(this);
  }
  componentDidMount() {
    const { examId, userId, setUserExam, setQuestionsWithAnswers } = this.props;

    setUserExam(examId, userId);
    setQuestionsWithAnswers(examId);
  }
  componentWillUnmount() {
    this.props.unsetQuestionsWithAnswers();
    this.props.unsetUserExam();
  }
  
  setStudentName(studentName) {
    this.setState({studentName});
  }
  
  startTheExam() {
    const { exam, startTheExam } = this.props;
    startTheExam({ _id: exam._id, name: exam.name, createdAt: exam.createdAt });
  }
  completeTheExam() {
    const { exam, userId, examId, completeTheExam } = this.props;
    completeTheExam({ examId, userId, examName: exam.name, examStatus: exam.status, examType: exam.type });
  }
  renderQuestionList({ questionId, translate }) {
    const { exam } = this.props;
    return (exam.type === 'summative' || exam.type === 'formative' || exam.type === 'reward' || exam.type === 'test' || exam.type === 'quiz') ? <noscript /> : (
      <aside className="sm-side">
        <ExamQuestionsList exam={exam} suggestedTime={exam.suggestedTime} currentQuestionId={questionId} completeTheExam={this.completeTheExam} translate={translate} />
      </aside>
    );
  }

  handleSavePdf() {
		const removeElements = document.getElementById('remove-from-div');
    removeElements.remove();
		const input = document.getElementById('main-pdf');
		const pdfDoc = new jsPdf('p', 'mm', 'a4');

		html2canvas(input, { backgroundColor: "#f1f2f7", logging: false })
			.then((canvas) => {
				const imgData = canvas.toDataURL('image/png');

				//Page size in mm
				var pageHeight = 295;
				var imgWidth = 210;

				var imgHeight = canvas.height * imgWidth / canvas.width;
				var heightLeft = imgHeight;
				var position = 0;

				pdfDoc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;

				while (heightLeft >= 0) {
					position = heightLeft - imgHeight;
					pdfDoc.addPage();
					pdfDoc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;
				}

				pdfDoc.save("SinavKagidi.pdf");
        setInterval(function() {
          window.location.reload();
        }, 3000);
			});
	}

  render() {
    const { exam, examId, userId, questionId, translate } = this.props;
    return (
      <div className="mail-box exam-page" id="main-pdf">
        <aside className="lg-side">
          <div className="inbox-head">
            <div style={{display:"inline-block"}}>
              <h3>{exam.name}</h3> <br/>
              <h5><b>Kursiyer:</b> {this.state.studentName }</h5>
            </div>
            <div style={{display:"inline-block"}} className="pull-right" id="remove-from-div">
              <button className="btn btn-default pull-right margin-left-10" onClick={() => this.handleSavePdf()}>
                <i className="fa fa-save"></i> Pdf İndir
              </button>
              <a className="btn btn-primary pull-right" href={`/users/profile/${userId}/enteredTheExams`}>
                Sınav Listesi
              </a>
            </div>
          </div>
	  <ExamBody exam={exam} startTheExam={this.startTheExam} setStudentName={this.setStudentName} completeTheExam={this.completeTheExam} examId={examId} userId={userId} examStatus={exam.status} translate={translate} />
        </aside>
        
        {this.renderQuestionList({ questionId, translate })}

      </div>
    );
  }
}

Exam.propTypes = {
  exam: React.PropTypes.object.isRequired,
};
