import React from 'react';
import ExamsListItem from './exams-list-item';
import ExamsListFilters from './exams-list-filters';

export default class ExamsList extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeLimit = props.onChangeLimit.bind(this);
    this.handleClickSearch = props.onClickSearch.bind(this);
  }

  renderTableRows() {
    const { exams, userId, translate } = this.props;

    return exams.length ?
           exams.map((exam) => (
             <ExamsListItem key={exam._id} exam={exam} userId={userId} translate={translate} />
           )) :
           <tr><td colSpan="5">{translate('exam.list.sinav_bulunamadi')}</td></tr>;
  }

  render() {
    const { translate } = this.props;
    return (
      <section className="panel">
        <header className="panel-heading">
          {translate('exam.list.sinavlar')}
        </header>
        <div className="panel-body">
          <ExamsListFilters onChangeLimit={this.handleChangeLimit} onClickSearch={this.handleClickSearch} translate={translate} />
          <div className="table-responsive">
            <table className="table table-hover p-table">
              <thead>
                <tr>
                  <th className="hidden-xs">{translate('exam.list.sinif')}</th>
                  <th>{translate('exam.list.sinav_adi')}</th>
		          <th>{translate('exam.list.sinav_turu')}</th>
                  <th className="hidden-xs">{translate('exam.list.soru_sayisi')}</th>
		          <th className="hidden-xs">{translate('exam.list.sinav_suresi_dk')}</th>
		          <th className="hidden-xs">{translate('exam.list.sinav_baslangic_tarihi')}</th>
                  <th className="hidden-xs">{translate('exam.list.sinav_bitis_tarihi')}</th>
                  <th className="hidden-xs">{translate('exam.list.sinav_durumu')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.renderTableRows()}
              </tbody>
            </table>
          </div>

        </div>
      </section>
    );
  }
};

ExamsList.propTypes = {
  exams: React.PropTypes.array,
  userId: React.PropTypes.string,
  onChangeLimit: React.PropTypes.func,
  onClickSearch: React.PropTypes.func,
};

ExamsList.defaultProps = {
  exams: [],
};
