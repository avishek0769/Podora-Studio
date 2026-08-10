import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createRecordingSession } from "../controllers/recording.controller.js";
import { createRecordingSchema } from "../schemas/recording.schema.js";

const recordingRouter = Router();

recordingRouter.route("/create").post(validate(createRecordingSchema), createRecordingSession);
recordingRouter.route("/status").patch();
recordingRouter.route("/:recordingId/download/video").get();
recordingRouter.route("/:recordingId/download/audio").get();
recordingRouter.route("/:recordingId").patch();

export default recordingRouter;
