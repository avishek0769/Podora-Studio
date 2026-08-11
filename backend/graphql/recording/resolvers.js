import RecordingService from "../../services/recording.js";
import PodcastService from "../../services/podcast.js";

// Nested field resolvers for the Recording type
const nested = {
    podcast: async (recording) => {
        return await PodcastService.getPodcast(recording.podcastId);
    },
};

const queries = {
    getVideoFile: async (_, { recordingId }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return await RecordingService.getVideoFile(recordingId);
    },
    getAudioFile: async (_, { recordingId }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return await RecordingService.getAudioFile(recordingId);
    },
};

const mutations = {
    createRecording: async (_, { guestName, podcastId }) => {
        // Guests are unauthenticated — no context.user check here
        if (!guestName || !podcastId) throw new Error("guestName and podcastId are required");
        const podcast = await PodcastService.getPodcast(podcastId);
        if (!podcast) throw new Error("Podcast not found");
        if (!podcast.isLive) throw new Error("Podcast is not live");
        return await RecordingService.createRecording(guestName, podcastId);
    },
    editRecording: async (_, { _id, status, guestName, leftAt, videoFileLink, audioFileLink, thumbnail }) => {
        if (!_id) throw new Error("Recording ID is required");
        const recording = await RecordingService.getRecording(_id);
        if (!recording) throw new Error("Recording not found");
        return await RecordingService.editRecording(_id, {
            status,
            guestName,
            leftAt,
            videoFileLink,
            audioFileLink,
            thumbnail,
        });
    },
};

export const resolvers = { queries, mutations, nested };