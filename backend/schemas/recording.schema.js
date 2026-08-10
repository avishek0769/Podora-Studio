import { z } from "zod";

const createRecordingSchema = z.object({
    guestName: z.string().min(1, "Name must be at least 1 char"),
});

export { createRecordingSchema };