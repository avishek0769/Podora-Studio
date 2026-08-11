export const mutations = `#graphql
    createRecording(guestName: String!, podcastId: String!): Recording
    editRecording(_id: String!, status: String, guestName: String, leftAt: String, videoFileLink: String, audioFileLink: String, thumbnail: String): Recording
`