import http from "http";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { expressMiddleware } from "@as-integrations/express5";
import createGraphqlServer from "./graphql/index.js";
import graphqlContext from "./utils/graphqlContext.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = Server(server);

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: process.env.CORS_METHODS,
        credentials: true,
    }),
);
app.use(express.json());
app.use(clerkMiddleware());

app.use(
    "/graphql",
    expressMiddleware(await createGraphqlServer(), {
        context: graphqlContext,
    }),
);

io.on("connection", (socket) => {
    console.log("Socket user connected", socket.id);
});

export { server, app };
