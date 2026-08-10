import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    clerkId: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    podcasts: [{
        type: mongoose.Schema.ObjectId,
        ref: "podcasts"
    }]
});

const User = model("User", userSchema);

export default User;