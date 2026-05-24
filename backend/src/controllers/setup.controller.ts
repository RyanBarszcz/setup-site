import { Request, Response } from "express";

export async function getSetups(_req: Request, res: Response) {
    res.json({
        setups: [],
    });
}