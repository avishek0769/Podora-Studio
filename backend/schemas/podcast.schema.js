import { z } from "zod";

const createPodcastSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 chars"),
});

export { createPodcastSchema };