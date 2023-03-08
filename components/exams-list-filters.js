import React from 'react';

export default class ExamsListFilters extends React.Component {
  handleClickSearch(e) {
    e.preventDefault();

    const searchQuery = this.refs.searchQuery.value.trim();
    this.props.onClickSearch(searchQuery);
  }

  render() {
    const { translate } = this.props;

    return (
      <div className="row">
        <div className="col-md-2">
          <select
            className="form-control input-sm m-bot15"
            onChange={(e) => this.props.onChangeLimit(e.target.value)}
            defaultValue={10} size="1"
          >
            <option key={0} value="10">10</option>
            <option key={1} value="25">25</option>
            <option key={2} value="50">50</option>
            <option key={3} value="100">100</option>
          </select>
        </div>

        <div className="col-md-6 col-md-offset-4">
          <div className="input-group">
            <input type="text" ref="searchQuery" placeholder={translate('exam.list.sinav_adi')} className="input-sm form-control" />
            <span className="input-group-btn">
              <button type="button" className="btn btn-sm btn-success" onClick={(e) => this.handleClickSearch(e)}>
                {translate('exam.list.ara')}
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
};

ExamsListFilters.propTypes = {
  onChangeLimit: React.PropTypes.func,
  onClickSearch: React.PropTypes.func,
};
