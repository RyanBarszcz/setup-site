import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function attachUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const auth = (req as any).auth();

        if (!auth?.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const dbUser = await prisma.user.findUnique({
            where: {
                clerkId: auth.userId,
            },
        });

        if (!dbUser) {
            return res.status(403).json({
                message: "User account not synced. Please sign in again.",
            });
        }

        (req as any).dbUser = dbUser;

        // console.log("Attached DB user:", dbUser.id);

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to attach user" });
    }
}

export async function attachUserOptional(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    try {
        const auth = (req as any).auth();

        if (!auth?.userId) {
            return next();
        }

        const dbUser = await prisma.user.findUnique({
            where: {
                clerkId: auth.userId,
            },
        });

        if (dbUser) {
            (req as any).dbUser = dbUser;
        }

        // console.log("Attached DB user:", dbUser?.id);

        next();
    } catch (error) {
        console.error(error);
        next();
    }
}