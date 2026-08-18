import { clerkClient } from "@clerk/express";
import User from "../models/user.model.js";

const graphqlContext = async (req, res) => {
    try {
        const clerkId = req.auth().userId;

        if (!clerkId) {
            return { user: null }
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            try {
                const clerkUser = await clerkClient.users.getUser(clerkId);
                const email = clerkUser.emailAddresses[0]?.emailAddress || "";
                const fullname =
                    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User";

                user = await User.create({
                    clerkId,
                    email,
                    fullname,
                });
            } catch (err) {
                throw new Error("Failed to sync Clerk user to DB: -> " + err.message)
                return { user: null }
            }
        }

        return { user }
    } catch (error) {
        throw new Error(error.message)
        return { user: null }
    }
};

export default graphqlContext;
