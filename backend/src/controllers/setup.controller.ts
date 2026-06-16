import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { deleteSetupFileFromS3, getSetupFileDownloadUrl, uploadSetupFileToS3 } from "../lib/s3";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function getSetups(req: Request, res: Response) {
    try {
        const dbUser = (req as any).dbUser;
        const userId = dbUser?.id;

        const {
            search,
            gameId,
            trackId,
            carId,
            gameSlug,
            trackSlug,
            carSlug,
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

            ...(gameSlug
                ? {
                      game: {
                          slug: String(gameSlug),
                      },
                  }
                : {}),

            ...(trackSlug
                ? {
                      track: {
                          slug: String(trackSlug),
                      },
                  }
                : {}),

            ...(carSlug
                ? {
                      car: {
                          slug: String(carSlug),
                      },
                  }
                : {}),

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
                            imageUrl: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    votes: userId
                        ? {
                              where: {
                                  userId,
                              },
                              select: {
                                  id: true,
                              },
                          }
                        : false,
                },
            }),

            prisma.setup.count({
                where,
            }),
        ]);

        return res.json({
            data: setups.map((setup) => ({
                ...setup,
                hasUpvoted: userId ? setup.votes.length > 0 : false,
                isOwner: userId ? setup.userId === userId : false,
                votes: undefined,
            })),
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                totalCount,
                totalPages: Math.ceil(totalCount / limitNumber),
            },
        });
    } catch (error) {
        console.error("Get setups error:", error);

        return res.status(500).json({
            message: "Failed to fetch setups",
        });
    }
}

export async function getMySetups(req: Request, res: Response) {
    try {
        const dbUser = (req as any).dbUser;

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

export async function getSetupById(req: Request, res: Response) {
    const setupId = String(req.params.setupId);

    const dbUser = (req as any).dbUser;
    const userId = dbUser?.id;

    const setup = await prisma.setup.findUnique({
        where: { id: setupId },
        include: {
            game: true,
            track: true,
            car: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    imageUrl: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            votes: userId
                ? {
                      where: {
                          userId,
                      },
                      select: {
                          id: true,
                      },
                  }
                : false,
        },
    });

    if (!setup) {
        return res.status(404).json({ message: "Setup not found" });
    }

    res.json({
        setup: {
            ...setup,
            isOwner: userId ? setup.userId === userId : false,
            hasUpvoted: userId ? setup.votes.length > 0 : false,
        },
    });
}

export async function getSetupForEdit(req: Request, res: Response) {
  const setupId = String(req.params.setupId);
  const dbUser = (req as any).dbUser;
  const userId = dbUser?.id;

  const setup = await prisma.setup.findUnique({
    where: { id: setupId },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!setup) {
    return res.status(404).json({ message: "Setup not found" });
  }

  if (setup.userId !== userId) {
    return res.status(403).json({ message: "Not allowed to edit this setup" });
  }

  res.json({
    setup: {
      ...setup,
      tags: setup.tags.map((item) => item.tag.name),
    },
  });
}

// TODO: Needs to handle a new file upload
export async function updateSetup(req: Request, res: Response) {
  const setupId = String(req.params.setupId);
  const dbUser = (req as any).dbUser;
  const userId = dbUser?.id;

  const existingSetup = await prisma.setup.findUnique({
    where: { id: setupId },
  });

  if (!existingSetup) {
    return res.status(404).json({ message: "Setup not found" });
  }

  if (existingSetup.userId !== userId) {
    return res.status(403).json({ message: "Not allowed to edit this setup" });
  }

  const {
    gameId,
    trackId,
    carId,
    title,
    setupType,
    weatherType,
    visibility,
    trackCondition,
    temperatureF,
    lapTimeMs,
    fuelLoad,
    tireCompound,
    description,
    tags,
  } = req.body;

  const parsedTags: string[] = tags ? JSON.parse(tags) : [];

  const updatedSetup = await prisma.$transaction(async (tx) => {
    await tx.setupTag.deleteMany({
      where: {
        setupId,
      },
    });

    const updated = await tx.setup.update({
      where: {
        id: setupId,
      },
      data: {
        gameId,
        trackId,
        carId,
        title,
        setupType,
        weatherType,
        visibility,
        trackCondition: trackCondition || null,
        temperatureF: temperatureF ? Number(temperatureF) : null,
        lapTimeMs: lapTimeMs ? Number(lapTimeMs) : null,
        fuelLoad: fuelLoad || null,
        tireCompound: tireCompound || null,
        description: description || null,

        // only update file if user uploads a new one
        ...(req.file
          ? {
              fileName: req.file.originalname,
              fileSize: req.file.size,
              fileMimeType: req.file.mimetype,
              // fileUrl: uploadedUrlFromS3,
            }
          : {}),
      },
    });

    for (const tagName of parsedTags) {
      const tag = await tx.tag.upsert({
        where: {
          name: tagName,
        },
        update: {},
        create: {
          name: tagName,
          slug: slugify(tagName),
        },
      });

      await tx.setupTag.create({
        data: {
          setupId,
          tagId: tag.id,
        },
      });
    }

    return updated;
  });

  res.json({
    message: "Setup updated successfully",
    setup: updatedSetup,
  });
}

export async function toggleVote(req: Request, res: Response) {
    const setupId = String(req.params.setupId);
    const userId = (req as any).dbUser.id;

    const setup = await prisma.setup.findUnique({
        where: { id: setupId },
    });

    if (!setup) {
        return res.status(404).json({
            message: "Setup not found",
        });
    }

    if (setup.userId === userId) {
        return res.status(400).json({
            message: "Cannot vote on your own setup",
        });
    }

    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_setupId: {
                userId,
                setupId,
            },
        },
    });

    if (existingVote) {
        const [, updatedSetup] = await prisma.$transaction([
            prisma.vote.delete({
                where: {
                    userId_setupId: {
                        userId,
                        setupId,
                    },
                },
            }),
            prisma.setup.update({
                where: { id: setupId },
                data: {
                    upvoteCount: {
                        decrement: 1,
                    },
                },
            }),
        ]);

        return res.json({
            hasUpvoted: false,
            upvoteCount: updatedSetup.upvoteCount,
        });
    }

    const [, updatedSetup] = await prisma.$transaction([
        prisma.vote.create({
            data: {
                userId,
                setupId,
            },
        }),
        prisma.setup.update({
            where: { id: setupId },
            data: {
                upvoteCount: {
                    increment: 1,
                },
            },
        }),
    ]);

    res.json({
        hasUpvoted: true,
        upvoteCount: updatedSetup.upvoteCount,
    });
}

export async function handleDownload(req: Request, res: Response) {
    const setupId = String(req.params.setupId);

    const setup = await prisma.setup.findUnique({
        where: {
            id: setupId,
        },
    });

    if (!setup) {
        return res.status(404).json({
            message: "Setup not found",
        });
    }

    await prisma.setup.update({
        where: {
            id: setup.id,
        },
        data: {
            downloadCount: {
                increment: 1,
            },
        },
    });

    const downloadUrl = await getSetupFileDownloadUrl(
        setup.fileKey,
        setup.fileName
    );

    res.json({
        downloadUrl,
    });
}

// TODO: Later add delete from S3
export async function deleteSetup(req: Request, res: Response) {
    const setupId = String(req.params.setupId);
    const dbUser = (req as any).dbUser;
    const userId = dbUser?.id;

    const existingSetup = await prisma.setup.findUnique({
        where: {
            id: setupId,
        },
    });

    if (!existingSetup) {
        return res.status(404).json({ message: "Setup not found" });
    }

    if (existingSetup.userId !== userId) {
        return res.status(403).json({ message: "Not allowed to delete this setup" });
    }

    await prisma.setup.delete({
        where: {
            id: setupId,
        },
    });

    res.json({
        message: "Setup deleted successfully",
    });
}