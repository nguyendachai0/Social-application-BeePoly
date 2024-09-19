import React from "react";
import Share from "@/Components/share/Share";
import Stories from "@/Components/Stories/Story";
import UserAvatar from "../UserAvatar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Post from "@/Components/post/Post";
const Content = ({user, posts}) => {
    return (
        <>
                   <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
<ToastContainer />
            <div>
                <Share user={user}/>
              
            </div>
             {/* Displaying Posts */}
             <div className="feed">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post.id} post={post}/>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </>
    );
};

export default Content;
