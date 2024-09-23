import React, { useState } from "react";
import {  FaPlus, FaImage, FaVideo, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";

import 'react-toastify/dist/ReactToastify.css';
import Post from "@/Components/post/Post";
const Content = ({user, posts}) => {
    const [newStory, setNewStory] = useState("");
    const [previewStory, setPreviewStory] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
    const handleStoryChange = (e) => {
        setNewStory(e.target.value);
        setPreviewStory(e.target.value);
      };
    
      const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setMediaPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };
    
      const handlePostStory = () => {
        // Logic to post the story
        console.log("Posting story:", newStory);
        setNewStory("");
        setPreviewStory("");
        setMediaPreview(null);
      };
    return (
        
        <>
           
            
             {/* Displaying Posts */}
             <main className="w-full md:w-3/5 md:ml-64">
             <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Stories</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex-shrink-0 w-28 h-48 relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600 opacity-90"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2">
                <FaPlus className="text-blue-500 text-lg" />
              </div>
              <span className="text-white text-sm font-medium">Create Story</span>
            </div>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-28 h-48 relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
              <img
                src={`https://images.unsplash.com/photo-${1518000000000 + i}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=112&h=192&q=80`}
                alt={`User ${i} Story`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-90"></div>
              <div className="absolute inset-x-0 bottom-0 p-2">
                <div className="w-8 h-8 mb-1 border-2 border-blue-500 rounded-full overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1518000000000 + i + 5}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=32&h=32&q=80`}
                    alt={`User ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white text-xs font-medium">User {i}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
             <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Create New Story</h3>
        <textarea
          className="w-full p-2 border rounded-lg mb-4"
          rows="3"
          placeholder="What's on your mind?"
          value={newStory}
          onChange={handleStoryChange}
        ></textarea>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <label className="cursor-pointer text-gray-600 hover:text-blue-500">
              <FaImage className="text-xl" />
              <input type="file" className="hidden" accept="image/*" onChange={handleMediaUpload} />
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
          <span className="text-sm text-gray-500">{newStory.length}/280</span>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Preview</h4>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>{previewStory}</p>
            {mediaPreview && (
              <img src={mediaPreview} alt="Preview" className="mt-2 max-w-full h-auto rounded-lg" />
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Discard
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Save Draft
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handlePostStory}
          >
            Post Story
          </button>
        </div>
      </div>
             {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post.id} post={post}/>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
               </main>

        </>
    );
};

export default Content;
