import { useState } from "react";
import { router, usePage } from '@inertiajs/react';
import { FaGlobe, FaUserFriends, FaLock } from "react-icons/fa";


export const useEditPost = (setPosts) => {
  const [editPost, setEditPost] = useState({
    caption: "",
    attachments: [],
    taggedFriends: [],
    mediaType: "image",
    visibility: "public",
  });
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const friendsList = usePage().props.friends;

  const handleEditPost = (post) => {
    setEditPost(post);
    setTaggedFriends(post?.tagged_users || []);
    setEditCaption(post?.caption || "");
    setEditImages(post?.attachments || []);
    setShowEditModal(true);
  };

  const handleFileChange = (input) => {
    let files = [];

    if (input?.target?.files) {
      // Input is a file input event
      files = Array.from(input.target.files);
    } else if (input instanceof File) {
      // Input is a direct File object
      files = [input];
    } else {
      console.error("File input is not valid:", input);
      return;
    }


    const newImagePreviews = files.map((file) => ({
      name: file.name,
      mime: file.type,
      path: URL.createObjectURL(file),
    }));

    setEditImages(
      [
        ...newImagePreviews
      ]);

    setSelectedFiles((prev) => [...(prev || []), ...files]);


  };

  const removeImage = (index) => {
    setEditImages(editImages.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      return updatedFiles;
    });
  };


  const logFormData = (formData) => {
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  };

  const visibilityOptions = [
    { value: "public", label: "Public", icon: FaGlobe },
    { value: "friends", label: "Friends", icon: FaUserFriends },
    { value: "private", label: "Private", icon: FaLock }
  ];

  const tagFriend = (friend) => {
    setTaggedFriends((prev) => [...prev, friend]);
    setShowFriendsList(false);
  };

  const removeTag = (friendId) => {
    setTaggedFriends((prev) => prev.filter((friend) => friend.id !== friendId))
  }

  const handleUpdatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", editCaption);
      selectedFiles.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
      formData.append("taggedFriends", JSON.stringify(taggedFriends.map(friend => friend.id)));
      formData.append("visibility", editPost.visibility);
      formData.append("_method", "PUT");
      logFormData(formData);
      router.post(`/posts/${editPost.id}`, formData, {
        onSuccess: (page) => {
          setPosts(page.props.initialPosts);
          setShowEditModal(false);
          setSelectedFiles([]);
        },
        onError: (errors) => {
          console.error("Validation errors:", errors);
        },
        preserveScroll: true,
      });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return {
    editPost,
    editCaption,
    editImages,
    taggedFriends,
    setEditCaption,
    setEditImages,
    showEditModal,
    removeImage,
    setShowEditModal,
    handleEditPost,
    handleFileChange,
    handleUpdatePost,
    friendsList,
    showFriendsList,
    setShowFriendsList,
    tagFriend,
    removeTag,
    visibilityOptions,
    setEditPost
  };
};
