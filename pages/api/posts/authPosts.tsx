// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    // fetch all posts by user
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: "Email not found" });
      }

      const data = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        include: {
          Post: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              Comment: true,
            },
          },
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}
// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }
