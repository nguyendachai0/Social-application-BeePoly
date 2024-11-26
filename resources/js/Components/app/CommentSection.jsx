import UserAvatar from "../app/UserAvatar";
import {  FaHeart, FaReply, FaImage } from "react-icons/fa";
import { useRef, useState } from "react";
import { BsEmojiSmile, BsEmojiAngry, BsEmojiLaughing, BsEmojiHeartEyes, BsEmojiSunglasses, BsEmojiWink, BsEmojiKiss, BsStars, BsEmojiFrown } from "react-icons/bs";
import CommentForm from "./comments/CommentForm";
import CommentList from "./comments/CommentList";



const CommentSection = ({ postId, comments: initialComments}) => {
    const [comment, setComment] = useState("");
    const [chosenFiles, setChosenFiles] = useState([]);
    const [comments, setComments] = useState(initialComments || []);
    const [showReplies, setShowReplies] = useState({});
    const [commentImages, setCommentImages] = useState([]);
    const [attachment, setAttachment] = useState(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const commentImageRef = useRef(null);
    const replyImageRef = useRef(null);
    const [replyImage, setReplyImage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    const emojis = [
        { icon: <BsEmojiSmile className="text-yellow-500 hover:scale-110 transition-transform" />, emoji: "😊" },
        { icon: <BsEmojiAngry className="text-red-500 hover:scale-110 transition-transform" />, emoji: "😠" },
        { icon: <BsEmojiLaughing className="text-yellow-500 hover:scale-110 transition-transform" />, emoji: "😂" },
        { icon: <BsEmojiHeartEyes className="text-pink-500 hover:scale-110 transition-transform" />, emoji: "😍" },
        { icon: <BsEmojiSunglasses className="text-blue-500 hover:scale-110 transition-transform" />, emoji: "😎" },
        { icon: <BsEmojiWink className="text-yellow-500 hover:scale-110 transition-transform" />, emoji: "😉" },
        { icon: <BsEmojiKiss className="text-pink-500 hover:scale-110 transition-transform" />, emoji: "😘" },
        { icon: <BsEmojiFrown className="text-gray-500 hover:scale-110 transition-transform" />, emoji: "😢" }
      ];

      
      const onFileChange =  (ev) => {

        const files = ev.target.files;

        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            }
        });
        ev.target.value = null;
        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
        console.log('chosen fiel', chosenFiles);
    }

    

    const handleCommentLike = (commentId) => {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }));
    };

      const handleReplyImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setReplyImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

    const addReply = (items, parentId, newReply) => {
        return items.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              replies: [...(item.replies || []), newReply]
            };
          } else if (item.replies && item.replies.length > 0) {
            return {
              ...item,
              replies: addReply(item.replies, parentId, newReply)
            };
          }
          return item;
        });
      };
  
    const handleReply = (commentId) => {
      setReplyingTo(replyingTo === commentId ? null : commentId);
      setReplyText("");
    };
  
    const handleReplySubmit = async (e, commentId) => {
      e.preventDefault();
      if (replyText.length < 5) {
        alert("Reply must be at least 5 characters.");
        return;
      }
      setIsSubmitting(true);
  
      try {
        const response = await fetch(`/comments/${commentId}/replies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify({ reply: replyText }),
        });
  
        if (response.ok) {
          const newReply = await response.json();
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === replyingTo
                ? { ...comment, replies: [...comment.replies, newReply] }
                : comment
            )
          );
          setReplyText("");  
          setReplyingTo(null); 
        } else {
          console.error("Failed to submit reply");
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (comment.length < 5) {
          setError("Comment must be at least 5 characters");
          return;
        }

        setError("");
        setIsSubmitting(true);
      
        const formData = new FormData();
        formData.append("comment", comment);
        formData.append("post_id", postId); 

        chosenFiles.forEach((fileObj) => {
    formData.append("attachments[]", fileObj.file);
  });
      
        try {
          const response = await fetch(`/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': csrfToken,
            },
            body: formData,
          });
      
          if (response.ok) {
            const newComment = await response.json();
            setComments((prevComments) => [...prevComments, newComment]);
            setComment(""); 
            setCommentImages([]); 
            setAttachment(null); 
          } else {
            console.error("Failed to submit comment");
          }
        } catch (error) {
          console.error("Error submitting comment:", error);
        } finally {
          setIsSubmitting(false);
        }
      };
      
    
  const handleEmojiClick = (emoji) => {
    setComment(prev => prev + emoji);
    setShowEmojiPicker(false);
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

    const toggleReplies = (commentId) => {
        console.log('h')
        setShowReplies(prev => ({
          ...prev,
          [commentId]: !prev[commentId]
        }));
      };

    const renderReplies = (replies, depth = 0) => {
        if (!replies || replies.length === 0) return null;
    
        return (
          <div className={`mt-3 pl-4 space-y-3 border-l-2 border-gray-200 ${depth > 0 ? "ml-2" : ""}`}>
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-2">
                <UserAvatar user={reply.user}/>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h6 className="font-semibold text-sm text-gray-800">{reply.user.first_name} {reply.user.sur_name}</h6>
                    <span className="text-xs text-gray-500">{reply.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{reply.comment}</p>
                  {reply.attachments && (
                <div className="mt-2">
                  <img
                    src={reply.image.startsWith("data") ? reply.image : `https://${reply.image}`}
                    alt="Reply attachment"
                    className="max-w-[200px] rounded-lg"
                  />
                </div>
              )}
                  
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleCommentLike(reply.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <FaHeart className={reply.isLiked ? "text-red-500" : ""} />
                      <span>{reply.likes}</span>
                    </button>
                    <button
                      onClick={() => handleReply(reply.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <FaReply />
                      <span>Reply</span>
                    </button>
                  </div>
    
                  {replyingTo === reply.id && (
                    <div className="mt-2">
                      <div className="flex items-start gap-2">
                        <UserAvatar user={reply.user} size="small"/>
                        <div className="flex-1">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${reply.user.first_name} ${reply.user.sur_name}`}
                            className="w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-sm"
                            rows="2"
                          />
                          {replyImage && (
                        <div className="mt-2 relative inline-block">
                          <img
                            src={replyImage}
                            alt="Reply preview"
                            className="max-w-[200px] rounded-lg"
                          />
                          <button
                            onClick={() => setReplyImage(null)}
                            className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded-full opacity-75 hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      )}
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={(e) => handleReplySubmit(e,reply.id)}
                              className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => setReplyingTo(null)}
                              className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                          onClick={() => replyImageRef.current.click()}
                          className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                        >
                          <FaImage />
                          Add Image
                        </button>
                        <input
                          type="file"
                          ref={replyImageRef}
                          onChange={handleReplyImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
    
                  {renderReplies(reply.replies, depth + 1)}
                </div>
              </div>
            ))}
          </div>
        );
      };

    return (
      <div className="space-y-4">
        {/* Comment Form */}
        <CommentForm 
        comment={comment} 
        setComment={setComment} 
        error={error} 
        isSubmitting={isSubmitting} 
        handleCommentSubmit={handleCommentSubmit} 
        commentImageRef={commentImageRef}
        onFileChange={onFileChange}
        setIsSubmitting={setIsSubmitting}
        chosenFiles={chosenFiles}
        setChosenFiles={setChosenFiles}
        handleEmojiClick={handleEmojiClick}
      />
        {/* Comments List */}
        <CommentList
  comments={comments}
  toggleReplies={toggleReplies}
  handleReply={handleReply}
  handleReplyImageUpload={handleReplyImageUpload}
  renderReplies={renderReplies}
  handleReplySubmit={handleReplySubmit}
  handleCommentLike={handleCommentLike}
  showReplies={showReplies}
  replyText={replyText}
  setReplyText={setReplyText}
  replyingTo={replyingTo}
  setReplyingTo={setReplyingTo}
  commentImageRef={commentImageRef}
  replyImageRef={replyImageRef}
  replyImage={replyImage}
  setReplyImage={setReplyImage}
/>      </div>
    );
  };
export default CommentSection;