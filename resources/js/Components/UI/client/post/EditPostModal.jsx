import Attachment from "../attachments/Attachment";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const EditPostModal = ({
    setShowEditModal, 
    handleFileChange, 
    handleUpdatePost, 
    editPost,  
    editCaption,
    removeImage, 
    setEditCaption,
    editImages,
}) => 
{    

    return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md  max-h-[90vh] w-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Edit Post</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <textarea
          value={editCaption}
          onChange={(e) => setEditCaption(e.target.value)}
          className="w-full p-2 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Image
          </label>
          <input
            type="file"
            accept="image/*,video/*" 
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* {editImages && editImages.length > 0 && (
         <Attachment attachments={editImages} />
        )} */}
        <div className="mt-4 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
        {editImages.map((media, index) => (
            <div key={index} className="relative">
              {media.mime.startsWith("image/") ? (
              <img
                src={media.path}
                alt={`Preview ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <video
                src={media.path}
                className="w-full h-48 object-cover rounded-lg"
                controls
              />
            )}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <FaTimes />
              </button>
            </div>
          ))}
          </div>
        <button
          onClick={handleUpdatePost}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
        >
          Update Post
        </button>
      </div>
    </div>
  );
}
  export default EditPostModal;