import React, {useState}  from "react";
import axios from "axios";
import { toast } from 'react-toastify';

import {FaImage, FaVideo, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";

const CreatePost = () => {
    const [errors, setErrors] = useState({});
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const   [newPost,  setNewPost] = useState({
        caption: "",
        attachments: [],
      });
      const formatErrors = (errors) => {
        return Object.values(errors)
            .flat()
            .join(', '); 
    };
    
      const handlePostChange = (e) => {
        setNewPost({
          ...newPost,
          caption: e.target.value,
        })
      }
      const handleMediaUpload = (e) => {
        const files = Array.from(e.target.files); // Get multiple files
         if(files.length > 0){
            const mediaURLs = files.map(file => URL.createObjectURL(file));
            setMediaPreviews([...mediaPreviews, ...mediaURLs]); // Add to existing previews
            setNewPost({
                ...newPost,
                attachments: [...newPost.attachments, ...files], // Append multiple files
              });
         }
      };
      const discardPost = () => {
        setNewPost({ caption: "", attachments: [] });
        setMediaPreviews([]);
      }
      const handleCreatePost = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("caption",newPost.caption);
        newPost.attachments.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file); // Send as array of attachments
        });

        try {
            const response = await axios.post("/posts", formData,{
                headers:{
                    "Content-Type": "multipart/form-data",
             }
            });
            discardPost();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const formattedErrors = formatErrors(error.response.data.errors); 
                setErrors(error.response.data.errors); 
                toast.error(formattedErrors); 
        
                        } else {
                            console.error("Error creating post:", error);
                            toast.error("An error occurred while creating the post.");           
                         }          }        
      };
      const handleCaptionChange = (e) => {
        setNewPost({
            ...newPost,
            caption: e.target.value,
        })
      };
    return (
        <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Create New Post</h3>
        <textarea
          className="w-full p-2 border rounded-lg mb-4"
          rows="3"
          placeholder="What's on your mind?"
          value={newPost.caption}
          onChange={handleCaptionChange}
        ></textarea>
                {errors.caption && <span className="text-red-500 text-sm">{errors.caption.join(', ')}</span>}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <label className="cursor-pointer text-gray-600 hover:text-blue-500">
              <FaImage className="text-xl" />
              <input  multiple type="file" className="hidden" accept="image/*" onChange={handleMediaUpload} />
            </label>
            <label className="cursor-pointer text-gray-600 hover:text-blue-500">
              <FaVideo className="text-xl" />
              <input type="file" className="hidden" accept="video/*" onChange={handleMediaUpload} />
            </label>
            <button className="text-gray-600 hover:text-blue-500">
              <FaMapMarkerAlt className="text-xl" />
            </button>
            <button className="text-gray-600 hover:text-blue-500">
              <FaUserTag className="text-xl" />
            </button>
          </div>
          <span className="text-sm text-gray-500">{newPost.caption.length}/280</span>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Preview</h4>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>{newPost.caption}</p>
            {mediaPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {mediaPreviews.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt="Preview"
                                    className="mt-2 max-w-full h-auto rounded-lg"
                                />
                            ))}
                        </div>
                    )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={discardPost}>
            Discard
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Save Draft
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCreatePost}
          >
            Post Story
          </button>
        </div>
      </div>
    );
}
export default CreatePost;