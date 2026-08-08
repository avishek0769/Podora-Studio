export const authMiddleware = (req, res, next) => {
    const { clerkId } = req.auth || {};

    if (!clerkId) {
        return res.redirect(`${process.env.HOST}/sign-in`);
    }

    next();
};
