import { useState } from "react";

const useLikes = (initialLikes, userLiked, postId, csrfToken) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(userLiked);

  const toggleLike = async () => {
    setIsLiked(!isLiked);
    try {
      const response = await fetch(`/reaction`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ postID: postId }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setLikes(updatedPost.likeCount);
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return { likes, isLiked, toggleLike };
};

export default useLikes;
