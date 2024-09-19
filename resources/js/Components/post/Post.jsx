import { MoreVert, ThumbUp, ChatBubbleOutline, Share } from "@mui/icons-material";
import { format, parseISO } from 'date-fns'; 
import UserAvatar from "../app/UserAvatar";
import "./post.css";
import Attachment from "../attachments/Attachment";
import PostActions from "../postActions/PostActions";
export default function Post({ post }) {
  const formattedDate = format(parseISO(post.created_at), 'MMMM dd, yyyy');

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <UserAvatar user={post.user} />
            <span className="postUsername">{post.user.first_name} {post.user.last_name}</span>
            <span className="postDate">{formattedDate}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.caption}</span>
          <Attachment attachments={post.attachments} />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src="https://via.placeholder.com/20/0000FF/FFFFFF?text=L" alt="Like" />
            <img className="likeIcon" src="https://via.placeholder.com/20/FF0000/FFFFFF?text=H" alt="Heart" />
            <span className="postLikeCounter">100 people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">50 comments</span>
          </div>
        </div>
        <PostActions /> {/* Render the PostActions component */}
      </div>
    </div>
  );
}
