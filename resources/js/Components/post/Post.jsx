import { format, parseISO } from 'date-fns'; 
import UserAvatar from "../app/UserAvatar";
import {  FaHeart, FaComment, FaShare, FaEllipsisH, FaPaperclip, FaSmile } from "react-icons/fa";
import { useDarkMode } from "@/Context/DarkModeContext";
import Attachment from "../attachments/Attachment";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function Post({ post }) {
  const {darkMode} = useDarkMode();
  const formattedDate = format(parseISO(post.created_at), 'MMMM dd, yyyy');
  const [commentSections, setCommentSections] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);


  const toggleCommentSection = (postId) => {
    setCommentSections(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const toggleEmojiPicker = (postId) => {
    setShowEmojiPicker(!showEmojiPicker);
    setCurrentPostId(postId);
  };

  const CommentSection = ({ postId }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [attachment, setAttachment] = useState(null);

    const handleCommentSubmit = (e) => {
      e.preventDefault();
      if (comment.trim() || attachment) {
        setComments([...comments, { id: Date.now(), text: comment, user: "Current User", attachment }]);
        setComment("");
        setAttachment(null);
      }
    };

    const handleEmojiClick = (emojiObject) => {
      setComment(prevComment => prevComment + emojiObject.emoji);
    };

    const handleAttachment = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachment(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className={`mt-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-lg`}>
        <h3 className="font-semibold mb-2">Comments</h3>
        {comments.map((c) => (
          <div key={c.id} className={`mb-2 ${darkMode ? "bg-gray-600" : "bg-white"} p-2 rounded`}>
            <span className="font-semibold">{c.user}: </span>
            <span>{c.text}</span>
            {c.attachment && <img src={c.attachment} alt="Attachment" className="mt-2 max-w-full h-auto" />}
          </div>
        ))}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="flex mb-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className={`flex-grow px-3 py-2 rounded-l-lg ${darkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"}`}
            />
            <button
              type="button"
              onClick={() => toggleEmojiPicker(postId)}
              className="bg-gray-300 text-gray-700 px-3 py-2 hover:bg-gray-400 transition duration-300"
            >
              <FaSmile />
            </button>
            <label className="bg-gray-300 text-gray-700 px-3 py-2 hover:bg-gray-400 transition duration-300 cursor-pointer">
              <FaPaperclip />
              <input type="file" className="hidden" onChange={handleAttachment} accept="image/*" />
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-300"
            >
              <IoMdSend />
            </button>
          </div>
          {attachment && (
            <div className="mt-2">
              <img src={attachment} alt="Attachment Preview" className="max-w-full h-auto" />
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remove Attachment
              </button>
            </div>
          )}
          {showEmojiPicker && currentPostId === postId && (
            <div className="z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </form>
      </div>
    );
  };
  return (
   
            <div key={post.id} className={`mb-8 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md transform transition duration-300 hover:scale-105`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                   <UserAvatar user={post.user}/>
                    <span className="font-semibold">{post.user.first_name} {post.user.last_name}</span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700"><FaEllipsisH /></button>
                </div>
                <p className="mb-4">{post.caption}</p>
                <Attachment attachments={post.attachments} />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition duration-300"><FaHeart /> <span>{post.likes}</span></button>
                    <button onClick={() => toggleCommentSection(post.id)} className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors duration-300"><FaComment className="text-xl" /> <span>{post.comments}</span></button>
                    <button className="flex items-center space-x-1 hover:text-green-500 transition duration-300"><FaShare /></button>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 transition duration-300">Save</button>
                </div>
                {commentSections[post.id] && <CommentSection postId={post.id} />}
              </div>
            </div>
  );
}
