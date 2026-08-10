import mongoose, { Schema, model } from "mongoose";

const podcastSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    },
    hostId: {
        type: mongoose.Schema.ObjectId,
        ref: "podcasts",
        required: true
    },
    recordings: [{
        type: mongoose.Schema.ObjectId,
        ref: "recordingSessions"
    }],
    isLive: {
        type: Boolean,
        default: true
    }
});

const Podcast = model("User", podcastSchema);

export default Podcast;