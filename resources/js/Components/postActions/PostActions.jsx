import React from 'react';
import { ThumbUp, ChatBubbleOutline, Share } from "@mui/icons-material";
import "./postActions.css";

const PostActions = () => (
  <div className="postActions">
    <button className="likeButton">
      <ThumbUp className="likeIcon" />
      <span>Like</span>
    </button>
    <button className="commentButton">
      <ChatBubbleOutline className="commentIcon" />
      <span>Comment</span>
    </button>
    <button className="shareButton">
      <Share className="shareIcon" />
      <span>Share</span>
    </button>
  </div>
);

export default PostActions;
