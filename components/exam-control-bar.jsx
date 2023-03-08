import React from 'react';
import Confirm from './react-confirm-modal.jsx';

const ExamControlBar = ({ showFinishButton, onClickFinish, translate,userId }) => (
  <div className="examControlBar">
    {
      showFinishButton ? (
        <Confirm
           title={translate('exam.confirm.title')}
           body={translate('exam.confirm.body')}
           confirmText={translate('exam.confirm.confirmText')}
           cancelText={translate('exam.confirm.cancelText')}
           onConfirm={onClickFinish}
           cancelBSStyle="success"
           buttonText={translate('exam.confirm.buttonText')}
           buttonBSStyle="danger"
           buttonBSSize="sm"
        />
      ) : <div>  
        <a href={`/users/profile/${userId}/enteredTheExams`} className="btn btn-primary btn-sm pull-right">{translate('exam.sinav_listesi')}</a> </div>
    }
  </div>
);

ExamControlBar.propTypes = {
  showFinishButton: React.PropTypes.bool,
  onClickFinish: React.PropTypes.func,
};

export default ExamControlBar;
