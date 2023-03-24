import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

type User = {
  id: number;
  email: string;
  // other fields
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: User[] } | { error: string }>
) {
  if (req.method === "GET") {
    // fetch all users
    try {
      const data = await prisma.user.findMany();
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(400).json({ error: "Error fetching users" });
    }
  } else if (req.method === "DELETE") {
    const id = Number(req.query.id);
    // delete user with given id
    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });
      return res.status(204).send("");
    } catch (error) {
      return res
        .status(400)
        .json({ error: `Error deleting user with id ${id}` });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
