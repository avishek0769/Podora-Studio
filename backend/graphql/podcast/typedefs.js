export const typedefs = `#graphql
    type Podcast {
        _id: ID!
        name: String!
        startTime: String
        endTime: String
        hostId: String
        host: User
        recordings: [Recording]
        isLive: Boolean
    }

    type Timeline {
        
    }
`;