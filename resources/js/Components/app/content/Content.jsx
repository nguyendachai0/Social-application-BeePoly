import React, { useState } from "react";
import {  FaPlus } from "react-icons/fa";
import { useEffect } from "react";
import Post from "@/Components/post/Post";
import CreatePost from "@/Components/createPost/CreatePost";

const Content = ({user, initialPosts}) => {
    const [newStory, setNewStory] = useState("");
    const [posts, setPosts] = useState([]);

  const [mediaPreview, setMediaPreview] = useState(null);
 

  useEffect(() => {
    console.log('Initial posts:', initialPosts); 
    setPosts(initialPosts); 
}, [initialPosts]);

useEffect(() => {
  const channel = Echo.channel('likes.update')
      .listen('LikeCountUpdated', (e) => {
          setPosts((prevPosts) =>
              prevPosts.map((post) =>
                  post.id === e.postId ? { ...post, reactions_count: e.likeCount } : post
              )
          );
      });

  // return () => {
  //     channel.stopListening('LikeCountUpdated');
  // };
}, []);

    const handlePostSubmit = ()  => {
      if(newPost.content.trim() || newPost.media){
        const updatedPosts = [
          ...posts,
          {

          }
        ]
      }
    }

    useEffect(() => {
      console.log('user.id', user.id);
      const channel = Echo.private(`user-feed.${user.id}`)
          .listen('PostCreated', (e) => {
              console.log('New post by a friend:', e.post);
              setPosts((prevPosts) => [e.post, ...prevPosts]); 
          });
      Echo.private(`post-comments.${user.id}`)
      .listen('CommentPosted', (e => {
        console.log('comment posted', e);

      }))
  }, [user.id]);
    return (
        
        <>
           
           <div className="col-span-6">
           <CreatePost/>
             {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post.id} post={post}/>
                    ))
                ) : (
                   <></>
                )}
               </div>

        </>
    );
};

export default Content;
