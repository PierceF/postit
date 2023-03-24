import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        return res.status(409).json({ error: "Email already exists" });
      }

      return res.status(200).json({ message: "Email is available" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
