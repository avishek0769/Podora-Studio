export const mutations = `#graphql
    createPodcast(name: String!): Podcast
    editPodcast(_id: String!, recordingId: String, isLive: Boolean, name: String, endTime: String): Podcast
    deletePodcast(_id: String!): Podcast
`