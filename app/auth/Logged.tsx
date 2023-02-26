"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

type User = {
  image: string;
};

export default function Logged({ image }: User) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={image}
        width={40}
        height={40}
        className="rounded-full"
        alt={""}
      />
      <button
        onClick={() => signOut()}
        className="text-sm bg-gray-700 text-white py-2 px-6 rounded-md"
      >
        Sign Out
      </button>
    </div>
  );
}
