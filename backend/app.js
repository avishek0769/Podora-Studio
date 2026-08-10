import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    res.status(statusCode).json({ message });
};

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: process.env.CORS_METHODS,
        credentials: true,
    }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
import podcastRouter from "./routers/podcast.route.js";
app.use("/api/v1/podcast", podcastRouter);

import recordingRouter from "./routers/recording.route.js";
app.use("/api/v1/recording", recordingRouter);

app.use(errorHandler);

export { app };
