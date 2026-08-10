import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const createRecordingSession = asyncHandler(async (req, res) => {
        
    res.status(200).json(
        new ApiResponse(
            200,
            { },
            "Recording Session created",
        ),
    );
});

export { createRecordingSession };
