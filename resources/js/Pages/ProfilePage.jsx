import React, { useState, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import UserAvatar from '@/Components/app/UserAvatar';
import { FiEdit2, FiCamera, FiMapPin,FiUser, FiUploadCloud, FiCalendar, FiMail, FiUserPlus, FiUserMinus, FiUserCheck, FiGrid } from "react-icons/fi";
import { router } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { formatMessageDateShort } from '@/helpers';
import {  FaCamera,  FaTimes,  FaImage, FaUsers, FaGlobe, FaLock } from "react-icons/fa";
import CreateFanPage from '@/Components/app/CreateFanPage';
import Post from '@/Components/post/Post';




const ProfilePage = ({ profile: initialProfile, countFriends: initialCountFriends, initialProfileFriends, posts: initialPosts, isOwner, countFollowers, countPosts, friendStatus, initialFanpages }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const friends =  usePage().props.friends;
  const profileId = initialProfile.id;
  const [showCreateFanPage, setShowCreateFanPage] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  console.log('fan', initialFanpages)

  // Relavant to FanPage
  const [fanPages, setFanPages] = useState(initialFanpages);

  const [newFanPage, setNewFanPage] = useState({
    name: "",
    description: "",
    privacy: "public",
    cover: null,
    avatar: null
  });

  const handleCreateFanPage = (e) => {
    e.preventDefault();
    const newPage = {
      id: fanPages.length + 1,
      ...newFanPage,
      members: 1,
      cover: newFanPage.cover || "https://images.unsplash.com/photo-1557683316-973673baf926",
      avatar: newFanPage.avatar || "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    };
    setFanPages([...fanPages, newPage]);
    setNewFanPage({
      name: "",
      description: "",
      privacy: "public",
      cover: null,
      avatar: null
    });
    setShowCreateFanPage(false);
  };


  const FanPageCard = ({ page }) => {

    const handleViewPage = () => {
      navigate(`/fanpages/${page.id}`);
    };

    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-100">
        <div className="relative h-48">
          <img
            src={page.cover_image}
            alt={page.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center space-x-4">
              <img
                src={page.avatar}
                alt={page.name}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <div className="text-white">
                <h3 className="font-bold text-xl">{page.name}</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <FaUsers className="text-white/80" />
                  {/* <span>{page.members.toLocaleString()} members</span> */}
                 
                    <FaGlobe className="text-white/80" />
                
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">{page.description}</p>
          <Link
        href={`/fanpages/${page.id}`}
        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
      >            <FaUsers />
            <span>View my Page</span>
          </Link>
        </div>
      </div>
    );
  };

  

  const sendFriendRequest = (recipientId) => {
    router.post("/send-friend-request", { recipientId }, {
      onSuccess: (page) => {
        alert(page.props.flash?.message || "Friend request sent successfully.");
      },
      onError: (errors) => {
        console.error(errors.message || "An error occurred.");
      },
    });
  };
  
  const cancelFriendRequest = (recipientId) => {
    router.post("/cancel-friend-request", { recipientId }, {
      onSuccess: (page) => {
        alert(page.props.flash?.message || "Friend request canceled successfully.");
      },
      onError: (errors) => {
        console.error(errors.message || "An error occurred.");
      },
    });
  };
  
  const acceptFriendRequest = (senderId) => {
    router.post("/accept-friend-request", { senderId }, {
      onSuccess: (page) => {
        alert(page.props.flash?.message || "Friend request accepted successfully.");
      },
      onError: (errors) => {
        console.error(errors.message || "An error occurred.");
      },
    });
  };
  
  const declineFriendRequest = (senderId) => {
    router.post("/decline-friend-request", { senderId }, {
      onSuccess: (page) => {
        alert(page.props.flash?.message || "Friend request declined successfully.");
      },
      onError: (errors) => {
        console.error(errors.message || "An error occurred.");
      },
    });
  };
  
  const removeFriend = (friendId) => {
    router.post("/remove-friend", { friendId }, {
      onSuccess: (page) => {
        alert(page.props.flash?.message || "Friend removed successfully.");
      },
      onError: (errors) => {
        console.error(errors.message || "An error occurred.");
      },
    });
  };


  const triggerAvatarInput = () => {
    avatarInputRef.current.click();
  };

  const triggerCoverInput = () => {
    coverInputRef.current.click();
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload("avatar", file);
    }
  };
  
  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload("banner", file);
    }
  };
  
  const handleUpload = async (type, file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    router.post(`/upload-${type}`, formData, {
      forceFormData: true,
      onSuccess: (response) => {
        if (type === "avatar") {
          setAvatar(response.avatarUrl); 
        } else if (type === "banner") {
          setCoverImage(response.bannerUrl); 
        }
        alert(`${type} uploaded successfully!`);
      },
      onError: (errors) => {
        console.error(errors);
      },
      onProgress: (progress) => {
        console.log(`Upload Progress: ${progress.percentage}%`);
      },
    });
  };
  

  return (
      <div className="min-h-screen bg-gray-100 col-span-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Cover Photo Section */}
            <div 
            className="relative h-80"
          >
            {initialProfile.banner ? (
              <img
                src={initialProfile.banner}
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
             {isOwner && initialProfile.banner && (
            <button 
                    onClick={triggerCoverInput}
                    className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100">
                    <FiCamera className="w-4 h-4 text-gray-700" />
              </button>
             )}
          </div>

            {/* Profile Info Section */}
            <div className="relative px-6 py-4">
              <div className="flex justify-between items-end">
                <div className="flex items-end">
                  <div className="relative -mt-24">
                    <UserAvatar user={initialProfile} size="huge" />
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
                    <h1 className="text-3xl font-bold">{initialProfile.first_name} {initialProfile.sur_name}</h1>
                    <p className="text-gray-600">{initialProfile.bio}</p>
                  </div>
                </div>
                {!isOwner && (
                <div className="flex space-x-3">

              {friendStatus === 'request_rejected' && (
                  <button
                    onClick={() => sendFriendRequest(profileId)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
                  >
                    <FiUserPlus className="mr-2" /> Resend Friend Request
                  </button>
                )}


                {friendStatus === "friends" && (
                  <button
                    onClick={() => removeFriend(profileId)} 
                    className="px-6 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-200 flex items-center"
                  >
                    <FiUserMinus className="mr-2" /> Unfriend
                  </button>
                )}

                {friendStatus === "request_sent" && (
                  <button
                    onClick={() => cancelFriendRequest(profileId)} 
                    className="px-6 py-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition duration-200 flex items-center"
                  >
                    <FiUserMinus className="mr-2" /> Unfollow
                  </button>
                )}

                {friendStatus === "request_received" && (
                    <>
                      <button
                        onClick={() => acceptFriendRequest(profileId)} // Replace with your accept friend request function
                        className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200 flex items-center"
                      >
                        <FiUserPlus className="mr-2" /> Accept
                      </button>
                      <button
                        onClick={() => declineFriendRequest(profileId)} // Replace with your decline friend request function
                        className="px-6 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-200 flex items-center"
                      >
                        <FiUserMinus className="mr-2" /> Decline
                      </button>
                    </>
                  )}

                  {friendStatus === "not_friends" && (
                      <button
                        onClick={() => sendFriendRequest(profileId)} // Replace with your send friend request function
                        className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200 flex items-center"
                      >
                        <FiUserPlus className="mr-2" /> Add Friend
                      </button>
                    )}
                  
               

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center"
                  >
                    <FiEdit2 className="mr-2" /> Edit Profile
                  </button>
                  </div>
                                  )}
              </div>

              {/* Rest of the component remains the same */}
              {/* Stats Section */}
              <div className="flex items-center space-x-6 mt-6">
                <div className="text-center">
                  <div className="font-bold text-xl">{countPosts}</div>
                  <div className="text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{countFollowers}</div>
                  <div className="text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{initialCountFriends}</div>
                  <div className="text-gray-600">Friends</div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  {initialProfile.address}
                </div>
                <div className="flex items-center text-gray-600">
                  <FiUser className="mr-2" /> {/* Or use a different icon */}
                  {initialProfile.gender}
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  Joined {formatMessageDateShort(initialProfile.created_at)}
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMail className="mr-2" />
                  {initialProfile.email}
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t mt-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex-1 py-4 text-center font-medium ${activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  <FiGrid className="inline mr-2" /> Posts
                </button>
                <button
                  onClick={() => setActiveTab("friends")}
                  className={`flex-1 py-4 text-center font-medium ${activeTab === "friends" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  Friends
                </button>
                <button
                  onClick={() => setActiveTab("my_fanpages")}
                  className={`flex-1 py-4 text-center font-medium ${activeTab === "my_fanpages" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  My Fanpages
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          {activeTab === "posts" && (
            <div className="mt-8 space-y-6">
            {initialPosts.length > 0 ? (
                    initialPosts.map((post) => (
                        <Post key={post.id} post={post}/>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
               </div>
          )}

          {/* About Section */}
          {activeTab === "friends" && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Friends {initialCountFriends}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialProfileFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                    <UserAvatar user={friend} size="medium" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{friend.first_name} {friend.sur_name}</h3>
                      <p className="text-gray-600 text-sm">{friend.mutualFriends} mutual friends</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                      <FiUserCheck className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "my_fanpages" && (
             <div className="container mx-auto px-4 py-8">
             <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-lg shadow-2xl p-6 border border-purple-200">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Fanpages</h2>
                 <button
                   onClick={() => setShowCreateFanPage(true)}
                   className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
                 >
                   <FaUsers className="text-xl" />
                   <span>Create Fan Page</span>
                 </button>
               </div>
     
               {showCreateFanPage && (
                 <CreateFanPage
                   newFanPage={newFanPage}
                   setNewFanPage={setNewFanPage}
                   onClose={() => setShowCreateFanPage(false)}
                 />
               )}
     
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 {fanPages.map((page) => (
                   <FanPageCard key={page.id} page={page} />
                 ))}
               </div>
             </div>
           </div>
          )}
          </div>
        </div>
  );
};
ProfilePage.layout = (page) => (
  <Layout showRightBar={false} showLeftBar={false}>{page}</Layout>
);
export default ProfilePage;
