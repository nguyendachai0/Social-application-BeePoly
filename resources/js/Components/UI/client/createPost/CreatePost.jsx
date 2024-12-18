import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal"; // Adjust the path as needed
import { router, usePage } from "@inertiajs/react";

const CreatePost = () => {
  const [newPost, setNewPost] = useState({
    caption: "",
    attachments: [],
    taggedFriends: [],
    mediaType: "image"
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
    
    // Submit the post data using Inertia's router.post
    router.post("/posts", formData, {
      onSuccess: (page) => {
        console.log("Post created successfully:", page);
        setNewPost({ caption: "", attachments: [], taggedFriends: [], mediaType: "image" });
        setMediaPreview([]);
        setShowCreatePost(false);
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
        />
      )}
    </>
  );
};

export default CreatePost;
