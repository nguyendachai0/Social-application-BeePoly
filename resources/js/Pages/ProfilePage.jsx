import React, { useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import UserAvatar from '@/Components/app/UserAvatar';
import { FiEdit2, FiCamera, FiMapPin,FiUser, FiUploadCloud, FiCalendar, FiMail, FiUserPlus, FiUserMinus, FiUserCheck, FiGrid, FiBookmark, FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { router } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { formatMessageDateShort } from '@/helpers';
import {  FaCamera,  FaTimes,  FaImage, FaUsers, FaGlobe, FaLock } from "react-icons/fa";
import { GiBee } from "react-icons/gi";
import Post from '@/Components/post/Post';

const mockUser = {
  name: "Alex Johnson",
  avatar: "images.unsplash.com/photo-1599566150163-29194dcaad36",
  coverImage: "",
  bio: "Digital nomad | Photography enthusiast | Coffee lover",
  followers: 1234,
  following: 891,
  posts: 342,
  location: "San Francisco, CA",
  website: "www.alexjohnson.com",
  joinDate: "January 2020",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  isFollowing: false,
  isFriend: false,
  friends: [
    {
      id: 1,
      name: "Sarah Wilson",
      avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
      mutualFriends: 15
    },
    {
      id: 2,
      name: "Michael Brown",
      avatar: "images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      mutualFriends: 23
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "images.unsplash.com/photo-1438761681033-6461ffad8d80",
      mutualFriends: 8
    },
    {
      id: 4,
      name: "James Taylor",
      avatar: "images.unsplash.com/photo-1500648767791-00dcc994a43e",
      mutualFriends: 31
    }
  ]
};

const mockPosts = [
  {
    id: 1,
    image: "images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    caption: "Beautiful sunset at the beach 🌅",
    likes: 243,
    comments: 15,
    bookmarked: false,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    image: "images.unsplash.com/photo-1509042239860-f550ce710b93",
    caption: "Morning coffee is a must ☕",
    likes: 156,
    comments: 8,
    bookmarked: true,
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    image: "images.unsplash.com/photo-1501854140801-50d01698950b",
    caption: "Nature's beauty 🌿",
    likes: 198,
    comments: 12,
    bookmarked: false,
    timestamp: "1 day ago"
  },
  {
    id: 4,
    image: "images.unsplash.com/photo-1441974231531-c6227db76b6e",
    caption: "Forest adventures 🌲",
    likes: 321,
    comments: 24,
    bookmarked: false,
    timestamp: "2 days ago"
  },
  {
    id: 5,
    image: "images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    caption: "Mountain views 🏔️",
    likes: 176,
    comments: 16,
    bookmarked: true,
    timestamp: "3 days ago"
  },
  {
    id: 6,
    image: "images.unsplash.com/photo-1475924156734-496f6cac6ec1",
    caption: "Peaceful moments in nature 🍃",
    likes: 267,
    comments: 19,
    bookmarked: false,
    timestamp: "4 days ago"
  }
];


const ProfilePage = ({ profile: initialProfile, countFriends: initialCountFriends, initialProfileFriends, posts: initialPosts, isOwner, countFollowers, countPosts, friendStatus }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);
  const [followersCount, setFollowersCount] = useState(mockUser.followers);
  const [avatar, setAvatar] = useState(mockUser.avatar);
  const [coverImage, setCoverImage] = useState(mockUser.coverImage);
  const friends =  usePage().props.friends;
  const profileId = initialProfile.id;
  const [showCreateFanPage, setShowCreateFanPage] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Relavant to FanPage
  const [fanPages, setFanPages] = useState([
    {
      id: 1,
      name: "Tech Enthusiasts",
      cover: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      members: 1234,
      description: "A community for tech lovers and innovators",
      privacy: "public"
    }
  ]);

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

  const CreateFanPage = ({ newFanPage, setNewFanPage, onSubmit, onClose }) => {
    const coverInputRef = useRef(null);
    const avatarInputRef = useRef(null);
  
    const handleImageChange = (e, type) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewFanPage({ ...newFanPage, [type]: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
  
          <h3 className="text-2xl font-bold mb-6">Create Fan Page</h3>
  
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="relative">
              <div
                className="h-48 rounded-lg bg-gray-100 mb-4 overflow-hidden"
                onClick={() => coverInputRef.current.click()}
              >
                {newFanPage.cover ? (
                  <img
                    src={newFanPage.cover}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaImage className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={coverInputRef}
                onChange={(e) => handleImageChange(e, "cover")}
                accept="image/*"
                className="hidden"
              />
  
              <div className="absolute -bottom-6 left-4">
                <div
                  className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white overflow-hidden"
                  onClick={() => avatarInputRef.current.click()}
                >
                  {newFanPage.avatar ? (
                    <img
                      src={newFanPage.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FaCamera className="text-2xl text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => handleImageChange(e, "avatar")}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
  
            <div className="mt-8 space-y-4">
              <div>
                <input
                  type="text"
                  value={newFanPage.name}
                  onChange={(e) => setNewFanPage({ ...newFanPage, name: e.target.value })}
                  placeholder="Page Name"
                  className="w-full p-3 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
  
              <div>
                <textarea
                  value={newFanPage.description}
                  onChange={(e) => setNewFanPage({ ...newFanPage, description: e.target.value })}
                  placeholder="Page Description"
                  className="w-full p-3 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="3"
                  required
                />
              </div>
  
              <div>
                <select
                  value={newFanPage.privacy}
                  onChange={(e) => setNewFanPage({ ...newFanPage, privacy: e.target.value })}
                  className="w-full p-3 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
  
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90"
              >
                Create Page
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const FanPageCard = ({ page }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-100">
        <div className="relative h-48">
          <img
            src={page.cover}
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
                  <span>{page.members.toLocaleString()} members</span>
                  {page.privacy === "public" ? (
                    <FaGlobe className="text-white/80" />
                  ) : (
                    <FaLock className="text-white/80" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">{page.description}</p>
          <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
            <FaUsers />
            <span>Join Page</span>
          </button>
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload("banner", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
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
                src={`/storage/${initialProfile.banner}`}
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
                   onSubmit={handleCreateFanPage}
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
