import React, { useState } from "react";
import { useEffect } from "react";
import Post from "@/Components/UI/client/post/Post";
import CreatePost from "@/Components/UI/client/createPost/CreatePost";

const Content = ({user, posts, handleEditPost, setPosts}) => {


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

    useEffect(() => {
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
           <div className="col-span-6">
           <CreatePost setPosts={setPosts}/>
             {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post 
                        key={post.id} 
                        post={post} 
                        isOwnerPost={post.user_id === user.id}
                        handleEditPost={handleEditPost}
                        setPosts={setPosts}
                        />
                    ))
                ) : (
                   <></>
                )}
               </div>
                );
};

export default Content;
