import { Link, useParams } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { podcastDetails, podcasts } from "../lib/podora-data";

// Helper to parse time string like "09:00" or "Aug 08, 2026 09:00" into minutes
const parseTimeToMinutes = (timeStr: string | null) => {
    if (!timeStr) return null;
    const cleanStr = timeStr.trim();
    if (!cleanStr.includes(":")) return null;
    
    const parts = cleanStr.split(/\s+/);
    const timePart = parts[parts.length - 1]; // get the HH:MM part
    const subParts = timePart.split(":");
    if (subParts.length < 2) return null;
    const hrs = parseInt(subParts[0], 10);
    const mins = parseInt(subParts[1], 10);
    if (isNaN(hrs) || isNaN(mins)) return null;
    return hrs * 60 + mins;
};

// Helper to format minutes back to HH:MM
const renderTimeLabel = (minutes: number) => {
    const hrs = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

function PodcastDetails() {
    const { podcastId } = useParams();
    const fallback = podcastDetails[podcasts[0].id];
    const details = (podcastId && podcastDetails[podcastId]) || fallback;

    // Timeline calculation
    const startMin = parseTimeToMinutes(details.podcast.startTime) ?? 0;
    let endMin = parseTimeToMinutes(details.podcast.endTime);

    if (!endMin) {
        // Fallback: find maximum duration from session end times
        let maxSession = startMin + 30; // default 30 mins window
        details.participantRecordingSessions.forEach(s => {
            const sMin = parseTimeToMinutes(s.startedAt);
            const eMin = parseTimeToMinutes(s.endedAt);
            if (sMin && sMin > maxSession) maxSession = sMin;
            if (eMin && eMin > maxSession) maxSession = eMin;
        });
        endMin = maxSession;
    }
    const duration = endMin - startMin || 1;

    return (
        <PageShell
            eyebrow="Details"
            title={details.podcast.name}
            description="Access recording sessions, track real-time processing states, view invitation timelines, and export assets."
            actions={
                <>
                    <StatusPill status={details.podcast.status} />
                    <PrimaryButton href={`/live/${details.podcast.id}`}>Open Room</PrimaryButton>
                    <OutlineButton href="/dashboard">Dashboard</OutlineButton>
                </>
            }
        >
            {/* Top Visualization: Timeline */}
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
                    {/* Vertical guidelines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none pl-32 pr-2">
                        <div className="border-l border-dashed border-hairline/60 h-full"></div>
                        <div className="border-l border-dashed border-hairline/60 h-full"></div>
                        <div className="border-l border-dashed border-hairline/60 h-full"></div>
                        <div className="border-l border-dashed border-hairline/60 h-full"></div>
                        <div className="border-l border-dashed border-hairline/60 h-full"></div>
                    </div>

                    {/* Time Scale Axis */}
                    <div className="flex justify-between pl-32 pr-2 text-[10px] font-mono text-zinc-500 mb-6 select-none">
                        <span>{renderTimeLabel(startMin)}</span>
                        <span>{renderTimeLabel(startMin + Math.round(duration * 0.25))}</span>
                        <span>{renderTimeLabel(startMin + Math.round(duration * 0.5))}</span>
                        <span>{renderTimeLabel(startMin + Math.round(duration * 0.75))}</span>
                        <span>{renderTimeLabel(endMin)}</span>
                    </div>

                    <div className="space-y-4 relative">
                        {details.participantRecordingSessions.map((session, idx) => {
                            const sMin = parseTimeToMinutes(session.startedAt) ?? startMin;
                            const eMin = parseTimeToMinutes(session.endedAt) ?? endMin;
                            const leftPercent = Math.max(0, Math.min(100, ((sMin - startMin) / duration) * 100));
                            const widthPercent = Math.max(1, Math.min(100 - leftPercent, ((eMin - sMin) / duration) * 100));

                            return (
                                <div key={idx} className="flex items-center min-h-[32px]">
                                    <div className="w-32 flex-shrink-0 pr-4">
                                        <span className="text-xs font-semibold text-zinc-300 truncate block">
                                            {session.participantName}
                                        </span>
                                    </div>

                                    <div className="flex-grow bg-zinc-900/30 border border-hairline/40 rounded-lg h-7 relative overflow-hidden">
                                        <div
                                            style={{
                                                left: `${leftPercent}%`,
                                                width: `${widthPercent}%`,
                                            }}
                                            className={`absolute h-full rounded-md border flex items-center px-3 transition-all ${
                                                session.recordingStatus === "completed"
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                    : session.recordingStatus === "recording"
                                                    ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
                                                    : session.recordingStatus === "processing"
                                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                                    : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400"
                                            }`}
                                        >
                                            <span className="text-[9px] font-mono font-medium truncate select-none">
                                                {session.startedAt} - {session.endedAt ?? "Active"}
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
                {/* Podcast Info Card */}
                <Card className="p-6 self-start">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-body-mid border-b border-hairline pb-3 mb-4">Metadata</p>
                    <div className="space-y-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Podcast Name</span>
                            <span className="text-base font-semibold text-white mt-1 block">{details.podcast.name}</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Start</span>
                                <span className="text-xs font-mono font-medium text-white mt-1.5 block">{details.podcast.startTime ?? "Waiting"}</span>
                            </div>
                            <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">End</span>
                                <span className="text-xs font-mono font-medium text-white mt-1.5 block">{details.podcast.endTime ?? "Ongoing"}</span>
                            </div>
                        </div>
                        <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Creator / Host</span>
                            <span className="text-xs font-semibold text-white mt-1.5 block">{details.creatorName}</span>
                        </div>
                        <div className="rounded-lg border border-hairline/80 bg-canvas-soft/30 p-3">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Invite Link</span>
                            <span className="text-xs font-mono text-zinc-400 mt-1.5 block break-all select-all">{details.inviteLink}</span>
                        </div>
                    </div>
                </Card>

                {/* Participant Sessions Card */}
                <Card className="p-6">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-body-mid border-b border-hairline pb-3 mb-4">Sessions & Assets</p>
                    <div className="space-y-6">
                        {details.participantRecordingSessions.map((session, index) => (
                            <div key={index} className="rounded-xl border border-hairline/60 bg-zinc-950/40 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline/40 pb-3 mb-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{session.participantName}</h4>
                                        <p className="text-[10px] font-mono text-body-mid mt-0.5">Joined at {session.startedAt} {session.endedAt ? `• Left at ${session.endedAt}` : ""}</p>
                                    </div>
                                    <StatusPill status={session.recordingStatus} />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3 mb-4">
                                    <div className="rounded-lg border border-hairline bg-canvas/30 p-2.5">
                                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Thumbnail</span>
                                        <div className="aspect-video rounded-md border border-white/5 bg-zinc-900/60 flex items-center justify-center">
                                            <span className="text-[10px] font-mono text-zinc-500">{session.thumbnail}</span>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-hairline bg-canvas/30 p-2.5">
                                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Processed Video</span>
                                        <span className="text-xs font-mono font-medium text-white block mt-1">{session.processedVideo}</span>
                                    </div>
                                    <div className="rounded-lg border border-hairline bg-canvas/30 p-2.5">
                                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Processed Audio</span>
                                        <span className="text-xs font-mono font-medium text-white block mt-1">{session.processedAudio}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-xs font-semibold text-canvas hover:bg-zinc-200 transition-colors cursor-pointer">
                                        Download Video
                                    </button>
                                    <button className="inline-flex items-center justify-center rounded-lg border border-hairline px-3 py-2 text-xs font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer">
                                        Download Audio
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                <Link
                    to={`/live/${details.podcast.id}`}
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