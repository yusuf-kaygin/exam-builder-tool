import React from 'react';
import { translate } from '/lib/i18n/i18n.js';
import { formatDate, truncate } from '/lib/helpers';
import { isMobile } from '../../../lib/detect-mobile';

const ExamsListItem = ({ exam, userId, translate }) => {
  let examType = '';
  switch(exam.type) {
    case 'summative':
      examType = 'Sınavlar';
      break;
    case 'quiz':
      examType = 'Konu Testi';
      break;
    case 'reward':
      examType = 'Ödüllü Sınavı';
      break;
    case 'formative':
      examType = 'Tarama Sınavı';
      break;
    case 'test':
      examType = 'Kişilik Testi';
      break;
  };
  
  return (
    <tr>
      <td className="hidden-xs">{exam.classroomName}</td>
      <td>{isMobile()? truncate({ title: exam.name, len: 33 }) : exam.name}</td>
      <td className="hidden-xs">{examType}</td>
      <td className="hidden-xs">{exam.questionCount}</td>
      <td className="hidden-xs">{exam.suggestedTime}</td>
      <td className="hidden-xs">{formatDate(exam.startDate)}</td>
      <td className="hidden-xs">{formatDate(exam.endDate)}</td>
      <td className="hidden-xs">{translate(exam.status)}</td>
      <td>
	<a href={`/exam/${exam._id}/user/${userId}/run`} className="btn btn-primary btn-xs">
          <i className="fa fa-arrow-right"></i> {translate('exam.list.git')}
	</a>
      </td>
    </tr>
  )
};

ExamsListItem.propTypes = {
  exam: React.PropTypes.object,
  userId: React.PropTypes.string,
};

export default ExamsListItem;
