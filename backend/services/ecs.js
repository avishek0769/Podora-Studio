import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

class ECSService {
    static async triggerMergeTask(podcastId) {
        console.log(`[ECS] Triggering merge task for podcast: ${podcastId}`);
        const cluster = process.env.AWS_ECS_CLUSTER || "podora-cluster";
        const taskDefinition = process.env.AWS_ECS_TASK_DEFINITION || "podora-merge-task";
        const subnets = process.env.AWS_ECS_SUBNETS ? process.env.AWS_ECS_SUBNETS.split(",") : [];
        const securityGroups = process.env.AWS_ECS_SECURITY_GROUPS ? process.env.AWS_ECS_SECURITY_GROUPS.split(",") : [];

        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            console.warn("[ECS] AWS credentials missing. Skipping ECS task run.");
            return { success: false, message: "AWS credentials missing" };
        }

        try {
            const command = new RunTaskCommand({
                cluster,
                taskDefinition,
                launchType: "FARGATE",
                networkConfiguration: {
                    awsvpcConfiguration: {
                        subnets: subnets.length > 0 ? subnets : ["subnet-dummy"],
                        securityGroups: securityGroups.length > 0 ? securityGroups : ["sg-dummy"],
                        assignPublicIp: "ENABLED"
                    }
                },
                overrides: {
                    containerOverrides: [
                        {
                            name: "merge-container",
                            environment: [
                                {
                                    name: "PODCAST_ID",
                                    value: podcastId
                                },
                                {
                                    name: "AWS_S3_BUCKET_NAME",
                                    value: process.env.AWS_S3_BUCKET_NAME || "podora.studio"
                                }
                            ]
                        }
                    ]
                }
            });

            const response = await ecsClient.send(command);
            console.log("[ECS] Task run triggered successfully:", response);
            return { success: true, response };
        } catch (error) {
            console.error("[ECS] Failed to run merge task:", error.message);
            return { success: false, error: error.message };
        }
    }
}

export default ECSService;
