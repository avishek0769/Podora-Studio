export type PodcastStatus = "waiting" | "recording" | "uploading" | "processing" | "completed" | "failed";

export type Podcast = {
    id: string;
    name: string;
    status: PodcastStatus;
    startTime: string | null;
    endTime: string | null;
    recordingCount: number;
};

export type ParticipantStatus = PodcastStatus;

export type RoomParticipant = {
    name: string;
    recordingState: ParticipantStatus;
    cameraLabel: string;
};

export type PodcastRoom = {
    podcastId: string;
    podcastName: string;
    roomStatus: PodcastStatus;
    creatorName: string;
    inviteLink: string;
    participants: RoomParticipant[];
};

export type RecordingSession = {
    participantName: string;
    recordingStatus: PodcastStatus;
    startedAt: string;
    endedAt: string | null;
    processedVideo: string;
    processedAudio: string;
    thumbnail: string;
};

export type PodcastDetails = {
    podcast: Podcast;
    creatorName: string;
    inviteLink: string;
    participantRecordingSessions: RecordingSession[];
};

export const podcasts: Podcast[] = [
    {
        id: "pod-001",
        name: "Remote Conversations",
        status: "completed",
        startTime: "Aug 08, 2026 09:00",
        endTime: "Aug 08, 2026 10:08",
        recordingCount: 3,
    },
    {
        id: "pod-002",
        name: "Creator Interview Night",
        status: "processing",
        startTime: "Aug 08, 2026 12:30",
        endTime: "Aug 08, 2026 13:16",
        recordingCount: 2,
    },
    {
        id: "pod-003",
        name: "Studio Launch Session",
        status: "recording",
        startTime: "Aug 08, 2026 15:00",
        endTime: null,
        recordingCount: 4,
    },
    {
        id: "pod-004",
        name: "Weekend Creator Panel",
        status: "failed",
        startTime: "Aug 07, 2026 18:00",
        endTime: "Aug 07, 2026 18:22",
        recordingCount: 2,
    },
];

export const currentRoom: PodcastRoom = {
    podcastId: "pod-003",
    podcastName: "Studio Launch Session",
    roomStatus: "recording",
    creatorName: "Maya Chen",
    inviteLink: "/join/live/pod-003",
    participants: [
        { name: "Maya Chen", recordingState: "recording", cameraLabel: "Host camera" },
        { name: "Ari Foster", recordingState: "uploading", cameraLabel: "Guest camera" },
        { name: "Noah Kim", recordingState: "waiting", cameraLabel: "Guest camera" },
    ],
};

export const podcastDetails: Record<string, PodcastDetails> = {
    "pod-001": {
        podcast: podcasts[0],
        creatorName: "Maya Chen",
        inviteLink: "/join/live/pod-001",
        participantRecordingSessions: [
            {
                participantName: "Maya Chen",
                recordingStatus: "completed",
                startedAt: "09:00",
                endedAt: "10:08",
                processedVideo: "Available",
                processedAudio: "Available",
                thumbnail: "Host frame",
            },
            {
                participantName: "Ari Foster",
                recordingStatus: "completed",
                startedAt: "09:02",
                endedAt: "10:08",
                processedVideo: "Available",
                processedAudio: "Available",
                thumbnail: "Guest frame",
            },
            {
                participantName: "Noah Kim",
                recordingStatus: "completed",
                startedAt: "09:10",
                endedAt: "10:08",
                processedVideo: "Available",
                processedAudio: "Available",
                thumbnail: "Guest frame",
            },
        ],
    },
    "pod-002": {
        podcast: podcasts[1],
        creatorName: "Maya Chen",
        inviteLink: "/join/live/pod-002",
        participantRecordingSessions: [
            {
                participantName: "Maya Chen",
                recordingStatus: "processing",
                startedAt: "12:30",
                endedAt: "13:16",
                processedVideo: "Processing",
                processedAudio: "Processing",
                thumbnail: "Host frame",
            },
            {
                participantName: "Ari Foster",
                recordingStatus: "processing",
                startedAt: "12:31",
                endedAt: "13:16",
                processedVideo: "Processing",
                processedAudio: "Processing",
                thumbnail: "Guest frame",
            },
        ],
    },
    "pod-003": {
        podcast: podcasts[2],
        creatorName: "Maya Chen",
        inviteLink: "/join/live/pod-003",
        participantRecordingSessions: [
            {
                participantName: "Maya Chen",
                recordingStatus: "recording",
                startedAt: "15:00",
                endedAt: null,
                processedVideo: "Pending",
                processedAudio: "Pending",
                thumbnail: "Live host frame",
            },
            {
                participantName: "Ari Foster",
                recordingStatus: "uploading",
                startedAt: "15:02",
                endedAt: null,
                processedVideo: "Pending",
                processedAudio: "Pending",
                thumbnail: "Live guest frame",
            },
            {
                participantName: "Noah Kim",
                recordingStatus: "waiting",
                startedAt: "15:08",
                endedAt: null,
                processedVideo: "Pending",
                processedAudio: "Pending",
                thumbnail: "Queued frame",
            },
        ],
    },
    "pod-004": {
        podcast: podcasts[3],
        creatorName: "Maya Chen",
        inviteLink: "/join/live/pod-004",
        participantRecordingSessions: [
            {
                participantName: "Maya Chen",
                recordingStatus: "failed",
                startedAt: "18:00",
                endedAt: "18:22",
                processedVideo: "Failed",
                processedAudio: "Failed",
                thumbnail: "Unavailable",
            },
            {
                participantName: "Ari Foster",
                recordingStatus: "failed",
                startedAt: "18:01",
                endedAt: "18:22",
                processedVideo: "Failed",
                processedAudio: "Failed",
                thumbnail: "Unavailable",
            },
        ],
    },
};
