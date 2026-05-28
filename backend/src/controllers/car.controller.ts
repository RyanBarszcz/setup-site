import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getCars(req: Request, res: Response) {
    try {
        const { gameId, trackId, gameSlug, trackSlug, search } = req.query;

        const cars = await prisma.car.findMany({
            where: {
                ...(gameId ? { gameId: String(gameId) } : {}),

                ...(gameSlug
                    ? {
                          game: {
                              slug: String(gameSlug),
                          },
                      }
                    : {}),

                ...(trackId || trackSlug
                    ? {
                          setups: {
                              some: {
                                  ...(trackId
                                      ? { trackId: String(trackId) }
                                      : {}),

                                  ...(trackSlug
                                      ? {
                                            track: {
                                                slug: String(trackSlug),
                                            },
                                        }
                                      : {}),

                                  ...(gameId
                                      ? { gameId: String(gameId) }
                                      : {}),

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
                          OR: [
                              {
                                  name: {
                                      contains: String(search),
                                      mode: "insensitive",
                                  },
                              },
                              {
                                  manufacturer: {
                                      contains: String(search),
                                      mode: "insensitive",
                                  },
                              },
                              {
                                  class: {
                                      contains: String(search),
                                      mode: "insensitive",
                                  },
                              },
                          ],
                      }
                    : {}),
            },

            orderBy: {
                name: "asc",
            },

            include: {
                game: true,

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

                        ...(trackId ? { trackId: String(trackId) } : {}),

                        ...(trackSlug
                            ? {
                                  track: {
                                      slug: String(trackSlug),
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

        const formattedCars = cars.map((car) => ({
            id: car.id,
            name: car.name,
            slug: car.slug,
            imageUrl: car.imageUrl,
            manufacturer: car.manufacturer,
            class: car.class,
            setupCount: car.setups.length,
        }));

        return res.json({
            cars: formattedCars,
        });
    } catch (error) {
        console.error("Get cars error:", error);

        return res.status(500).json({
            message: "Failed to fetch cars",
        });
    }
}