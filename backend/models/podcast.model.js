import mongoose, { Schema, model } from "mongoose";

const podcastSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    hostId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    recordings: [{
        type: mongoose.Schema.ObjectId,
        ref: "RecordingSession"
    }],
    isLive: {
        type: Boolean,
        default: true
    }
});

const Podcast = model("Podcast", podcastSchema);

export default Podcast;