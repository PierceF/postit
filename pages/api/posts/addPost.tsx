// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const userEmail = session.user?.email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email not found" });
    }

    const title: string = req.body.title;

    // Get User
    const prismaUser = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!prismaUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // check the title length
    if (title.length > 300)
      return res.status(400).json({ message: "Title too long bro!" });
    if (title.length < 1)
      return res.status(400).json({ message: "No empty titles bro!" });

    // create a post
    try {
      const post = await prisma.post.create({
        data: {
          title,
          userId: prismaUser.id,
        },
      });
      return res.status(200).json({ message: "Post created", post });
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }
