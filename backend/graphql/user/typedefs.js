export const typedefs = `#graphql
    type User {
        _id: ID!
        clerkId: String
        fullname: String
        email: String
        podcasts: [Podcast]
    }
`;
