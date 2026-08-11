import { ApolloServer } from "@apollo/server";
import { User } from "./user/index.js"
import { Podcast } from "./podcast/index.js"
import { Recording } from "./recording/index.js"

async function createGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${User.typedefs}
            ${Podcast.typedefs}
            ${Recording.typedefs}

            type Query {
                ${User.queries}
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
                ...User.resolvers.queries,
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