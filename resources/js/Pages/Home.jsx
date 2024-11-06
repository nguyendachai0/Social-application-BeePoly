import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import Content from "@/Components/app/content/Content";
import Layout from "@/Layouts/Layout"; 

const Home = ({ auth }) => {
    const [posts, setPosts] = useState([]);
    const page = usePage();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/posts');
                const data = await response.json();
                console.log(data);
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Content user={auth?.user} posts={posts} />
    );
};

Home.layout = (page) => (
    <Layout>{page}</Layout>
);

export default Home;
