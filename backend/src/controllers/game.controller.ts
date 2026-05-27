import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getGames(_req: Request, res: Response) {
    try {
        const games = await prisma.game.findMany({
            orderBy: {
                name: "asc",
            },
            include: {
                _count: {
                    select: {
                        setups: true,
                    },
                },
            },
        });

        const formattedGames = games.map((game) => ({
            id: game.id,
            name: game.name,
            imageUrl: game.imageUrl,
            setupCount: game._count.setups,
        }));

        res.json({ games: formattedGames });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch games",
        });
    }
}

export async function getPopularGames(
    _req: Request,
    res: Response
) {
    try {
        const games = await prisma.game.findMany({
            include: {
                _count: {
                    select: {
                        setups: true,
                    },
                },
            },
        });

        const popularGames = games
            .filter((game) => game._count.setups > 0)
            .sort((a, b) => b._count.setups - a._count.setups)
            .slice(0, 3)
            .map((game) => ({
                id: game.id,
                name: game.name,
                imageUrl: game.imageUrl,
                setupCount: game._count.setups,
            }));

        return res.json({
            games: popularGames,
        });
    } catch (error) {
        console.error("Get popular games error:", error);

        return res.status(500).json({
            message: "Failed to fetch popular games",
        });
    }
}