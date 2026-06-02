import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function searchUsers(req: Request, res: Response) {
  const q = String(req.query.q || "").trim();

  if (!q) {
    return res.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: q,
            mode: "insensitive",
          },
        }
      ],
    },
    select: {
      id: true,
      username: true,
      imageUrl: true,
    },
    take: 8,
  });

  res.json({ users });
}