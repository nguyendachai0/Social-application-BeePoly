import { format, parseISO } from 'date-fns'; 
import UserAvatar from "../app/UserAvatar";
import {  FaHeart, FaComment, FaShare, FaEllipsisH} from "react-icons/fa";
import { useDarkMode } from "@/Context/DarkModeContext";
import Attachment from "../attachments/Attachment";
import { useState } from "react";
import { usePage } from '@inertiajs/react';
import CommentSection from '../app/CommentSection';
// import CommentSection from '../app/comments/CommentSection';

export default function Post({ post }) {
  const user = usePage().props.auth.user;

  const [likes, setLikes] = useState(post.reactions?.length || 0); 
  const [isLiked, setIsLiked] = useState(
    post.reactions?.some(reaction => reaction.user_id === user.id) || false
  ); 
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  const {darkMode} = useDarkMode();

  const formattedDate = format(parseISO(post.created_at), 'MMMM dd, yyyy');

  const [commentSections, setCommentSections] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);


  const handleLikeClick = async () => {
    const postID  = post.id;
    setIsLiked(!isLiked);
    try {
      const response = await fetch(`/reaction`, {
        method: isLiked ? "DELETE" : "POST", 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ postID }),
      });
  
      if (response.ok) {
        const updatedPost = await response.json();
        setLikes(updatedPost.likeCount); 
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  

  const toggleCommentSection = async (postId) => {
    if(!commentSections[postId]) {
      const response = await fetch(`/posts/${postId}/comments`);
      const commentsData = await response.json();
    setCommentSections((prevState) => ({
      ...prevState,
      [postId]: commentsData,
    }));
  } else {
    setCommentSections((prevState) => ({
      ...prevState,
      [postId]: null,
    }));
  };
  }
  const toggleEmojiPicker = (postId) => {
    setShowEmojiPicker(!showEmojiPicker);
    setCurrentPostId(postId);
  };
  
  return (
   
            <div key={post.id} className={`mb-8 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md transform transition`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                   <UserAvatar user={post.user}/>
                    <span className="font-semibold">{post.user.first_name} {post.user.sur_name}</span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700"><FaEllipsisH /></button>
                </div>
                <p className="mb-4">{post.caption}</p>
                <Attachment attachments={post.attachments} />
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">

                    <button 
                    onClick={handleLikeClick} 
                    className={`flex items-center space-x-1 transition duration-300 ${
                      isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'
                    }`}>
                      <FaHeart />
                       <span>{likes}</span>
                    </button>

                    <button 
                    onClick={() => toggleCommentSection(post.id)} 
                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors duration-300">
                      <FaComment className="text-xl" />
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-500 transition duration-300">
                      <FaShare />
                    </button>

                  </div>
                  <button className="text-blue-500 hover:text-blue-600 transition duration-300">
                    Save
                  </button>

                </div>

                {commentSections[post.id] && (
                  <CommentSection postId={post.id} comments={commentSections[post.id]} />
                )}
              </div>
            </div>
  );
}
