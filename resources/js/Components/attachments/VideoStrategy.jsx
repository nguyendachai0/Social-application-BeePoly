const VideoStrategy = ({ url, mime_type }) => (
  <video className="postVideo" controls>
    <source src={url} type={mime_type} />
    Your browser does not support the video tag.
  </video>
);

export default VideoStrategy;
