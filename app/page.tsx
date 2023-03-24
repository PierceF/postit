"use client";
import axios from "axios";
import AddPost from "./components/AddPost";
import { useQuery } from "@tanstack/react-query";
import Post from "./components/Post";
import { PostType } from "./types/Posts";

// Fetch all posts
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, isLoading, isError } = useQuery<PostType>({
    queryKey: ["posts"],
    queryFn: allPosts,
  });
  if (isLoading) return "Loading.....";
  if (isError) return isError;
  // console.log(data);
  return (
    <main>
      <AddPost />
      {data?.data?.map((post) => (
        <Post
          comments={post.Comment}
          key={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          id={post.id}
        />
      ))}
    </main>
  );
}
