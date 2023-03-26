"use client";
import axios from "axios";
import AddPost from "./components/AddPost";
import { useQuery } from "@tanstack/react-query";
import Post from "./components/Post";
import { PostType } from "./types/Posts";
import { QueryObserverResult } from "@tanstack/react-query";

// Fetch all posts
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};
export type ApiResponse = {
  data: PostType[];
};

export default function Home() {
  const {
    data: postData,
    isLoading,
    isError,
  } = useQuery<ApiResponse, unknown>({
    queryKey: ["posts"],
    queryFn: allPosts,
  }) as QueryObserverResult<ApiResponse, unknown>;

  if (isLoading) return "Loading.....";
  if (isError) return isError;

  return (
    <main>
      <AddPost />
      {postData?.data?.map((post) => (
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
