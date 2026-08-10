import PodcastService from "../../services/podcast.js";

const nested = {
    Podcast: async (recording) => {
        return await PodcastService.getPodcast(recording.podcastId);
    }
}

const queries = {
    getVideoFile: async (_, payload, context) => {
        if(!context.user) throw new Error("Not authenticated");

        // const podcasts = await PodcastService.getPodcasts(context._id);
        // return podcasts;
    },
};

const mutations = {
    createRecording: async (_, payload) => {
        // const podcast = await PodcastService.createPodcast(payload);
        // return podcast;
    },
};

export const resolvers = { queries, mutations, nested };