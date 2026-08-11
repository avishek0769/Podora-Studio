import PodcastService from "../../services/podcast.js";

// Nested field resolvers for the User type
const nested = {
    podcasts: async (user) => {
        return await PodcastService.getPodcasts(user._id);
    },
};

const queries = {
    getCurrentUser: async (_, _payload, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return context.user;
    },
};

export const resolvers = { queries, nested };