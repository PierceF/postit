"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  let toastPostID: string;

  const queryClient = useQueryClient();

  // create a post
  const { mutate } = useMutation(
    async ({ title }: { title: string }) =>
      await axios.post("/api/posts/addPost", { title }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: toastPostID });
        }
        setIsDisabled(false);
      },
      onSuccess: (data) => {
        toast.success(`Post created ✨`, { id: toastPostID });
        setTitle("");
        setIsDisabled(false);
        // Invalidate the 'posts' query to refetch the data
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    toastPostID = toast.loading("Creating post...", { id: toastPostID });
    setIsDisabled(true);
    mutate({ title });
  };

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md">
      <div className="flex flex-col my-4">
        <textarea
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 h-20 my-2 bg-gray-200 rounded-xl border-none"
        ></textarea>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          className="text-sm bg-gray-700 text-white py-2 px-6 rounded-md disabled:opacity-25"
          type="submit"
        >
          Create a post
        </button>
      </div>
    </form>
  );
}
