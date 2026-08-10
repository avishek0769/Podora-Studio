export const typedefs = `#graphql
    type Podcast {
        _id: ID!
        name: String!
        startTime: String
        endTime: String
        hostId: String
        recordings: [Recording]
        isLive: Boolean
    }
`;