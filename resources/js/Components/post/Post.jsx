import { format, parseISO } from 'date-fns'; 
import UserAvatar from "../app/UserAvatar";
import {  FaHeart, FaComment, FaShare, FaFlag, FaEllipsisH, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDarkMode } from "@/Context/DarkModeContext";
import Attachment from "../attachments/Attachment";
import { usePage } from '@inertiajs/react';
import CommentSection from '../app/CommentSection';
import ReportModal from '../app/ReportModal';
import useLikes from "@/utils/hooks/useLikes";
import useReport from '@/utils/hooks/useReport';
import useComments from "@/utils/hooks/useComments";
import { useState } from 'react';
import EditPostModal from './EditPostModal';

export default function Post({ post, isOwnerPost, handleEditPost}) {
  const [currentImageIndex, setCurrentImageIndex] = useState({
    [post.id]: 0,
  });
  const handleNextImage = (postId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [post.id]: (prev[post.id] + 1) % post.attachments.length,   
     }));
  };

  const handlePrevImage = (postId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [post.id]: (prev[post.id] - 1 + post.attachments.length) % post.attachments.length,   
     }));
  };

  const {darkMode} = useDarkMode();

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
 
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

 



  // const handleUpdatePost = () => {
  //   setPosts(posts.map(post => {
  //     if (post.id === editPost.id) {
  //       return {
  //         ...post,
  //         content: editCaption,
  //         image: editImage
  //       };
  //     }
  //     return post;
  //   }));
  //   setShowEditModal(false);
  //   setEditPost(null);
  //   setEditCaption("");
  //   setEditImages("");
  //   setSelectedFile(null);
  // };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    formData.append("caption",post.caption);
    post.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file); 
    });

    if (fanpageId) {
      formData.append("fanpage_id", fanpageId); 
    }

    try {
        const response = await axios.put(`/posts/${post.id}`, formData,{
            headers:{
                "Content-Type": "multipart/form-data",
         }
        });

        toast.success("Post updated successfully!");
    } catch (error) {
        if (error.response && error.response.data.errors) {
            const formattedErrors = formatErrors(error.response.data.errors); 
            toast.error(formattedErrors); 
                    } else {
                        toast.error("An error occurred while creating the post.");           
                     }         
                     }        
  };

  return (
   
            <div key={post.id} className={`mb-8 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md transform transition`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                   <UserAvatar user={post.user}/>
                    <span className="font-semibold">{post.user.first_name} {post.user.sur_name}</span>
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
                     className="absolute bg-white rounded-lg shadow-lg py-2 z-50 top-[45px] right-0"
                     >
                   { isOwnerPost ? (
                      <>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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
                  <img
                    src={`${post.attachments[currentImageIndex[post.id]]?.path}`}
                    alt={`Post content ${currentImageIndex[post.id] + 1}`}
                    className="w-full h-65 object-cover rounded-lg"
                  />
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
