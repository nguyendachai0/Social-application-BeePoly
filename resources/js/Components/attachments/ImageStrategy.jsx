const ImageStrategy = ({ url, className }) => (
  <img className={`${className} object-cover rounded-lg mb-4`} src={url} alt="Attachment" />
);

export default ImageStrategy;
