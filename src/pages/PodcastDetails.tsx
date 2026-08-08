import { Link, useParams } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { podcastDetails, podcasts } from "../lib/podora-data";


function PodcastDetails() {
    const { podcastId } = useParams();
    const fallback = podcastDetails[podcasts[0].id];
    const details = (podcastId && podcastDetails[podcastId]) || fallback;

    return (
        <PageShell
            eyebrow="Podcast Details"
            title={details.podcast.name}
            description="Review the podcast metadata, participant recording sessions, timestamps, processing state, thumbnails, and download actions for each participant recording."
            actions={
                <>
                    <StatusPill status={details.podcast.status} />
                    <PrimaryButton href={`/live/${details.podcast.id}`}>Open Room</PrimaryButton>
                    <OutlineButton href="/dashboard">Dashboard</OutlineButton>
                </>
            }
        >
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <Card className="p-6">
                    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Podcast information</p>
                    <div className="mt-5 space-y-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Podcast name</p>
                            <p className="mt-2 text-[20px] text-white">{details.podcast.name}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Status</p>
                                <div className="mt-3">
                                    <StatusPill status={details.podcast.status} />
                                </div>
                            </div>
                            <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Recording count</p>
                                <p className="mt-3 text-[20px] text-white">{details.podcast.recordingCount}</p>
                            </div>
                            <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Start time</p>
                                <p className="mt-3 text-sm text-white">{details.podcast.startTime ?? "Waiting"}</p>
                            </div>
                            <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-body-mid">End time</p>
                                <p className="mt-3 text-sm text-white">{details.podcast.endTime ?? "In progress"}</p>
                            </div>
                        </div>
                        <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Creator</p>
                            <p className="mt-3 text-sm text-white">{details.creatorName}</p>
                        </div>
                        <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Invite link</p>
                            <p className="mt-3 break-all text-sm text-white">{details.inviteLink}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Participant recording sessions</p>
                    <div className="mt-5 space-y-4">
                        {details.participantRecordingSessions.map((session) => (
                            <div key={session.participantName} className="rounded-lg border border-hairline bg-canvas p-4">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="font-display text-[20px] tracking-[-0.04em] text-white">{session.participantName}</p>
                                        <p className="mt-2 text-sm text-body-mid">Recording window: {session.startedAt} to {session.endedAt ?? "in progress"}</p>
                                    </div>
                                    <StatusPill status={session.recordingStatus} />
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <div className="rounded-lg border border-hairline bg-canvas-soft p-3">
                                        <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Thumbnail</p>
                                        <div className="mt-3 aspect-4/3 rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]" />
                                        <p className="mt-3 text-sm text-white">{session.thumbnail}</p>
                                    </div>
                                    <div className="rounded-lg border border-hairline bg-canvas-soft p-3">
                                        <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Processed video</p>
                                        <p className="mt-3 text-sm text-white">{session.processedVideo}</p>
                                    </div>
                                    <div className="rounded-lg border border-hairline bg-canvas-soft p-3">
                                        <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Processed audio</p>
                                        <p className="mt-3 text-sm text-white">{session.processedAudio}</p>
                                    </div>
                                    <div className="rounded-lg border border-hairline bg-canvas-soft p-3">
                                        <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Timestamps</p>
                                        <p className="mt-3 text-sm text-white">{session.startedAt}</p>
                                        <p className="mt-1 text-sm text-body-mid">{session.endedAt ?? "In progress"}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button className="inline-flex items-center justify-center rounded-full border border-white bg-transparent px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-canvas">
                                        Download video
                                    </button>
                                    <button className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5">
                                        Download audio
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <Link
                    to={`/live/${details.podcast.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5"
                >
                    Back to live room
                </Link>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5"
                >
                    Back to dashboard
                </Link>
            </div>
        </PageShell>
    );
}

export default PodcastDetails;