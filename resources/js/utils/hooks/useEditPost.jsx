import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { router } from '@inertiajs/react';

export const useEditPost = (setPosts) => {
  const csrfToken = usePage().props.csrfToken;
  const [editPost, setEditPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editImages, setEditImages] = useState([]);

  const handleEditPost = (post) => {
    setEditPost(post);
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
      mime:  file.type,
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

  const handleUpdatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", editCaption);
      selectedFiles.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
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

  useEffect(() => {
    console.log('Updated selectedFiles:', selectedFiles);
  }, [selectedFiles]);

  return {
    editPost,
    editCaption,
    editImages,
    setEditCaption,
    setEditImages,
    showEditModal,
    removeImage,
    setShowEditModal,
    handleEditPost,
    handleFileChange,
    handleUpdatePost,
  };
};
