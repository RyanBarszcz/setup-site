import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { getAuth } from "@clerk/express";
import { deleteSetupFileFromS3, uploadSetupFileToS3 } from "../lib/s3";

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

export async function getMySetups(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);


        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const dbUser = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
        });

        if (!dbUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const setups = await prisma.setup.findMany({
            where: {
                userId: dbUser.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                game: true,
                track: true,
                car: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        res.json({
            data: setups,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch user setups",
        });
    }
}

export async function createSetup(req: Request, res: Response) {
    let uploadedFile:
        | {
              fileKey: string;
              fileUrl?: string | null;
              fileName: string;
              fileSize: number;
          }
        | null = null;

    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Setup file is required",
            });
        }

        const dbUser = (req as any).dbUser;

        if (!dbUser) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const {
            gameId,
            trackId,
            carId,
            title,
            description,
            setupType,
            weatherType,
            visibility,
            trackCondition,
            temperatureF,
            lapTimeMs,
            fuelLoad,
            tireCompound,
        } = req.body;

        if (!gameId || !trackId || !carId || !title || !setupType) {
            return res.status(400).json({
                message:
                    "gameId, trackId, carId, title, and setupType are required",
            });
        }

        const userId = dbUser.id;

        uploadedFile = await uploadSetupFileToS3(file, userId);

        const setup = await prisma.setup.create({
            data: {
                userId,
                gameId,
                trackId,
                carId,

                title,
                description: description || null,

                fileKey: uploadedFile.fileKey,
                fileUrl: uploadedFile.fileUrl || null,
                fileName: uploadedFile.fileName,
                fileSize: uploadedFile.fileSize,
                fileType: file.mimetype,

                lapTimeMs:
                    lapTimeMs === "" || lapTimeMs == null
                        ? null
                        : Number(lapTimeMs),

                setupType,
                weatherType: weatherType || "UNKNOWN",

                trackCondition: trackCondition || null,

                temperatureF:
                    temperatureF === "" || temperatureF == null
                        ? null
                        : Number(temperatureF),

                fuelLoad:
                    fuelLoad === "" || fuelLoad == null
                        ? null
                        : Number(fuelLoad),

                tireCompound: tireCompound || null,

                visibility: visibility || "PUBLIC",
            },

            include: {
                game: true,
                track: true,
                car: true,
                user: true,
            },
        });

        return res.status(201).json({
            setup,
        });
    } catch (error) {
        if (uploadedFile?.fileKey) {
            try {
                await deleteSetupFileFromS3(uploadedFile.fileKey);

                console.log(
                    "Rolled back uploaded S3 file:",
                    uploadedFile.fileKey
                );
            } catch (rollbackError) {
                console.error(
                    "Failed to rollback uploaded S3 file:",
                    rollbackError
                );
            }
        }

        console.error("Create setup error:", error);

        return res.status(500).json({
            message: "Failed to create setup",
        });
    }
}