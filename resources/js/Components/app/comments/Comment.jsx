import { FaHeart, FaReply, FaFlag } from "react-icons/fa";
import ReplyForm from "./ReplyForm";
import useReport from "@/utils/hooks/useReport";

const Comment = ({ comment, toggleReplies, showReplies }) => {

  const {handleReport} =  useReport();
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h5 className="font-semibold text-gray-800">{comment.user.first_name} {comment.user.sur_name}</h5>
          <span className="text-sm text-gray-500">{comment.timestamp}</span>
        </div>
        <p className="text-gray-700 mt-1">{comment.comment}</p>
        {comment.image && <img src={comment.image} className="mt-2 max-w-[200px] rounded-lg" />}
        <div className="flex items-center gap-4 mt-2">
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <FaHeart />
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => toggleReplies(comment.id)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaReply />
            <span>Reply</span>
          </button>
          <button
           onClick={() => handleReport(comment.id, "comment")}
           className="flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-500 transition-colors">
            <FaFlag />
            <span>Report</span>
          </button>
        </div>

        {showReplies[comment.id] && (
          <div className="mt-3 pl-4 space-y-3 border-l-2 border-gray-200">
            {/* Render replies here */}
          </div>
        )}
        <ReplyForm commentId={comment.id} />
      </div>
    </div>
  );
};

export default Comment;
