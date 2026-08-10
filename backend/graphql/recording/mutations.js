export const mutations = `#graphql
    createRecording(name: String!): Recording
    editRecording(_id: String!, status: String, guestName: String): Recording
`