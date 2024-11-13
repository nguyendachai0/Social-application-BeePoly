const AudioStrategy = ({ url, mime_type }) => (
    <audio className="postAudio" controls>
      <source src={url} type={mime_type} />
      Your browser does not support the audio element.
    </audio>
  );
export default AudioStrategy;