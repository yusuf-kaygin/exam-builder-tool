import localStorage from 'localStorage';
import { translate } from '/lib/i18n/i18n';

export default {
  startTheExam({ Meteor, LocalState, NProgress, notifier }, exam) {
    NProgress.start();
    Meteor.call('UserExam.start', exam, (error, userExam) => {
      NProgress.done();
      if (error) {
        notifier.send(error.message, 'error');
      } else {
        const userExamAnswersDoc = { userExamId: userExam._id, answers: [], elapsedTime: 0 };

        LocalState.set('USER_ANSWERS_IN_EXAM', userExamAnswersDoc)
        localStorage.setItem('userAnswersInExam', JSON.stringify(userExamAnswersDoc));

        LocalState.set('USER_EXAM_DOC', userExam);
        LocalState.set('HAS_USER_EXAM_ON_EXAMS_STARTUP', true);
        notifier.send(translate('sinav_basladi'));
      }
    });
  },
  completeTheExam({ Meteor, NProgress, LocalState, notifier, FlowRouter }, { examId, examName, examStatus, userId, examType }) {
    const userAnswers = JSON.parse(localStorage.getItem('userAnswersInExam'));

    NProgress.start();
    Meteor.call('UserExam.complete', { userId, examId, examName, userAnswers, examType }, (error, { resultsByLessons, proposalContent }) => {
      NProgress.done();
      if (error) {
        notifier.send(error.message, 'error');
      } else {
        if (examType === 'summative' && examStatus === 'ongoing') {
          return FlowRouter.go('/exam/waiting-to-complete');
        } else {
          const currentUserExam = LocalState.get('USER_EXAM_DOC');
          LocalState.set('USER_EXAM_DOC', { ...currentUserExam, resultsByLessons, status: 'completed', proposal:proposalContent });
          notifier.send(translate('sinav_bitti'));
        }
      }
    });
  },
  saveAnswersToDb({ Meteor, notifier }) {
    const currentUserAnswers = JSON.parse(localStorage.getItem('userAnswersInExam'));

    Meteor.call('UserExam.saveAnswers', currentUserAnswers, (error) => {
      if (error) {
        notifier.send(error.message, 'error');
      }
    });
  },
  saveAnswer({ LocalState }, doc) {
    const currentUserAnswers = JSON.parse(localStorage.getItem('userAnswersInExam'));
    const { userExamId, answers, elapsedTime } = currentUserAnswers;

    const uniqueCurrentUserAnswers = answers.filter((item) => {
      return item.questionId !== doc.questionId;
    })

    const userAnswersDoc = {
      userExamId,
      answers: [ ...uniqueCurrentUserAnswers, doc ],
      elapsedTime: elapsedTime + doc.elapsedTime,

    };
    LocalState.set('USER_ANSWERS_IN_EXAM', userAnswersDoc)
    localStorage.setItem('userAnswersInExam', JSON.stringify(userAnswersDoc));
  },
  setQuestionsWithAnswers({ Meteor, LocalState, notifier }, examId) {
    Meteor.call('Exams.setQuestionsWithAnswers', { examId }, (err, res) => {
      if (err) {
        notifier.send(err.message, 'error');
      } else {
        LocalState.set('EXAMS_QUESTIONS_WITH_ANSWERS', res);
      }
    });
  },
  unsetQuestionsWithAnswers({ LocalState }) {
    LocalState.set('EXAMS_QUESTIONS_WITH_ANSWERS', null);
  },
  setUserExam({ Meteor, LocalState, FlowRouter, notifier }, examId, userId) {
    Meteor.call('UserExams.checkUserExamOnExamsStartup', { userId, examId }, (err, res) => {
      if (err) {
        notifier.send(translate('bir_hata_olustu') +` : ${err}`, 'error');
      } else {
        const { hasUserExam, userExam } = res;
        const userExamInLocal = JSON.parse(localStorage.getItem('userAnswersInExam'));

        LocalState.set('HAS_USER_EXAM_ON_EXAMS_STARTUP', hasUserExam);
        LocalState.set('USER_EXAM_DOC', userExam);

        if (hasUserExam) {
          let answers = userExam.answers;
          let elapsedTime = userExam.elapsedTime;
          const userExamId = userExam._id;

          if (userExamInLocal && userExamInLocal.userExamId && userExamInLocal.userExamId === userExam._id) {
            answers = userExamInLocal.answers;
            elapsedTime = userExamInLocal.elapsedTime;
          };

          LocalState.set('USER_ANSWERS_IN_EXAM', { userExamId, answers, elapsedTime })
          localStorage.setItem('userAnswersInExam', JSON.stringify({ userExamId, answers, elapsedTime }));
        };

      };
    });
  },
  unsetUserExam({ LocalState }) {
    LocalState.set('HAS_USER_EXAM_ON_EXAMS_STARTUP', false);
    LocalState.set('USER_EXAM_DOC', null);
    LocalState.set('USER_ANSWERS_IN_EXAM', null);
  },
  setSelectedQuestionId({ LocalState }, questionId) {
    LocalState.set('SELECTED_QUESTION_ID_IN_EXAM', questionId);
  },
};
