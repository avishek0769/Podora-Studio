import mongoose, { Schema, model } from "mongoose";

const recordingSchema = new Schema({
    guestName: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    leftAt: {
        type: Date
    },
    videoFileLink: {
        type: String
    },
    audioFileLink: {
        type: String
    },
    thumbnail: {
        type: String
    },
    podcastId: {
        type: mongoose.Schema.ObjectId,
        ref: "Podcast",
        required: true
    },
    status: {
        type: String,
        enum: ["UPLOADING", "PROCESSING", "COMPLETED", "FAILED"],
        default: "UPLOADING"
    }
});

const RecordingSession = model("RecordingSession", recordingSchema);

export default RecordingSession;