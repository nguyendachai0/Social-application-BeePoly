import { format, parseISO } from 'date-fns'; 
import UserAvatar from "../UserAvatar";
import {  FaHeart, FaComment, FaShare, FaFlag, FaEllipsisH, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePage } from '@inertiajs/react';
import CommentSection from '../comments/CommentSection';
import ReportModal from '../ReportModal';
import useLikes from "@/utils/hooks/useLikes";
import useReport from '@/utils/hooks/useReport';
import useComments from "@/utils/hooks/useComments";
import { useState } from 'react';
import { useDeletePost } from '@/utils/hooks/useDeletePost';
import { formatMessageDateShort } from '@/helpers';

export default function Post({ post, isOwnerPost, handleEditPost, setPosts}) {
  const csrfToken = usePage().props.csrfToken;

  const [currentImageIndex, setCurrentImageIndex] = useState({
    [post.id]: 0,
  });
  const handleNextImage = (postId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [post.id]: (prev[post.id] + 1) % post.attachments.length,   
     }));
  };

  const {
    showDeleteModal,
    setShowDeleteModal,
    handleDelete,
    confirmDelete,
  } = useDeletePost(setPosts);

  


  const handlePrevImage = (postId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [post.id]: (prev[post.id] - 1 + post.attachments.length) % post.attachments.length,   
     }));
  };


 
  const { likes, isLiked, toggleLike } = useLikes(
    post.reactions?.length || 0,
    post.reactions?.some(reaction => reaction.user_id === usePage().props.auth.user.id) || false,
    post.id,
    csrfToken
  );

  const { commentSections, toggleCommentSection } = useComments();


  const [showOptionsMenu, setShowOptionsMenu] = useState(null);


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

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <FaTrash className="mx-auto text-red-500 text-4xl mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  return (
   
            <div key={post.id} className="bg-white rounded-lg shadow-md transform transition">
              <div className="p-4 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                   <UserAvatar user={post.user}/>
                   <div className="ml-3">
                    <p className="font-semibold">{post.user.first_name} {post.user.sur_name}</p>
                    <p className="text-gray-500 text-sm">{formatMessageDateShort(post.created_at)}</p>
                    {post.tagged_users && post.tagged_users.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          with{" "}
                          {post.tagged_users.map((friend, index) => (
                            <span key={friend.id}>
                              <span className="text-blue-500 hover:underline cursor-pointer">
                                {friend.first_name} {friend.sur_name}
                              </span>
                              {index < post.tagged_users.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      )}
                      </div>
                  </div>
                  {/* <button 
                    onClick={() => handleReport(post.id, "post")}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                    aria-label="Report post"
                  >
                    <FaFlag />
                  </button> */}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptionsMenu(showOptionsMenu === post.id ? null : post.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaEllipsisH />
                  </button>
                         
                  {showOptionsMenu === post.id && (
                     <div
                     className="absolute bg-white rounded-lg shadow-lg py-2 z-50 top-[60px] right-0"
                     >
                   { isOwnerPost ? (
                      <>
                        <button
                          onClick={() => {
                            setShowOptionsMenu(false)
                            handleEditPost(post)}
                          }
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => { 
                            setShowOptionsMenu(false)
                            handleDelete(post.id)}}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReport(post.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500"
                      >
                        <FaFlag className="mr-2" /> Report
                      </button>
                    )}
                    </div>
                  )}
                </div>
                <p className="mb-4">{post.caption}</p>
                
                {/* <Attachment attachments={post.attachments} /> */}
              
            <div className="mt-4 relative">
                  <div className="relative w-full h-65">
                  {post.attachments && post.attachments.length > 0 ? (
                    <>
                    {post.attachments[currentImageIndex[post.id]]?.mime.startsWith("video/") ? (
                      <video
                      controls
                      src={`${post.attachments[currentImageIndex[post.id]]?.path}`}
                      className="w-full h-[26rem] object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={`${post.attachments[currentImageIndex[post.id]]?.path}`}
                      alt={`Post content ${currentImageIndex[post.id] + 1}`}
                      className="w-full h-65 object-cover rounded-lg"
                    />
                    )
                  }
                    {post.attachments.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevImage();
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage();
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <FaChevronRight />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {post.attachments.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${index === currentImageIndex[post.id] ? "bg-white" : "bg-white bg-opacity-50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    </>
                  ): null}
                  </div>
                </div>
               
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

                {showDeleteModal && <DeleteConfirmationModal />}
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
