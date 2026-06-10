import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { uploadProfileImageToS3 } from "../lib/s3";

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
      createdAt: true,
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

export async function updateProfileImage(req: Request, res: Response) {
    const dbUser = (req as any).dbUser;

    if (!req.file) {
        return res.status(400).json({
            message: "No image uploaded",
        });
    }

    const { imageUrl } = await uploadProfileImageToS3(
        req.file,
        dbUser.id
    );

    const user = await prisma.user.update({
        where: {
            id: dbUser.id,
        },
        data: {
            imageUrl,
        },
        select: {
            id: true,
            username: true,
            imageUrl: true,
        },
    });

    res.json({ user });
}