import PodcastService from "../../services/podcast.js";

const nested = {
    Podcast: async (recording) => {
        return await PodcastService.getPodcast(recording.podcastId);
    }
}

const queries = {
    getCurrentUser: async (_, payload, context) => {
        if(!context.user) throw new Error("Not authenticated");
        return context.user;
    }
};

export const resolvers = { queries, nested };