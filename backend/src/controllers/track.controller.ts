import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getTracks(req: Request, res: Response) {
    try {
        const { gameId, carId, search } = req.query;

        const tracks = await prisma.track.findMany({
            where: {
                ...(gameId
                    ? {
                          games: {
                              some: {
                                  gameId: String(gameId),
                              },
                          },
                      }
                    : {}),

                ...(carId
                    ? {
                          setups: {
                              some: {
                                  carId: String(carId),
                                  ...(gameId ? { gameId: String(gameId) } : {}),
                              },
                          },
                      }
                    : {}),

                ...(search
                    ? {
                          name: {
                              contains: String(search),
                              mode: "insensitive",
                          },
                      }
                    : {}),
            },
            orderBy: {
                name: "asc",
            },
            include: {
                games: {
                    include: {
                        game: true,
                    },
                },
                _count: {
                    select: {
                        setups: true,
                    },
                },
            },
        });

        const formattedTracks = tracks.map((track) => ({
            id: track.id,
            name: track.name,
            imageUrl: track.imageUrl,
            setupCount: track._count.setups,
            games: track.games,
        }));

        return res.json({
            tracks: formattedTracks,
        });
    } catch (error) {
        console.error("Get tracks error:", error);

        return res.status(500).json({
            message: "Failed to fetch tracks",
        });
    }
}