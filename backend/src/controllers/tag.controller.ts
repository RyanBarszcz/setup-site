import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getTags(_req: Request, res: Response) {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: [
                {
                    category: "asc",
                },
                {
                    name: "asc",
                },
            ],
        });

        res.json(tags);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch tags",
        });
    }
}