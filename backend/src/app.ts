import express from "express";
import cors from "cors";

import gameRoutes from "./routes/game.routes";
import trackRoutes from "./routes/track.routes";
import carRoutes from "./routes/car.routes";
import tagRoutes from "./routes/tag.routes";
import setupRoutes from "./routes/setup.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "SetupsRus API running",
    });
});

app.use("/games", gameRoutes);
app.use("/tracks", trackRoutes);
app.use("/cars", carRoutes);
app.use("/tags", tagRoutes);
app.use("/setups", setupRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;