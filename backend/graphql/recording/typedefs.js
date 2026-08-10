export const typedefs = `#graphql
    enum Status {
        UPLOADING
        PROCESSING
        COMPLETED
        FAILED
    }
    
    type Recording {
        _id: ID!
        guestName: String
        joinedAt: String
        leftAt: String
        videoFileLink: String
        audioFileLink: String
        thumbnail: String
        podcastId: String
        podcast: Podcast
        status: Status
    }
`;
