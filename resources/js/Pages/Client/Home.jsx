import { useState } from "react";
import Content from "@/Components/UI/client/content/Content";
import Layout from "@/Layouts/Client/Layout";
import EditPostModal from "@/Components/UI/client/post/EditPostModal";
import { useEditPost } from "@/utils/hooks/useEditPost";

const Home = ({ auth, initialPosts }) => {
  console.log(initialPosts);
  const [posts, setPosts] = useState(initialPosts);
  const {
    editPost,
    editCaption,
    editImages,
    setEditImages,
    setEditCaption,
    showEditModal,
    removeImage,
    setShowEditModal,
    handleEditPost,
    handleFileChange,
    handleUpdatePost,
    taggedFriends,
    friendsList,
    showFriendsList,
    setShowFriendsList,
    tagFriend,
    removeTag,
    visibilityOptions,
    setEditPost
  } = useEditPost(setPosts);

  return (
    <div className="col-span-6">
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <Content user={auth?.user} posts={posts} handleEditPost={handleEditPost} setPosts={setPosts} />
        {showEditModal && (
          <EditPostModal
            editCaption={editCaption}
            handleFileChange={handleFileChange}
            handleUpdatePost={handleUpdatePost}
            setEditCaption={setEditCaption}
            editPost={editPost}
            setShowEditModal={setShowEditModal}
            editImages={editImages}
            removeImage={removeImage}
            taggedFriends={taggedFriends}
            friendsList={friendsList}
            showFriendsList={showFriendsList}
            setShowFriendsList={setShowFriendsList}
            tagFriend={tagFriend}
            removeTag={removeTag}
            visibilityOptions={visibilityOptions}
            setEditPost={setEditPost}
          />
        )}
      </div>
    </div>
  );
};

Home.layout = (page) => (
  <Layout>{page}</Layout>
);

export default Home;
