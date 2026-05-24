import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getCars(req: Request, res: Response) {
    try {
        const { gameId, trackId, search } = req.query;

        const cars = await prisma.car.findMany({
            where: {
                ...(gameId ? { gameId: String(gameId) } : {}),

                ...(trackId
                    ? {
                          setups: {
                              some: {
                                  trackId: String(trackId),
                                  ...(gameId ? { gameId: String(gameId) } : {}),
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
            },
        });

        res.json(cars);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch cars",
        });
    }
}