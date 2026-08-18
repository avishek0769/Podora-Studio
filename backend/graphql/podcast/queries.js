export const queries = `#graphql
    getPodcasts: [Podcast]
    getPodcast(podcastId: String!): Podcast
    getPublicPodcast(podcastId: String!): Podcast
    getSignedUrl(podcastId: String!): String
    getTimeline(podcastId: String!): Timeline
`