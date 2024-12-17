import { useState } from 'react';
import { router } from '@inertiajs/react';
import {usePage} from '@inertiajs/react';
import { toast } from 'react-toastify';

export const useDeletePost =(setPosts) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleDelete = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!postToDelete) return;
  
    router.delete(`/posts/${postToDelete}`, {
      onSuccess: () => {
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== postToDelete));
        toast.success("Deleted Post successfully");
      },
      onError: (errors) => {
        toast.error("Failed to delete the post. Please try again.");
        console.error('Failed to delete post:', errors);
      },
      onFinish: () => {
        setShowDeleteModal(false);
        setPostToDelete(null);
      },
      preserveScroll: true,
    });
  };

  return {
    showDeleteModal,
    setShowDeleteModal,
    handleDelete,
    confirmDelete,
  };
}
