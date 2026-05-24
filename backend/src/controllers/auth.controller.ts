import type { Request, Response } from "express";
import { clerkClient } from "@clerk/express";
import prisma from "../lib/prisma";

export async function register(req: Request, res: Response) {
    let clerkUserId: string | null = null;

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        const parts = name.trim().split(/\s+/);
        const firstName = parts[0];
        const lastName = parts.slice(1).join(" ");

        const clerkUser = await clerkClient.users.createUser({
            emailAddress: [email],
            password,
            firstName,
            lastName,
            publicMetadata: {
                role: "user",
            },
        });

        clerkUserId = clerkUser.id;

        const user = await prisma.user.create({
            data: {
                clerkId: clerkUser.id,
                name,
                email,
            },
        });

        return res.status(201).json({
            user,
        });
    } catch (error) {
        console.error("Register error:", error);

        if (clerkUserId) {
            try {
                await clerkClient.users.deleteUser(clerkUserId);
            } catch (rollbackError) {
                console.error("Failed to rollback Clerk user:", rollbackError);
            }
        }

        return res.status(500).json({
            message: "Failed to create account",
        });
    }
}