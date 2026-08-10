export const mutations = `#graphql
    createPodcast(name: String!): Podcast
    editPodcast(_id: String!): Podcast
    deletePodcast(_id: String!): Podcast
`