export const queries = `#graphql
    getVideoFile(recordingId: String!): String
    getAudioFile(recordingId: String!): String
    getRecordingUploadUrl(podcastId: String!, recordingId: String!, timestamp: String!): String
`