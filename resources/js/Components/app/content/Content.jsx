import React, { useState } from "react";
import {  FaPlus, FaImage, FaVideo, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";

import 'react-toastify/dist/ReactToastify.css';
import Post from "@/Components/post/Post";
import CreatePost from "@/Components/createPost/CreatePost";
const Content = ({user, posts}) => {
    const [newStory, setNewStory] = useState("");

    
  const [mediaPreview, setMediaPreview] = useState(null);
  const   [newPost,  setNewPost] = useState({
    content: "",
    media: null,
  });


   
    
     
    
     

      const handlePostSubmit = ()  => {
        if(newPost.content.trim() || newPost.media){
          const updatedPosts = [
            ...posts,
            {

            }
          ]
        }
      }
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
           <CreatePost/>
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
