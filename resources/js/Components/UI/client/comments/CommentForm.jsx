import { FaImage, FaSpinner, FaPaperclip  } from "react-icons/fa";
import EmojiPicker from "./EmojiPicker";
import { RiEmotionHappyLine } from "react-icons/ri";
import UserAvatar from "../UserAvatar";
import { usePage } from "@inertiajs/react";
import {  useState } from "react";


const CommentForm = ({ comment, setComment, error, isSubmitting, handleCommentSubmit, onFileChange, commentImageRef, chosenFiles, setChosenFiles, handleEmojiClick }) => {
    const user = usePage().props.auth.user;
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <form onSubmit={handleCommentSubmit} className="mb-6">
    <div className="flex items-start gap-2">
      <UserAvatar className="flex-start" user={user} />
      <div className="flex-1">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          rows="2"
          aria-label="Comment input"
        />

{chosenFiles.map((image, index) => (
  <div key={index} className="mt-2 relative inline-block">
    <img
      src={image.url}
      alt={`Comment preview ${index}`}
      className="max-w-[200px] rounded-lg"
    />
    <button
      onClick={() => {
        setChosenFiles(chosenFiles.filter((_, i) => i !== index));
      }}
      className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded-full opacity-75 hover:opacity-100"
    >
      ×
    </button>
  </div>
))}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="mt-2 flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </button>
        <button
            type="button"
            onClick={() => commentImageRef.current.click()}
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaImage className="text-xl" />
          </button>
          <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-yellow-500 transition-all rounded-full hover:bg-yellow-50"
            >
              <RiEmotionHappyLine className="text-xl transform hover:scale-110" />
            </button>
            {showEmojiPicker && <EmojiPicker 
            setComment={setComment}
            handleEmojiClick={handleEmojiClick}
            />}



          <input
            type="file"
            ref={commentImageRef}
            onChange={onFileChange}
            multiple
            accept="image/*"
            className="hidden"     
          />

          </div>
      </div>
    </div>
  </form>

  );
};

export default CommentForm;
