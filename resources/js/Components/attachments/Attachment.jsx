import React from 'react';

const Attachment = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;

  return attachments.map((attachment, index) => {
    const { mime: mime_type, path: url } = attachment;
    
    if (mime_type.startsWith('image/')) {
      return <img key={index} className="postImg" src={url} alt="Attachment" />;
    }
    
    if (mime_type.startsWith('video/')) {
      return <video key={index} className="postVideo" controls>
        <source src={url} type={mime_type} />
        Your browser does not support the video tag.
      </video>;
    }

    if (mime_type.startsWith('audio/')) {
      return <audio key={index} className="postAudio" controls>
        <source src={url} type={mime_type} />
        Your browser does not support the audio element.
      </audio>;
    }

    return <a key={index} href={url} className="postAttachment" download>Download Attachment</a>;
  });
};

export default Attachment;
