import { clerkClient } from "@clerk/express";
import User from "../models/user.model";

const verifyStrictJWT = async (req, res, next) => {
    try {
        const clerkId = req.auth().userId;

        if (!clerkId) {
            return res.status(401).json({ message: "Unauthenticated" });
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
                console.error("Failed to automatically sync Clerk user to DB:", err);
                return res.status(500).json({ message: "Failed to sync user profile" });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Clerk auth error:", error);
        next(new Error("Authentication failed"));
    }
};

export { verifyStrictJWT };
