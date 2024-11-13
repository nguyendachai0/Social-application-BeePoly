import { FaImage } from "react-icons/fa";
const ImageUpload = () => {
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Handle image upload logic here
        console.log(file);
      }
    };
  
    return (
      <label className="cursor-pointer text-blue-500 hover:text-blue-600">
        <input type="file" onChange={handleImageChange} className="hidden" />
        <FaImage />
      </label>
    );
  };
  
  export default ImageUpload;
  