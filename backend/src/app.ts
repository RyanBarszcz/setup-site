import express from "express";
import cors from "cors";

import gameRoutes from "./routes/game.routes";
import setupRoutes from "./routes/setup.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "SetupsRus API running",
    });
});

app.use("/games", gameRoutes);
app.use("/setups", setupRoutes);

export default app;