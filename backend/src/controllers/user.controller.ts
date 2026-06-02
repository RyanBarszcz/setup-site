import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function searchUsers(req: Request, res: Response) {
  const q = String(req.query.q || "").trim();

  if (!q) {
    return res.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
        username: {
            contains: q,
            mode: "insensitive",
        },
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

export async function getUserProfile(req: Request, res: Response) {
  const username = String(req.params.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      imageUrl: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const setups = await prisma.setup.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      game: {
        select: {
          name: true,
        },
      },
      car: {
        select: {
          name: true,
        },
      },
      track: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    user,
    setups,
  });
}