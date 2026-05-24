import { Request, Response } from "express";

export async function getGames(_req: Request, res: Response) {
    res.json({
        games: [],
    });
}