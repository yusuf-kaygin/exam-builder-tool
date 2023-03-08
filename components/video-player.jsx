import React from 'react';
import { getCdnUrl } from '../../../../lib/cdn-url';

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.playerStyle = {
      width: props.width || '100%',
    };
  }

  componentDidMount() {
    this.setupPlayer(this.props.url);
  }

  componentWillReceiveProps(prevProps, nextProps) {
    const { url } = prevProps;
    this.setupPlayer(url);
  }

  componentWillUnmount() {
    this.removePlayer();
  }

  setupPlayer(url) {
    this.videoPlayer = jwplayer('video-player');
    var videoUrl =  getCdnUrl(url)
     
    this.videoPlayer.setup({
      autostart: false,
      file: videoUrl ,
    });
  }

  removePlayer() {
    this.videoPlayer.remove();
  }

  renderHeader() {
    const { title } = this.props;
    return title ? (
      <div className="panel-heading">
        {title}
      </div>
    ) : <noscript />;
  }

  render() {
    return (
      <div className="panel" style={this.playerStyle}>
        {this.renderHeader()}
        <div className="panel-body">
          <div id="video-player"></div>
        </div>
      </div>
    );
  }
};

VideoPlayer.propTypes = {
  url: React.PropTypes.string.isRequired,
  width: React.PropTypes.string,
  title: React.PropTypes.string,
};
