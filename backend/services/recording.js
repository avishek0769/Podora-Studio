import RecordingSession from "../models/recording.model.js";
import Podcast from "../models/podcast.model.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

class RecordingService {
    static async createRecording(guestName, podcastId) {
        const recording = await RecordingSession.create({
            guestName,
            podcastId,
            joinedAt: new Date(),
            status: "UPLOADING"
        });

        // Add recording session reference to the podcast
        await Podcast.findByIdAndUpdate(podcastId, {
            $addToSet: { recordings: recording._id }
        });

        return recording;
    }

    static async editRecording(id, updates) {
        const cleanUpdates = {};
        if (updates.status !== undefined) cleanUpdates.status = updates.status;
        if (updates.guestName !== undefined) cleanUpdates.guestName = updates.guestName;
        if (updates.leftAt !== undefined) cleanUpdates.leftAt = updates.leftAt ? new Date(updates.leftAt) : null;
        if (updates.videoFileLink !== undefined) cleanUpdates.videoFileLink = updates.videoFileLink;
        if (updates.audioFileLink !== undefined) cleanUpdates.audioFileLink = updates.audioFileLink;
        if (updates.thumbnail !== undefined) cleanUpdates.thumbnail = updates.thumbnail;

        return await RecordingSession.findByIdAndUpdate(
            id,
            { $set: cleanUpdates },
            { new: true }
        );
    }

    static async getRecordingsByPodcast(podcastId) {
        return await RecordingSession.find({ podcastId });
    }

    static async getRecording(recordingId) {
        return await RecordingSession.findById(recordingId);
    }

    static async getVideoFile(recordingId) {
        const recording = await RecordingSession.findById(recordingId);
        if (!recording || !recording.videoFileLink) return null;

        if (recording.videoFileLink.startsWith("http://") || recording.videoFileLink.startsWith("https://")) {
            return recording.videoFileLink;
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "podora.studio",
            Key: recording.videoFileLink,
        });

        return await getS3SignedUrl(s3Client, command, { expiresIn: 3600 });
    }

    static async getAudioFile(recordingId) {
        const recording = await RecordingSession.findById(recordingId);
        if (!recording || !recording.audioFileLink) return null;

        if (recording.audioFileLink.startsWith("http://") || recording.audioFileLink.startsWith("https://")) {
            return recording.audioFileLink;
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "podora.studio",
            Key: recording.audioFileLink,
        });

        return await getS3SignedUrl(s3Client, command, { expiresIn: 3600 });
    }
}

export default RecordingService;