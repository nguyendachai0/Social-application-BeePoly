import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal"; // Adjust the path as needed
import { router, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { FaGlobe, FaUserFriends, FaLock } from "react-icons/fa";

const CreatePost = ({ fanpageId, setPosts }) => {
  const [newPost, setNewPost] = useState({
    caption: "",
    attachments: [],
    taggedFriends: [],
    mediaType: "image",
    visibility: "public",
  });
  const [mediaPreview, setMediaPreview] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const friendsList = usePage().props.friends;
  const [showFriendsList, setShowFriendsList] = useState(false);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file =>
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video"
    }));

    setMediaPreview([...mediaPreview, ...newPreviews]);
    setNewPost(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeMedia = (index) => {
    const updatedPreviews = mediaPreview.filter((_, i) => i !== index);
    const updatedMedia = newPost.attachments.filter((_, i) => i !== index);
    setMediaPreview(updatedPreviews);
    setNewPost(prev => ({ ...prev, attachments: updatedMedia }));
  };

  const tagFriend = (friend) => {
    setNewPost(prev => ({
      ...prev,
      taggedFriends: [...prev.taggedFriends, friend]
    }));
    setShowFriendsList(false);
  };

  const removeTag = (friendId) => {
    setNewPost(prev => ({
      ...prev,
      taggedFriends: prev.taggedFriends.filter(f => f.id !== friendId)
    }));
  };

  const handleCreatePost = () => {
    setNewPost({ caption: "", attachments: [], taggedFriends: [], mediaType: "image" });
    setMediaPreview([]);
    setShowCreatePost(false);
  };

  const handleSubmitPost = () => {
    const formData = new FormData();
    formData.append("caption", newPost.caption);
    newPost.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
    formData.append("mediaType", newPost.mediaType);
    formData.append("taggedFriends", JSON.stringify(newPost.taggedFriends.map(friend => friend.id)));

    if (fanpageId) {
      formData.append("fanpage_id", fanpageId); // Include fanpage_id if it exists
    }

    formData.append("visibility", newPost.visibility);

    // Submit the post data using Inertia's router.post
    router.post("/posts", formData, {
      onSuccess: (page) => {
        toast.success("🦄 Post created successfully!");
        setShowCreatePost(false);
        setPosts(page.props.initialPosts);
        setNewPost({ caption: "", attachments: [], taggedFriends: [], mediaType: "image", visibility: "public" });
        setMediaPreview([]);
      },
      onError: (errors) => {
        console.error("Error creating post:", errors);
      },
      preserveScroll: true, // Optional, to preserve the scroll position
    });
  };


  const handleCaptionChange = (event) => {
    setNewPost((prevState) => ({
      ...prevState,
      caption: event.target.value // Update caption on input change
    }));
  };

  const visibilityOptions = [
    { value: "public", label: "Public", icon: FaGlobe },
    { value: "friends", label: "Friends", icon: FaUserFriends },
    { value: "private", label: "Private", icon: FaLock }
  ];



  return (
    <>
      <button
        onClick={() => setShowCreatePost(true)}
        className="w-full bg-white rounded-lg shadow-md p-4 my-4 text-left text-gray-500 hover:bg-gray-50"
      >
        What's on your mind?
      </button>
      {showCreatePost && (
        <CreatePostModal
          newPost={newPost}
          setNewPost={setNewPost}
          mediaPreview={mediaPreview}
          removeMedia={removeMedia}
          showFriendsList={showFriendsList}
          setShowFriendsList={setShowFriendsList}
          friendsList={friendsList}
          tagFriend={tagFriend}
          removeTag={removeTag}
          handleMediaUpload={handleMediaUpload}
          handleCreatePost={handleCreatePost}
          setShowCreatePost={setShowCreatePost}
          handleCaptionChange={handleCaptionChange}
          handleSubmitPost={handleSubmitPost}
          visibilityOptions={visibilityOptions}
        />
      )}
    </>
  );
};

export default CreatePost;
