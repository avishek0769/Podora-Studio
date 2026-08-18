export const mutations = `#graphql
    createRecording(guestName: String!, podcastId: String!): Recording
    editRecording(_id: String!, status: String, guestName: String, leftAt: String, thumbnail: String): Recording
`