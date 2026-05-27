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
            },
        });

        res.json({tracks});
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch tracks",
        });
    }
}