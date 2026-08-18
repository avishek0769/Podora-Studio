import { SERVER_ADDRESS } from "../constants";

const GQL_URL = `${SERVER_ADDRESS}/graphql`;

/**
 * Execute a GraphQL query or mutation.
 * @param query  - GraphQL query/mutation string
 * @param variables - Optional variables map
 * @param token  - Optional Clerk session token for authenticated requests
 */
export async function gql<T = any>(
    query: string,
    variables?: Record<string, any>,
    token?: string | null
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(GQL_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
    }

    return json.data as T;
}

// ─── Typed Query / Mutation Strings ───────────────────────────────────────────

export const GET_PODCASTS = `
    query GetPodcasts {
        getPodcasts {
            _id
            name
            isLive
            startTime
            endTime
            recordings {
                _id
            }
        }
    }
`;

export const GET_PODCAST = `
    query GetPodcast($podcastId: String!) {
        getPodcast(podcastId: $podcastId) {
            _id
            name
            isLive
            startTime
            endTime
            host {
                fullname
            }
            recordings {
                _id
                guestName
                joinedAt
                leftAt
                thumbnail
                status
            }
        }
    }
`;

export const GET_PUBLIC_PODCAST = `
    query GetPublicPodcast($podcastId: String!) {
        getPublicPodcast(podcastId: $podcastId) {
            _id
            name
            isLive
            host {
                fullname
            }
        }
    }
`;

export const CREATE_PODCAST = `
    mutation CreatePodcast($name: String!) {
        createPodcast(name: $name) {
            _id
            name
            isLive
        }
    }
`;

export const EDIT_PODCAST = `
    mutation EditPodcast($_id: String!, $isLive: Boolean, $endTime: String) {
        editPodcast(_id: $_id, isLive: $isLive, endTime: $endTime) {
            _id
            isLive
            endTime
        }
    }
`;

export const CREATE_RECORDING = `
    mutation CreateRecording($guestName: String!, $podcastId: String!) {
        createRecording(guestName: $guestName, podcastId: $podcastId) {
            _id
            guestName
            status
        }
    }
`;

export const EDIT_RECORDING = `
    mutation EditRecording($_id: String!, $status: String, $leftAt: String) {
        editRecording(_id: $_id, status: $status, leftAt: $leftAt) {
            _id
            status
            leftAt
        }
    }
`;

export const GET_RECORDING_UPLOAD_URL = `
    query GetRecordingUploadUrl($podcastId: String!, $recordingId: String!, $timestamp: String!) {
        getRecordingUploadUrl(podcastId: $podcastId, recordingId: $recordingId, timestamp: $timestamp)
    }
`;

export const GET_VIDEO_FILE = `
    query GetVideoFile($recordingId: String!) {
        getVideoFile(recordingId: $recordingId)
    }
`;

export const GET_AUDIO_FILE = `
    query GetAudioFile($recordingId: String!) {
        getAudioFile(recordingId: $recordingId)
    }
`;
