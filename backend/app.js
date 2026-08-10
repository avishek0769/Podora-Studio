import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { expressMiddleware } from "@as-integrations/express5";
import createGraphqlServer from "./graphql/index.js";
import graphqlContext from "./utils/graphqlContext.js";

const app = express();

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

export default app;
