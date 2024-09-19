import React, { useState } from "react";
import UserAvatar from "../app/UserAvatar";
import { VideoCameraIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { FaceSmileIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const Share = ({ user }) => {
    const [postContent, setPostContent] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);  // Track selected file
    const [previewURL, setPreviewURL] = useState(null);  // Store file preview URL

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const formData = new  FormData();
        formData.append('caption', postContent)
        if(selectedFiles) {     
            selectedFiles.forEach((file, index) => {
                formData.append(`attachments[]`, file); // Send as attachments[]
            });
    }
    
        try {
            const  response = await fetch('/posts', {
                method: 'POST',
                headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: formData,
            });
            if(response.ok){
                setPostContent("");
                setSelectedFiles([]); 
                setPreviewURL(null);
                setShowPopup(false);
                toast.success('🦄 Post Created successfully!');                        
                }else{
                console.error("Error in post submission:", response.statusText);
                toast.error('Error in post submission!');
    
            }

        }catch(error){
            console.error("Error in post submission:", error);
            toast.error('Something went wrong!');
        }        
    };

    const handleFileChange = (e) => {
            const files = Array.from(e.target.files);
           setSelectedFiles(files); 
           const previewURLs = files.map(file => URL.createObjectURL(file));
           setPreviewURL(previewURLs);

    };

    const handleInputClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const removeFilePreview = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedURLs = previewURL.filter((_, i) => i !== index);
    
        setSelectedFiles(updatedFiles);
        setPreviewURL(updatedURLs);
    };

    return (
        <div className="w-full relative">
            {/* Input field for "What's on your mind?" */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full">
                <div className="flex items-center space-x-4 mb-4">
                    <UserAvatar user={user} />
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="w-full bg-gray-100 rounded-full p-2 px-4 text-gray-700"
                        value={postContent}
                        onClick={handleInputClick}  // Show popup on input click
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                </div>
            </div>

            {/* Popup/Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh]  overflow-y-auto  relative">
                        {/* Close Icon */}
                        <button onClick={handleClosePopup} className="absolute top-3 right-3 text-gray-500 text-xl">
                            &times;
                        </button>

                        {/* Modal Header */}
                        <div className="flex items-center mb-4">
                            <UserAvatar user={user} />
                            <div className="ml-4">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">Public</p>
                            </div>
                        </div>

                        {/* Post Textarea */}
                        <textarea
                            className="w-full h-10 p-1 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What's on your mind?"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        />

                        {/* File Upload and Post Options */}
                        <div className="flex justify-between items-center p-2 border-t border-gray-200">
                            <label className="flex items-center cursor-pointer">
                            <PhotoIcon className="h-6 w-6 text-green-500" />

                                <span className="ml-2 text-sm font-medium text-gray-700">Photo/Video</span>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            <div className="flex items-center space-x-4">
                            <VideoCameraIcon className="h-6 w-6 text-red-500" />
                            <FaceSmileIcon className="h-6 w-6 text-yellow-500" />
                            </div>
                        </div>

                        {/* File Preview */}
{/* File Preview */}
{previewURL && (
    <div className="mt-4">
        {previewURL.map((url, index) => (
            <div key={index} className="mb-2">
                {selectedFiles[index].type.startsWith("image/") ? (
                    <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                ) : selectedFiles[index].type.startsWith("video/") ? (
                    <video
                        src={url}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                    />
                ) : null}

                {/* Remove File Button */}
                <button
                    onClick={() => removeFilePreview(index)}
                    className="mt-2 text-red-500 underline text-sm"
                >
                    Remove {selectedFiles[index].type.startsWith("image/") ? "Image" : "Video"}
                </button>
            </div>
        ))}
    </div>
)}


                        {/* Post Button */}
                        <button
                            onClick={handlePostSubmit}
                            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Share;
