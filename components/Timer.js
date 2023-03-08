import React from 'react';
import moment from 'moment';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      remainingTime: this.calcRemainingTime(props.suggestedTime, props.elapsedTime)
    };
    this.tick = this.tick.bind(this);
  }

  calcRemainingTime(suggestedTime, elapsedTime) {
    const seconds = Math.round(suggestedTime - elapsedTime);
    return seconds < 0 ? 0 : seconds;
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    if (this.state.remainingTime !== 0) {
      this.interval = setInterval(this.tick, 1000);
    }
  }

  stopTimer() {
    this.setState({ started: false });
    clearInterval(this.interval);
  }

  tick() {
    const { remainingTime } = this.state;
    const { onFinishTimer } = this.props;

    if (remainingTime > 0) {
      this.setState((prevState) => {
        return { remainingTime: prevState.remainingTime - 1 }
      });
    } else if (remainingTime === 0) {
      onFinishTimer();
      this.stopTimer();
    } else {
      this.stopTimer();
    }
  }

  formatTime(time) {
    return moment.utc(time * 1000).format('HH:mm:ss');
  }

  render() {
    return (
      <span className="time">{this.formatTime(this.state.remainingTime)}</span>
    );
  }
};

export default Timer;
