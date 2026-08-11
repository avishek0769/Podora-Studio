import PodcastService from "../../services/podcast.js";
import RecordingService from "../../services/recording.js";
import UserService from "../../services/user.js";

// Nested field resolvers for the Podcast type
const nested = {
    host: async (podcast) => {
        return await UserService.getUserById(podcast.hostId);
    },
    recordings: async (podcast) => {
        return await RecordingService.getRecordingsByPodcast(podcast._id);
    },
};

const queries = {
    getPodcasts: async (_, _payload, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return await PodcastService.getPodcasts(context.user._id);
    },
    getPodcast: async (_, { podcastId }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return await PodcastService.getPodcast(podcastId);
    },
    getSignedUrl: async (_, { podcastId }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return await PodcastService.getSignedUrl(podcastId);
    },
    getTimeline: async (_, { podcastId }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return await PodcastService.getTimeline(podcastId);
    },
};

const mutations = {
    createPodcast: async (_, { name }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return await PodcastService.createPodcast(name, context.user._id);
    },
    editPodcast: async (_, { _id, recordingId, isLive, name, endTime }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        const podcast = await PodcastService.getPodcast(_id);
        if (!podcast) throw new Error("Podcast not found");
        if (String(podcast.hostId) !== String(context.user._id)) {
            throw new Error("Not authorized: you are not the host of this podcast");
        }
        return await PodcastService.editPodcast(_id, { recordingId, isLive, name, endTime });
    },
    deletePodcast: async (_, { _id }, context) => {
        if (!context.user) throw new Error("Not authenticated");
        const podcast = await PodcastService.getPodcast(_id);
        if (!podcast) throw new Error("Podcast not found");
        if (String(podcast.hostId) !== String(context.user._id)) {
            throw new Error("Not authorized: you are not the host of this podcast");
        }
        return await PodcastService.deletePodcast(_id);
    },
};

export const resolvers = { queries, mutations, nested };