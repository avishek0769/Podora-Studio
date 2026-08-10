import PodcastService from "../../services/podcast.js";
import UserService from "../../services/user.js";

const nested = {
    User: async (podcast) => {
        return await User.getUserById(podcast.hostID);
    },
    Recording: async (podcast) => {
        
    },
}

const queries = {
    getPodcasts: async (_, payload, context) => {
        if(!context.user) throw new Error("Not authenticated");

        const podcasts = await PodcastService.getPodcasts(context._id);
        return podcasts;
    },
};

const mutations = {
    createPodcast: async (_, payload) => {
        const podcast = await PodcastService.createPodcast(payload);
        return podcast;
    },
};

export const resolvers = { queries, mutations, nested };