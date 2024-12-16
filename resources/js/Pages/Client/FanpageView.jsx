import { useState, useRef } from "react";
import { FaHeart, FaShare, FaComment, FaEllipsisH, FaUserCircle } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Layout from "@/Layouts/Client/Layout";
import { FiCamera, FiUploadCloud } from "react-icons/fi";
import UserAvatar from "@/Components/UI/client/UserAvatar";
import { router } from '@inertiajs/react';
import CreatePost from "@/Components/UI/client/createPost/CreatePost";
import Post from "@/Components/UI/client/post/Post";
import { toast } from "react-toastify";


const FanpageView = ({fanpage , initialPosts, isOwner, is_followed}) => {
  const fanpageId = fanpage.id;
  const [isFollowing, setIsFollowing] = useState(is_followed);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [theme, setTheme] = useState("light");
  // const [selectedFile, setSelectedFile] = useState(null);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [newPost, setNewPost] = useState("");

  const attachmentImages = initialPosts.flatMap((post) => 
    post.attachments.filter((attachment) => attachment.mime.startsWith('image/'))
  ).map((attachment) => attachment.path)
  .slice(0, 4);

  const imagesToDisplay = attachmentImages.length > 0 ? attachmentImages : [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    "https://images.unsplash.com/photo-1653155864141-57b96ee8216f",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
    "https://images.unsplash.com/photo-1611162616475-46b635cb6868"
  ];

  const toggleFollow = () => {
    const action = isFollowing ? "unfollow" : "follow";
    const method = isFollowing ? "delete" : "post";
    const url = `/fanpages/${fanpageId}/${action}`;
  
    router[method](url, {}, {
      onSuccess: () => {
        setIsFollowing((prev) => !prev); 
      },
      onError: (errors) => {
        console.error(errors);
      }
    });
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload("avatar", file, fanpageId);
    }
  };
  
  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload("cover_image", file, fanpageId);
    }
  };

  const handleUpload = async (type, file, fanpageId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fanpage_id', fanpageId);
    const url = `/fanpages/${fanpageId}/upload-${type}`;
  
    router.post(url, formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success(`Uploaded ${type} successfully`, {
          position: "top-right",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      });
      },
      onError: (errors) => {
        console.error(errors);
      },
      preserveScroll: true,
    });
  };

  
  const triggerAvatarInput = () => {
    avatarInputRef.current.click();
  };

  const triggerCoverInput = () => {
    if (coverInputRef.current) {
        coverInputRef.current.click();
      } else {
        console.error("coverInputRef is not attached.");
      }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file && file.type.startsWith("image/")) {
  //     setSelectedFile(file);
  //   } else {
  //     alert("Please select an image file");
  //   }
  // };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesToDisplay.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesToDisplay.length) % imagesToDisplay.length);
  };

  return (
    <div className="min-h-screen bg-gray-100 col-span-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Cover Image Section */}
      <div 
            className="relative h-80"
          >
            {fanpage.cover_image ? (
              <img
                src={fanpage.cover_image}
                alt="Cover"
                className="w-full h-full object-cover"
                
                />
              
            ) : (
              <div className={`w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center transition-all duration-300`}>
                {isOwner && (
                  <>
                <FiUploadCloud className="w-20 h-20 text-white mb-4" />
                <p className="text-white text-xl font-semibold mb-2">No cover image uploaded yet</p>
                <button 
                  onClick={triggerCoverInput}
                  className="mt-4 px-6 py-2 bg-white text-purple-600 rounded-full hover:bg-opacity-90 transition-all duration-300 flex items-center"
                  >
                  <FiCamera className="mr-2" /> Upload Cover
                </button>
                  </>
                )}
              </div>
            )}
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleBannerUpload}            
              accept="image/*"
              className="hidden"
            />
             {isOwner && fanpage.cover_image && (
            <button 
                    onClick={triggerCoverInput}
                    className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100">
                    <FiCamera className="w-4 h-4 text-gray-700" />
              </button>
             )}
          </div>

      {/* Profile Section */}
      <div className="relative px-6 py-4">
              <div className="flex justify-between items-end">
                <div className="flex items-end">
                  <div className="relative -mt-24">
                    <UserAvatar user={fanpage} size="huge" />
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {isOwner && (
                      <button 
                      onClick={triggerAvatarInput}
                      className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100">
                      <FiCamera className="w-4 h-4 text-gray-700" />
                    </button>
                      )}
                  </div>
                  <div className="ml-6 mb-2">
                    <h1 className="text-3xl font-bold">{fanpage.name}</h1>
                    <p className="text-gray-600">{fanpage.description}</p>
                  </div>
                </div>
                {!isOwner && (
                <div className="flex space-x-3">
                <button
            onClick={toggleFollow}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${isFollowing
              ? "bg-gray-200 text-gray-800"
              : "bg-blue-600 text-white hover:bg-blue-700"}`}
            aria-label={isFollowing ? "Unfollow page" : "Follow page"}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
                  </div>
                                  )}
              </div>
           
            </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
           <CreatePost fanpageId={fanpageId}/>

            {/* Posts */}
            {initialPosts.length > 0 ? (
                    initialPosts.map((post) => (
                        <Post key={post.id} post={post}/>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
          </div>

          {/* Right Column - Media Gallery */}
          <div className="space-y-6">
            <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-xl font-semibold mb-4">Media Gallery</h2>
              <div className="grid grid-cols-2 gap-2">
                {imagesToDisplay.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setShowLightbox(true);
                    }}
                    className="relative aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                    //   onError={(e) => {
                    //     e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe";
                    //   }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white text-xl p-2"
          >
            ✕
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-4xl p-2"
          >
            <MdKeyboardArrowLeft />
          </button>
          <img
            src={`${imagesToDisplay[currentImageIndex]}`}
            alt={`Lightbox image ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe";
            }}
          />
          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-4xl p-2"
          >
            <MdKeyboardArrowRight />
          </button>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

FanpageView.layout = (page) => (
    <Layout showRightBar={false} showLeftBar={false}>{page}</Layout>
  );
export default FanpageView;