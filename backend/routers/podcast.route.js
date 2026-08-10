import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createPodcast } from "../controllers/podcast.controller.js";
import { createPodcastSchema } from "../schemas/podcast.schema.js";

const podcastRouter = Router();

podcastRouter.route("/create").post(validate(createPodcastSchema), createPodcast);
podcastRouter.route("/list").get();
podcastRouter.route("/signed-url").get();
podcastRouter.route("/timeline").get();
podcastRouter.route("/:podcastId").get();
podcastRouter.route("/:podcastId").patch();
podcastRouter.route("/:podcastId").delete();

export default podcastRouter;
