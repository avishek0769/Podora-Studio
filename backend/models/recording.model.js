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
        type: Date,
        default: Date.now
    },
    videoFileLink: {
        type: Date,
        default: Date.now
    },
    audioFileLink: {
        type: Date,
        default: Date.now
    },
    thumbnail: {
        type: Date,
        default: Date.now
    },
    podcastId: {
        type: mongoose.Schema.ObjectId,
        ref: "podcasts",
        required: true
    },
    status: {
        type: String,
        enum: ["UPLOADING", "PROCESSING", "COMPLETED", "FAILED"],
        default: "UPLOADING"
    }
});

const RecordingSession = model("User", recordingSchema);

export default RecordingSession;