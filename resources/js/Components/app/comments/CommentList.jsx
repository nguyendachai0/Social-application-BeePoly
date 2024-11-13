import {  FaHeart, FaReply, FaFlag, FaImage, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useRef } from "react";
import UserAvatar from "../UserAvatar";
import { usePage } from "@inertiajs/react";
import Attachment from "@/Components/attachments/Attachment";

const CommentList = ({ comments, toggleReplies, handleReply, handleReplyImageUpload, renderReplies, handleReplySubmit, showReplies, replyingTo, setReplyingTo, replyText, setReplyText, replyImageRef, replyImage, setReplyImage }) => {
    const user = usePage().props.auth.user;

  return (
    <div className="space-y-4">
    {comments.map((comment) => (
      <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
        <UserAvatar user={comment.user} size="small"/>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-gray-800">{comment.user.first_name} {comment.user.sur_name}</h5>
            <span className="text-sm text-gray-500">{comment.timestamp}</span>
          </div>
          <p className="text-gray-700 mt-1">{comment.comment}</p>
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
           <Attachment attachments={comment.attachments} type="comment"/>
           </div>
        )}

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => handleCommentLike(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Like comment"
            >
              <FaHeart className={comment.isLiked ? "text-red-500" : ""} />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => handleReply(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
              aria-label="Reply to comment"
            >
              <FaReply />
              <span>Reply</span>
            </button>
            <button
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-500 transition-colors"
              aria-label="Report comment"
            >
              <FaFlag />
              <span>Report</span>
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
              >
                {showReplies[comment.id] ? <FaChevronUp /> : <FaChevronDown />}
                <span>{showReplies[comment.id] ? "Hide Replies" : `Show ${comment.reply_count} ${comment.reply_count === 1 ? "Reply" : "Replies"}`}</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <div className="flex items-start gap-2">
                <UserAvatar user={user}/>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.user.first_name} ${comment.user.sur_name}`}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-sm"
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
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => handleReplySubmit(e, comment.id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => replyImageRef.current.click()}
                      className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
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

          {/* Replies */}
          {showReplies[comment.id] && renderReplies(comment.replies)}
        </div>
      </div>
    ))}
  </div>
  );
};

export default CommentList;
