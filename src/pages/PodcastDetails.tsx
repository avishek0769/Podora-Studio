import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { gql, GET_PODCAST, GET_VIDEO_FILE, GET_AUDIO_FILE } from "../lib/gql";

interface Recording {
    _id: string;
    guestName: string;
    joinedAt: string | null;
    leftAt: string | null;
    thumbnail: string | null;
    status: "UPLOADING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

interface Podcast {
    _id: string;
    name: string;
    isLive: boolean;
    startTime: string | null;
    endTime: string | null;
    host: { fullname: string } | null;
    recordings: Recording[];
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
    if (!iso) return null;
    try {
        return new Date(iso).toLocaleString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    } catch { return iso; }
}

function toMinutes(iso: string | null): number | null {
    if (!iso) return null;
    try {
        const d = new Date(iso);
        return d.getHours() * 60 + d.getMinutes();
    } catch { return null; }
}

function renderTimeLabel(minutes: number) {
    const hrs = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function statusLabel(s: Recording["status"]) {
    if (s === "UPLOADING") return "uploading";
    if (s === "PROCESSING") return "processing";
    if (s === "COMPLETED") return "completed";
    if (s === "FAILED") return "failed";
    return s;
}

// ─── Download button ──────────────────────────────────────────────────────────

function DownloadButton({ label, fetchUrl }: { label: string; fetchUrl: () => Promise<string | null> }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const url = await fetchUrl();
            if (url) {
                window.open(url, "_blank");
            } else {
                alert("File not available yet.");
            }
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const isVideo = label.toLowerCase().includes("video");

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                isVideo
                    ? "bg-white text-canvas hover:bg-zinc-200"
                    : "border border-hairline text-white hover:bg-white/5"
            }`}
        >
            {loading ? "Loading…" : label}
        </button>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

function PodcastDetails() {
    const { podcastId } = useParams<{ podcastId: string }>();
    const { getToken } = useAuth();

    const [podcast, setPodcast] = useState<Podcast | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!podcastId) return;
        (async () => {
            try {
                const token = await getToken();
                const data = await gql<{ getPodcast: Podcast }>(
                    GET_PODCAST,
                    { podcastId },
                    token
                );
                setPodcast(data.getPodcast);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [podcastId, getToken]);

    if (loading) {
        return (
            <PageShell title="Loading…" description="">
                <p className="text-xs text-zinc-500 font-mono text-center py-20">Fetching podcast details…</p>
            </PageShell>
        );
    }

    if (error || !podcast) {
        return (
            <PageShell title="Error" description="">
                <p className="text-xs text-rose-400 font-mono text-center py-20">{error || "Podcast not found."}</p>
            </PageShell>
        );
    }

    // ─── Timeline calculation ──────────────────────────────────────────────
    const startMin = toMinutes(podcast.startTime) ?? 0;
    let endMinRaw = toMinutes(podcast.endTime);

    if (!endMinRaw) {
        let maxSession = startMin + 30;
        podcast.recordings.forEach((r) => {
            const s = toMinutes(r.joinedAt);
            const e = toMinutes(r.leftAt);
            if (s && s > maxSession) maxSession = s;
            if (e && e > maxSession) maxSession = e;
        });
        endMinRaw = maxSession;
    }
    const endMin = endMinRaw;
    const duration = endMin - startMin || 1;

    const inviteLink = `${window.location.origin}/join/live/${podcast._id}`;

    return (
        <PageShell
            title={podcast.name}
            description="Access recording sessions, track real-time processing states, view invitation timelines, and export assets."
            actions={
                <>
                    <StatusPill status={podcast.isLive ? "live" : "completed"} />
                    <PrimaryButton href={`/live/${podcast._id}`}>Open Room</PrimaryButton>
                    <OutlineButton href="/dashboard">Dashboard</OutlineButton>
                </>
            }
        >
            {/* Timeline */}
            <Card className="p-6 mb-8">
                <div className="flex items-center justify-between border-b border-hairline/60 pb-4 mb-6">
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-body-mid">Visualization</p>
                        <h3 className="text-base font-bold text-white tracking-tight mt-1">Session Attendance Timeline</h3>
                    </div>
                    <span className="text-xs text-body-mid font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                        {duration} min total duration
                    </span>
                </div>

                <div className="relative mt-8">
                    <div className="absolute inset-0 flex justify-between pointer-events-none pl-32 pr-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="border-l border-dashed border-hairline/60 h-full" />
                        ))}
                    </div>

                    <div className="flex justify-between pl-32 pr-2 text-[10px] font-mono text-zinc-500 mb-6 select-none">
                        <span>{renderTimeLabel(startMin)}</span>
                        <span>{renderTimeLabel(startMin + Math.round(duration * 0.25))}</span>
                        <span>{renderTimeLabel(startMin + Math.round(duration * 0.5))}</span>
                        <span>{renderTimeLabel(startMin + Math.round(duration * 0.75))}</span>
                        <span>{renderTimeLabel(endMin)}</span>
                    </div>

                    <div className="space-y-4 relative">
                        {podcast.recordings.map((session, idx) => {
                            const sMin = toMinutes(session.joinedAt) ?? startMin;
                            const eMin = toMinutes(session.leftAt) ?? endMin;
                            const leftPercent = Math.max(0, Math.min(100, ((sMin - startMin) / duration) * 100));
                            const widthPercent = Math.max(1, Math.min(100 - leftPercent, ((eMin - sMin) / duration) * 100));

                            return (
                                <div key={idx} className="flex items-center min-h-[32px]">
                                    <div className="w-32 flex-shrink-0 pr-4">
                                        <span className="text-xs font-semibold text-zinc-300 truncate block">
                                            {session.guestName}
                                        </span>
                                    </div>
                                    <div className="flex-grow bg-zinc-900/30 border border-hairline/40 rounded-lg h-7 relative overflow-hidden">
                                        <div
                                            style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                                            className={`absolute h-full rounded-md border flex items-center px-3 transition-all ${
                                                session.status === "COMPLETED"
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                    : session.status === "UPLOADING"
                                                    ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
                                                    : session.status === "PROCESSING"
                                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                                    : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400"
                                            }`}
                                        >
                                            <span className="text-[9px] font-mono font-medium truncate select-none">
                                                {formatDate(session.joinedAt)} — {session.leftAt ? formatDate(session.leftAt) : "Active"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                {/* Podcast Metadata */}
                <Card className="p-6 self-start">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-body-mid border-b border-hairline pb-3 mb-4">Metadata</p>
                    <div className="space-y-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Podcast Name</span>
                            <span className="text-base font-semibold text-white mt-1 block">{podcast.name}</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Start</span>
                                <span className="text-xs font-mono font-medium text-white mt-1.5 block">{formatDate(podcast.startTime) ?? "Waiting"}</span>
                            </div>
                            <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">End</span>
                                <span className="text-xs font-mono font-medium text-white mt-1.5 block">{formatDate(podcast.endTime) ?? "Ongoing"}</span>
                            </div>
                        </div>
                        <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Creator / Host</span>
                            <span className="text-xs font-semibold text-white mt-1.5 block">{podcast.host?.fullname ?? "—"}</span>
                        </div>
                        <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Invite Link</span>
                            <span className="text-xs font-mono text-zinc-400 mt-1.5 block break-all select-all">{inviteLink}</span>
                        </div>
                    </div>
                </Card>

                {/* Recording Sessions */}
                <Card className="p-6">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-body-mid border-b border-hairline pb-3 mb-4">Sessions & Assets</p>
                    <div className="space-y-6">
                        {podcast.recordings.length === 0 && (
                            <p className="text-xs text-zinc-500 font-mono text-center py-8">No recording sessions yet.</p>
                        )}
                        {podcast.recordings.map((session) => (
                            <div key={session._id} className="rounded-xl border border-hairline/60 bg-zinc-950/40 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline/40 pb-3 mb-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{session.guestName}</h4>
                                        <p className="text-[10px] font-mono text-body-mid mt-0.5">
                                            Joined {formatDate(session.joinedAt)}
                                            {session.leftAt ? ` • Left ${formatDate(session.leftAt)}` : ""}
                                        </p>
                                    </div>
                                    <StatusPill status={statusLabel(session.status)} />
                                </div>

                                <div className="flex gap-4 mb-4">
                                    {/* Thumbnail */}
                                    <div className="w-36 flex-shrink-0 aspect-video rounded-lg border border-white/5 bg-zinc-900/60 overflow-hidden flex items-center justify-center">
                                        {session.thumbnail ? (
                                            <img
                                                src={session.thumbnail}
                                                alt={`${session.guestName} thumbnail`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-mono text-zinc-600">No preview</span>
                                        )}
                                    </div>

                                    {/* Info + Download */}
                                    <div className="flex flex-col justify-between flex-1 min-w-0">
                                        <div className="flex gap-10 pt-0.5">
                                            <div>
                                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold block">Processed Video</span>
                                                <span className="text-xs font-mono text-white mt-0.5 block">{session.status === "COMPLETED" ? "Available" : "Pending"}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold block">Processed Audio</span>
                                                <span className="text-xs font-mono text-white mt-0.5 block">{session.status === "COMPLETED" ? "Available" : "Pending"}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <DownloadButton
                                                label="Download Video"
                                                fetchUrl={async () => {
                                                    const token = await getToken();
                                                    const d = await gql<{ getVideoFile: string }>(
                                                        GET_VIDEO_FILE,
                                                        { recordingId: session._id },
                                                        token
                                                    );
                                                    return d.getVideoFile;
                                                }}
                                            />
                                            <DownloadButton
                                                label="Download Audio"
                                                fetchUrl={async () => {
                                                    const token = await getToken();
                                                    const d = await gql<{ getAudioFile: string }>(
                                                        GET_AUDIO_FILE,
                                                        { recordingId: session._id },
                                                        token
                                                    );
                                                    return d.getAudioFile;
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                <Link
                    to={`/live/${podcast._id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-hairline px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-body hover:border-white/30 hover:bg-white/5 transition-colors"
                >
                    Back to Live Room
                </Link>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl border border-hairline px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-body hover:border-white/30 hover:bg-white/5 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </PageShell>
    );
}

export default PodcastDetails;