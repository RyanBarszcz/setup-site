import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getGames(_req: Request, res: Response) {
    try {
        const games = await prisma.game.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            }
        });

        res.json({games});
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch games",
        });
    }
}