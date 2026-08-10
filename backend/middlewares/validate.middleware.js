import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const fieldErrors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            const messages = fieldErrors.map((e) => `${e.field}: ${e.message}`);
            throw new ApiError(400, `Validation failed: ${messages.join("; ")}`, fieldErrors);
        }

        Object.defineProperty(req, "body", {
            value: result.data,
            writable: true,
            configurable: true,
            enumerable: true,
        });
        
        next();
    } catch (error) {
        throw new ApiError(
            400,
            JSON.parse(error.message)
                .map((err) => err.message)
                .join(", "),
        );
    }
};

export { validate };
