import Podcast from "../models/podcast.model.js";
import User from "../models/user.model.js";
import RecordingSession from "../models/recording.model.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import ECSService from "./ecs.js";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

class PodcastService {
    static async getPodcasts(hostId) {
        return await Podcast.find({ hostId });
    }

    static async getPodcast(podcastId) {
        return await Podcast.findById(podcastId);
    }

    static async createPodcast(name, hostId) {
        const podcast = await Podcast.create({
            name,
            hostId,
            isLive: true,
            startTime: new Date().toISOString()
        });

        await User.findByIdAndUpdate(hostId, {
            $push: { podcasts: podcast._id }
        });

        return podcast;
    }

    static async editPodcast(id, { name, isLive, endTime, recordingId }) {
        const update = {};
        if (name !== undefined) update.name = name;
        if (isLive !== undefined) update.isLive = isLive;
        if (endTime !== undefined) update.endTime = endTime;

        const operations = {};
        if (Object.keys(update).length > 0) {
            operations.$set = update;
        }
        if (recordingId) {
            operations.$addToSet = { recordings: recordingId };
        }

        const updatedPodcast = await Podcast.findByIdAndUpdate(id, operations, { returnDocument: "after" });

        if (isLive === false) {
            try {
                // Update all active recording sessions for this podcast to PROCESSING
                await RecordingSession.updateMany(
                    { podcastId: id, status: "UPLOADING" },
                    { $set: { status: "PROCESSING" } }
                );
                console.log(`[PodcastService] Updated recording sessions for podcast ${id} to PROCESSING`);

                // Trigger the ECS merge task
                await ECSService.triggerMergeTask(id);
            } catch (err) {
                console.error("[PodcastService] Error running post-recording tasks:", err);
            }
        }

        return updatedPodcast;
    }

    static async deletePodcast(id) {
        const podcast = await Podcast.findByIdAndDelete(id);
        if (podcast) {
            await User.findByIdAndUpdate(podcast.hostId, {
                $pull: { podcasts: podcast._id }
            });
            await RecordingSession.deleteMany({ podcastId: id });
        }
        return podcast;
    }

    static async getSignedUrl(podcastId) {
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
        const key = `podcasts/${podcastId}/${filename}`;
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "podora.studio",
            Key: key,
        });

        return await getS3SignedUrl(s3Client, command, { expiresIn: 3600 });
    }

    static async getTimeline(podcastId) {
        const recordings = await RecordingSession.find({ podcastId }).sort({ joinedAt: 1 });
        const events = [];

        for (const rec of recordings) {
            if (rec.joinedAt) {
                events.push({
                    participantName: rec.guestName,
                    action: "JOINED",
                    timestamp: rec.joinedAt.toISOString()
                });
            }
            if (rec.leftAt) {
                events.push({
                    participantName: rec.guestName,
                    action: "LEFT",
                    timestamp: rec.leftAt.toISOString()
                });
            }
        }

        events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        return { events };
    }
}

export default PodcastService;