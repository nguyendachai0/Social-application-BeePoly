import { useState } from "react";

export default function useComments() {
    const [commentSections, setCommentSections] = useState({});

    const toggleCommentSection = async (postId) => {
        if (!commentSections[postId]) {
          try {
            const response = await fetch(`/posts/${postId}/comments`);
            const commentsData = await response.json();
            setCommentSections((prevState) => ({
              ...prevState,
              [postId]: commentsData,
            }));
          } catch (error) {
            console.error("Error fetching comments:", error);
          }
        } else {
          setCommentSections((prevState) => ({
            ...prevState,
            [postId]: null,
          }));
        }
      };
    
      return {
        commentSections,
        toggleCommentSection,
      };
}
