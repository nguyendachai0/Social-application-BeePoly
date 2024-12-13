import { format, parseISO } from 'date-fns'; 
import UserAvatar from "../app/UserAvatar";
import {  FaHeart, FaComment, FaShare, FaFlag} from "react-icons/fa";
import { useDarkMode } from "@/Context/DarkModeContext";
import Attachment from "../attachments/Attachment";
import { usePage } from '@inertiajs/react';
import CommentSection from '../app/CommentSection';
import ReportModal from '../app/ReportModal';
import useLikes from "@/utils/hooks/useLikes";
import useReport from '@/utils/hooks/useReport';
import useComments from "@/utils/hooks/useComments";

export default function Post({ post }) {

  const {darkMode} = useDarkMode();

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
 
  const { likes, isLiked, toggleLike } = useLikes(
    post.reactions?.length || 0,
    post.reactions?.some(reaction => reaction.user_id === usePage().props.auth.user.id) || false,
    post.id,
    csrfToken
  );

  const { commentSections, toggleCommentSection } = useComments();


  const formattedDate = format(parseISO(post.created_at), 'MMMM dd, yyyy');

  const {
    reportTarget,
    reportType,
    setReportType,
    reportDetails,
    setReportDetails,
    showReportModal,
    setShowReportModal,
    submitReport,
    handleReport,
  } = useReport();

  return (
   
            <div key={post.id} className={`mb-8 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md transform transition`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                   <UserAvatar user={post.user}/>
                    <span className="font-semibold">{post.user.first_name} {post.user.sur_name}</span>
                  </div>
                  <button 
                    onClick={() => handleReport(post.id, "post")}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                    aria-label="Report post"
                  >
                    <FaFlag />
                  </button>
                </div>
                <p className="mb-4">{post.caption}</p>
                
                <Attachment attachments={post.attachments} />
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">

                    <button 
                    onClick={toggleLike} 
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
                  <CommentSection handleReport={handleReport} postId={post.id} comments={commentSections[post.id]} />
                )}
              </div>
              {showReportModal && <ReportModal 
              reportTarget={reportTarget}
              reportType={reportType}
              setReportType={setReportType} 
              reportDetails={reportDetails} 
              submitReport={submitReport}
              setReportDetails={setReportDetails}
              setShowReportModal={setShowReportModal}
              />}
            </div>
            
  );
}
