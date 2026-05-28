import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getTracks(req: Request, res: Response) {
    try {
        const { gameId, gameSlug, carId, search } = req.query;

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

                ...(gameSlug
                    ? {
                          games: {
                              some: {
                                  game: {
                                      slug: String(gameSlug),
                                  },
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
                                  ...(gameSlug
                                      ? {
                                            game: {
                                                slug: String(gameSlug),
                                            },
                                        }
                                      : {}),
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

                setups: {
                    where: {
                        ...(gameId ? { gameId: String(gameId) } : {}),
                        ...(gameSlug
                            ? {
                                  game: {
                                      slug: String(gameSlug),
                                  },
                              }
                            : {}),
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

        const formattedTracks = tracks.map((track) => ({
            id: track.id,
            name: track.name,
            slug: track.slug,
            imageUrl: track.imageUrl,
            setupCount: track.setups.length,
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