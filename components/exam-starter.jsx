import React from 'react';

const ExamStarter = ({ onClickStart, translate, description }) => (
  <div className="exam-starter">
    <div className="panel">
      <div className="panel-heading text-center">
        <h4>{translate('exam.starter.baslik')}</h4>
      </div>

      {description ?
        <div className="panel-body">
          <strong dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        :
        <div className="panel-body">
          <ol>
            <li>{translate('exam.starter.aciklama_1')}</li>
            <li>{translate('exam.starter.aciklama_2')}</li>
            <li>{translate('exam.starter.aciklama_3')}</li>
            <li>{translate('exam.starter.aciklama_4')}</li>
            <li>{translate('exam.starter.aciklama_5')}</li>
          </ol>
        </div>
      }

      <div className="panel-footer text-center">
        <button className="btn btn-success btn-lg" onClick={() => onClickStart()}>
          <i className="fa fa-play"></i> {translate('exam.starter.sinava_basla')}
        </button>
      </div>
    </div>
  </div>
);

ExamStarter.propTypes = {
  onClickStart: React.PropTypes.func,
};

export default ExamStarter;
