import ImageStrategy from './ImageStrategy';
import VideoStrategy from './VideoStrategy';
import AudioStrategy from './AudioStrategy';
import DownloadStrategy from './DownloadStrategy';

const strategyFactory = (mimeType) => {
  if (mimeType.startsWith('image/')) return ImageStrategy;
  if (mimeType.startsWith('video/')) return VideoStrategy;
  if (mimeType.startsWith('audio/')) return AudioStrategy;
  return DownloadStrategy; // Default strategy for non-media attachments
};

export default strategyFactory;
