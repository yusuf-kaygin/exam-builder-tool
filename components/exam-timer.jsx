import React from 'react';
import moment from 'moment';

export default class ExamTimer extends React.Component {
  constructor(props) {
    super(props);

    const remainingTime = this.calcRemainingTime(props.suggestedTime, props.elapsedTime);

    this.state = {
      started: false,
      remainingTime,
    };

    this.tick = this.tick.bind(this);
  }

  calcRemainingTime(suggestedTime, elapsedTime) {
    const seconds = suggestedTime * 60 - elapsedTime / 1000;
    return Math.round(seconds) < 0 ? 0 : Math.round(seconds);
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.interval = setInterval(this.tick, 1000);
  }

  stopTimer() {
    this.setState({ started: false });
    clearInterval(this.interval);
  }

  tick() {
    const { remainingTime } = this.state;
    const { onGoing, onFinish, tickCallback } = this.props;

    if (onGoing) {
      if ((remainingTime - 1) > 0 && (remainingTime - 1) % 900 === 0) {
        tickCallback(900000);
      }

      if (remainingTime > 0) {
        this.setState({
          started: true,
          remainingTime: remainingTime - 1,
        });
      } else {
        onFinish();
        this.stopTimer();
      }

    }
  }

  formatTime(time) {
    return moment.utc(time * 1000).format('HH:mm:ss');
  }

  render() {
    const { suggestedTime, translate } = this.props;
    const { remainingTime } = this.state;

    return (
      <div className="user-head">
        <div className="user-name">
          <h3>{translate('kalan_sure')}: <span className="time">{this.formatTime(remainingTime)}</span> </h3>
          <span>{translate('exam.sinav_icin_onerilen_sure')}: {suggestedTime} dk.</span>
        </div>
      </div>
    );
  }
}

ExamTimer.propTypes = {
  suggestedTime: React.PropTypes.number,
  elapsedTime: React.PropTypes.number,
  onGoing: React.PropTypes.bool,
  onFinish: React.PropTypes.func,
  tickCallback: React.PropTypes.func,
};
