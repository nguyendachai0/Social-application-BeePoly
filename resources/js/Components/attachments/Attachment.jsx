import React from 'react';
import strategyFactory from './StrategyFactory';


const Attachment = ({ attachments, type=null, baseClass='' }) => {

  if (!attachments || attachments.length === 0) return null;

  const getClassNames = (baseClass) => {
    switch (type) {
      case 'comment':
        return `max-w-[200px] h-[150px] object-cover rounded-lg`; 
      case 'post':
        return `${baseClass} w-full h-full`; 
      default:
        return `${baseClass} w-full h-96`; 
    }
  };

  return attachments.map((attachment, index) => {
    const { mime: mime_type, path: url } = attachment;
    const Strategy = strategyFactory(mime_type);
    return <Strategy key={index} url={url} mime_type={mime_type} className={getClassNames(baseClass)} />;
  });
};

export default Attachment;
