import { ApolloServer } from "@apollo/server";
import { Podcast } from "./podcast/index.ts"
import { Recording } from "./recording/index.ts"

async function createGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${Podcast.typedefs}
            ${Recording.typedefs}

            type Query {
                ${Podcast.queries}
                ${Recording.queries}
            }

            type Mutation { 
                ${Podcast.mutations}
                ${Recording.mutations}
            }
        `,
        resolvers: {
            Podcast: {
                ...Podcast.resolvers.nested,
            },
            Recording: {
                ...Recording.resolvers.nested,
            },

            Query: { 
                ...Podcast.resolvers.queries,
                ...Recording.resolvers.queries
            },
            Mutation: {
                ...Podcast.resolvers.mutations,
                ...Recording.resolvers.mutations
            }
        },
        introspection: true
    });

    await gqlServer.start();

    return gqlServer;
}

export default createGraphqlServer;