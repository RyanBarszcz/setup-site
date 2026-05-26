import type { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import prisma from "../lib/prisma";

export async function syncAccount(
    req: Request,
    res: Response
) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const clerkUser =
            await clerkClient.users.getUser(userId);

        const username =
            clerkUser.username ||
            `user_${userId.slice(-6)}`;

        const email =
            clerkUser.emailAddresses[0]?.emailAddress ||
            "";

        const user = await prisma.user.upsert({
            where: {
                clerkId: userId,
            },
            update: {
                username,
                email,
                imageUrl: clerkUser.imageUrl,
            },
            create: {
                clerkId: userId,
                username,
                email,
                imageUrl: clerkUser.imageUrl,
            },
        });

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error("Sync account error:", error);

        return res.status(500).json({
            message: "Failed to sync account",
        });
    }
}
