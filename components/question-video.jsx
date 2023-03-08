import React from 'react';
import VideoPlayer from './video-player';
import { getCdnUrl } from '../../../../lib/cdn-url';

const QuestionVideo = ({ video, examOnGoing }) => {
  const hasVideo = video && video.url;
  return hasVideo && !examOnGoing ? (
    <VideoPlayer url={getCdnUrl(video.url)} title="Çözüm" width="80%" />
  ) : <noscript />;
}

export default QuestionVideo;
