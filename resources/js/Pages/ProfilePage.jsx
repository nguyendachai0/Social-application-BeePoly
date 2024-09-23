import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { FaHeart, FaComment, FaShare, FaPlus, FaImage, FaVideo, FaMapMarkerAlt, FaUserTag, FaUser, FaEnvelope, FaBriefcase, FaGraduationCap, FaMapMarkerAlt as FaLocation } from "react-icons/fa";

import Layout from '@/Layouts/Layout';
const ProfilePage = ({ profile: initialProfile, countFriends: initialCountFriends, friendRequest: initialFriendRequest, posts: initialPosts }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [newPost, setNewPost] = useState("");
  const [previewPost, setPreviewPost] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [profile, setProfile] = useState(initialProfile);
  const [countFriends, setCountFriends] = useState(initialCountFriends);
  const [friendRequest, setFriendRequest] = useState(initialFriendRequest);
  const [posts, setPosts] = useState(initialPosts);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const page = usePage();
  const authUser = page.props.auth.user;
  const isOwnProfile = authUser.id === profile.id;
  const handlePostChange = (e) => {
    setNewPost(e.target.value);
    setPreviewPost(e.target.value);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = () => {
    // Logic to post the story
    console.log("Posting:", newPost);
    setNewPost("");
    setPreviewPost("");
    setMediaPreview(null);
  };
  console.log('p',posts);
  const handleFileChange = (event, type) => {
    if (type === 'avatar') {
      setAvatar(event.target.files[0]);
    } else if (type === 'banner') {
      setBanner(event.target.files[0]);
    }
  };

  const uploadImageToServer = async (file, type) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    setUploading(true);

    try {
      const response = await fetch('/profile/upload-image', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      } else {
        alert(`Failed to update ${type}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAvatar = () => {
    if (avatar) {
      uploadImageToServer(avatar, 'avatar');
    }
  };

  const handleUploadBanner = () => {
    if (banner) {
      uploadImageToServer(banner, 'banner');
    }
  };

  const sendFriendRequest = async (url, body,  successMessage) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(`Failed to perform action: ${response.statusText}`);
      }
      alert(successMessage);
      setFriendRequest(data.friendRequest);
      setCountFriends(data.countFriends);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddFriend = () => sendFriendRequest('/send-friend-request', { recipientId: profile.id }, 'Friend request sent!');
  const handleCancelFriendRequest = () => sendFriendRequest('/cancel-friend-request', { recipientId: profile.id }, 'Friend request cancelled!');
  const handleAcceptFriendRequest = () => sendFriendRequest('/accept-friend-request', { senderId: profile.id }, 'Friend request accepted!');
  const handleDeclineFriendRequest = () => sendFriendRequest('/decline-friend-request', { senderId: profile.id }, 'Friend request declined!');
  const handleRemoveFriend = () => sendFriendRequest('/remove-friend', { friendId: profile.id }, 'Friend removed!');

  



  const handleMessage = () => {
    window.location.href = `/messages/${profile.id}`;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const renderFriendRequestButtons = () => {
    if (!friendRequest) {
      return <button onClick={handleAddFriend} className="btn btn-primary">Add Friend</button>;
    }
  
    if (friendRequest.status === 'pending') {
      return friendRequest.receiver_id === profile.id ? (
        <button onClick={handleCancelFriendRequest} className="btn btn-neutral">Cancel Friend Request</button>
      ) : (
        <>
          <button onClick={handleAcceptFriendRequest} className="btn btn-primary">Accept Request</button>
          <button onClick={handleDeclineFriendRequest} className="btn btn-accent">Decline Request</button>
        </>
      );
    }
  
    if (friendRequest.status === 'rejected') {
      return friendRequest.receiver_id === profile.id ? (
        <>
          <button className="btn btn-primary">Following</button>
          <button onClick={handleCancelFriendRequest} className="btn btn-neutral">Cancel Friend Request</button>
        </>
      ) : (
        <button onClick={handleAddFriend} className="btn btn-primary">Add Friend</button>
      );
    }
  
    if (friendRequest.status === 'accepted') {
      return <button onClick={handleRemoveFriend} className="btn btn-secondary">Remove Friend</button>;
    }
  
    return null;
  };
  

  return (
    <>
    <div className="max-w-4xl mx-auto p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="p-6 relative">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="w-32 h-32 rounded-full absolute -top-16 border-4 border-white shadow-lg"
          />
          <div className="mt-16">
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-gray-600">Web Developer & Designer</p>
          </div>
          <div className="mt-4 flex space-x-4 text-gray-600">
            <div className="flex items-center">
              <FaEnvelope className="mr-2" />
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center">
              <FaLocation className="mr-2" />
              <span>San Francisco, CA</span>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <div className="flex items-center">
              <FaBriefcase className="mr-2 text-gray-600" />
              <span>Software Engineer at TechCorp</span>
            </div>
            <div className="flex items-center">
              <FaGraduationCap className="mr-2 text-gray-600" />
              <span>Computer Science, Stanford University</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "posts" ? "border-b-2 border-blue-500 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "about" ? "border-b-2 border-blue-500 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "friends" ? "border-b-2 border-blue-500 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "photos" ? "border-b-2 border-blue-500 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
        </div>

        {activeTab === "posts" && (
          <div className="p-6">
            <div className="mb-6">
              <textarea
                className="w-full p-2 border rounded-lg mb-4"
                rows="3"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={handlePostChange}
              ></textarea>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <label className="cursor-pointer text-gray-600 hover:text-blue-500">
                    <FaImage className="text-xl" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleMediaUpload} />
                  </label>
                  <label className="cursor-pointer text-gray-600 hover:text-blue-500">
                    <FaVideo className="text-xl" />
                    <input type="file" className="hidden" accept="video/*" onChange={handleMediaUpload} />
                  </label>
                  <button className="text-gray-600 hover:text-blue-500">
                    <FaMapMarkerAlt className="text-xl" />
                  </button>
                  <button className="text-gray-600 hover:text-blue-500">
                    <FaUserTag className="text-xl" />
                  </button>
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handlePostSubmit}
                >
                  Post
                </button>
              </div>
              {(previewPost || mediaPreview) && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Preview</h4>
                  {previewPost && <p>{previewPost}</p>}
                  {mediaPreview && (
                    <img src={mediaPreview} alt="Preview" className="mt-2 max-w-full h-auto rounded-lg" />
                  )}
                </div>
              )}
            </div>

            {/* Example post */}
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p className="mb-4">Just finished a great coding session! #WebDevelopment #JavaScript</p>
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                alt="Coding session"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="flex items-center text-gray-600 hover:text-blue-500">
                    <FaHeart className="mr-1" /> Like
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-blue-500">
                    <FaComment className="mr-1" /> Comment
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-blue-500">
                    <FaShare className="mr-1" /> Share
                  </button>
                </div>
                <span className="text-sm text-gray-500">42 likes · 8 comments</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="mb-4">
              I'm a passionate web developer with 5 years of experience in creating responsive and user-friendly
              websites. My expertise includes HTML, CSS, JavaScript, React, and Node.js. I love solving complex
              problems and learning new technologies.
            </p>
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git", "Responsive Design"].map(
                (skill) => (
                  <span key={skill} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                )
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            <div className="mb-4">
              <h4 className="font-semibold">Senior Web Developer - TechCorp</h4>
              <p className="text-sm text-gray-600">2018 - Present</p>
              <ul className="list-disc list-inside mt-2">
                <li>Lead a team of 5 developers in creating responsive web applications</li>
                <li>Implemented new features and optimized existing codebase for better performance</li>
                <li>Collaborated with designers and product managers to deliver high-quality products</li>
              </ul>
            </div>
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            <div>
              <h4 className="font-semibold">BS in Computer Science - Stanford University</h4>
              <p className="text-sm text-gray-600">2012 - 2016</p>
            </div>
          </div>
        )}

        {activeTab === "friends" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Friends</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((friend) => (
                <div key={friend} className="text-center">
                  <img
                    src={`https://images.unsplash.com/photo-${1518000000000 + friend}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                    alt={`Friend ${friend}`}
                    className="w-24 h-24 rounded-full mx-auto mb-2"
                  />
                  <p className="font-semibold">Friend {friend}</p>
                  <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((photo) => (
                <img
                  key={photo}
                  src={`https://images.unsplash.com/photo-${1518000000000 + photo}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&h=300&q=80`}
                  alt={`Photo ${photo}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    </>

  );
};
ProfilePage.layout = (page) => (
  <Layout showRightBar={false} showLeftBar={false}>{page}</Layout>
);
export default ProfilePage;
