import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getSetups(req: Request, res: Response) {
    try {
        const {
            search,
            gameId,
            trackId,
            carId,
            setupType,
            weatherType,
            tags,
            sort = "newest",
            page = "1",
            limit = "20",
        } = req.query;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
        const skip = (pageNumber - 1) * limitNumber;

        const tagSlugs =
            typeof tags === "string" && tags.length > 0
                ? tags.split(",").map((tag) => tag.trim())
                : [];

        const orderBy =
            sort === "most_downloaded"
                ? { downloadCount: "desc" as const }
                : sort === "most_upvoted"
                  ? { upvoteCount: "desc" as const }
                  : sort === "fastest_lap"
                    ? { lapTimeMs: "asc" as const }
                    : { createdAt: "desc" as const };

        const where = {
            ...(search
                ? {
                      OR: [
                          {
                              title: {
                                  contains: String(search),
                                  mode: "insensitive" as const,
                              },
                          },
                          {
                              description: {
                                  contains: String(search),
                                  mode: "insensitive" as const,
                              },
                          },
                      ],
                  }
                : {}),
            ...(gameId ? { gameId: String(gameId) } : {}),
            ...(trackId ? { trackId: String(trackId) } : {}),
            ...(carId ? { carId: String(carId) } : {}),
            ...(setupType ? { setupType: String(setupType) as any } : {}),
            ...(weatherType ? { weatherType: String(weatherType) as any } : {}),
            ...(tagSlugs.length > 0
                ? {
                      tags: {
                          some: {
                              tag: {
                                  slug: {
                                      in: tagSlugs,
                                  },
                              },
                          },
                      },
                  }
                : {}),
        };

        const [setups, totalCount] = await Promise.all([
            prisma.setup.findMany({
                where,
                skip,
                take: limitNumber,
                orderBy,
                include: {
                    game: true,
                    track: true,
                    car: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            imageUrl: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            }),
            prisma.setup.count({ where }),
        ]);

        res.json({
            data: setups,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                totalCount,
                totalPages: Math.ceil(totalCount / limitNumber),
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch setups",
        });
    }
}