import React, { useState } from 'react';
import { PhotoIcon, CameraIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';
import Post from '@/Components/post/Post';
import Layout from '@/Layouts/Layout';
import RightBarProfile from '@/Components/app/rightbarProfile/RightBarProfile';
const ProfilePage = ({ profile: initialProfile, countFriends: initialCountFriends, friendRequest: initialFriendRequest, posts: initialPosts }) => {
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
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl px-4">
        {/* Cover Photo */}
        <div className="relative w-full h-60 bg-cover bg-center bg-gray-800">
          <img
            src={profile.banner ? `/storage/banners/${profile.banner}` : "https://via.placeholder.com/1500x600"}
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />

          {isOwnProfile && (
            <>
              <label className="absolute top-0 right-0 m-4 p-2 bg-gray-800 rounded-full text-white cursor-pointer">
                <PhotoIcon className="h-6 w-6" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'banner')}
                />
              </label>
              <button
                onClick={handleUploadBanner}
                className="absolute top-0 right-16 m-4 p-2 bg-gray-800 rounded-full text-white"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </>
          )}

          {/* Profile Picture */}
          <div className="absolute bottom-0 left-1/2 transform translate-y-1/2  -translate-x-1/2">
            <img
              src={profile.avatar ? `/storage/avatars/${profile.avatar}` : "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-white"
            />

            {isOwnProfile && (
              <>
                <label className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full text-white">
                  <CameraIcon className="h-6 w-6" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'avatar')}
                  />
                </label>
                <button
                  onClick={handleUploadAvatar}
                  className="absolute bottom-0 right-16 p-2 bg-gray-800 rounded-full text-white"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </>
            )}
          </div>
        </div>
            {/* Profile */}
        {/* Profile Info and Buttons */}
        <div className="mt-12 p-4">
          <div className="flex justify-between items-center">
            {/* User Info */}
            <div>
              <h1 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h1>
              <p className="text-gray-600">{countFriends} Friends</p>
            </div>

            {/* Message and Add Friend/Accept Friend Request/Remove Friend Dropdown */}
            {!isOwnProfile && (
              <div className="relative">

    {renderFriendRequestButtons()}
                <button
                  onClick={handleMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4"
                >
                  Message
                </button>       
              </div>
            )}
          </div>
        </div>
        <div className="feed">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post.id} post={post}/>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
        </div>
        <RightBarProfile/><div className="flex">
  <div className="flex-1 p-4">
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id} post={post} />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  </div>
  <div className="w-1/3 p-4">
    <RightBarProfile profile={profile} />
  </div>
</div>
      </div>
     

    </div>

    </>

  );
};
ProfilePage.layout = (page) => (
  <Layout showRightBar={false}>{page}</Layout>
);
export default ProfilePage;
