import { useState } from "react";
import Content from "@/Components/UI/client/content/Content";
import Layout from "@/Layouts/Client/Layout"; 
import EditPostModal from "@/Components/UI/client/post/EditPostModal";
import { useEditPost } from "@/utils/hooks/useEditPost";

const Home = ({ auth, initialPosts }) => {
  console.log('auth', auth)
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
      } = useEditPost(setPosts);

    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             const response = await fetch('/posts');
    //             const data = await response.json();
    //             setPosts(data);
    //             console.log("Fetched data:", data);
    //         } catch (error) {
    //             console.error("Error fetching posts:", error);
    //         }
    //     };

    //     fetchPosts();
    // }, []);

    return (
        <div className="col-span-6">
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">       
        <Content user={auth?.user} posts={posts} handleEditPost={handleEditPost} setPosts={setPosts}/>
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
