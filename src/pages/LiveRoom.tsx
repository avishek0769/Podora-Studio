import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { currentRoom, podcasts } from "../lib/podora-data";

function LiveRoom() {
    const { podcastId } = useParams();
    const location = useLocation();
    const guestName = (location.state as { guestName?: string } | null)?.guestName ?? "Guest";

    const room = useMemo(() => {
        if (podcastId === currentRoom.podcastId) {
            return currentRoom;
        }

        const podcast = podcasts.find((item) => item.id === podcastId);
        if (!podcast) {
            return currentRoom;
        }

        return {
            ...currentRoom,
            podcastId: podcast.id,
            podcastName: podcast.name,
            roomStatus: podcast.status,
        };
    }, [podcastId]);

    const participants = [
        { name: room.creatorName, role: "Host", tone: "from-[#ff7a17]/25 to-white/10" },
        { name: guestName, role: "You", tone: "from-[#7c3aed]/25 to-white/10" },
        ...room.participants
            .filter((participant) => participant.name !== room.creatorName)
            .filter((participant) => participant.name !== guestName)
            .map((participant, index) => ({
                name: participant.name,
                role: index === 0 ? "Guest" : `Guest ${index + 1}`,
                tone: "from-white/10 to-white/5",
            })),
    ];

    return (
        <PageShell
            eyebrow="Live Room"
            title={room.podcastName}
            description="This is the shared call surface for host and guests. Video feeds resize automatically in a responsive grid so the interface works from two people to many participants."
            actions={
                <>
                    <StatusPill status={room.roomStatus} />
                    <OutlineButton href={`/dashboard/podcasts/${room.podcastId}`}>Podcast Details</OutlineButton>
                    <PrimaryButton href="/dashboard">Dashboard</PrimaryButton>
                </>
            }
        >
            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <Card className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Live call</p>
                            <h2 className="mt-2 font-display text-[26px] tracking-[-0.04em] text-white">Video calling interface</h2>
                        </div>
                        <StatusPill status={room.roomStatus} />
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {participants.map((participant, index) => (
                            <div key={`${participant.name}-${index}`} className="rounded-[8px] border border-hairline bg-canvas-soft p-3">
                                <div className={`aspect-4/3 rounded-lg border border-white/10 bg-gradient-to-br ${participant.tone} p-3`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-body-mid">{participant.role}</p>
                                            <p className="mt-2 text-sm text-white">{participant.name}</p>
                                        </div>
                                        <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] text-body-mid">Live</span>
                                    </div>
                                    <div className="mt-8 flex h-full items-end justify-between">
                                        <div className="h-12 w-12 rounded-full border border-white/20 bg-white/10" />
                                        <div className="space-y-2 text-right text-xs text-body-mid">
                                            <p>Audio active</p>
                                            <p>Video active</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <p className="text-sm text-white">{participant.name}</p>
                                    <StatusPill status={participant.role === "You" ? "recording" : "uploading"} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Recording state</p>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-body-mid">
                            <p>• Waiting: room prepared and guests can still join.</p>
                            <p>• Recording: each connected participant is captured locally in the browser.</p>
                            <p>• Uploading: chunks are syncing to cloud storage during the session.</p>
                            <p>• Processing: backend merge starts after the host ends the session.</p>
                            <p>• Completed: processed participant files are ready for download.</p>
                            <p>• Failed: a recording or upload step needs attention.</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Live session details</p>
                        <div className="mt-4 space-y-3 text-sm text-body-mid">
                            <p>Room: {room.podcastId}</p>
                            <p>Creator: {room.creatorName}</p>
                            <p>Guest joined as: {guestName}</p>
                            <p>Invite link: {room.inviteLink}</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Controls</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button className="inline-flex items-center justify-center rounded-full border border-white bg-transparent px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-canvas">
                                Toggle mic
                            </button>
                            <button className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5">
                                Toggle camera
                            </button>
                            <button className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5">
                                End session
                            </button>
                        </div>
                    </Card>

                    <div className="flex flex-wrap gap-3">
                        <OutlineButton href={`/join/live/${room.podcastId}`}>Open join page</OutlineButton>
                        <Link
                            to={`/dashboard/podcasts/${room.podcastId}`}
                            className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5"
                        >
                            View details
                        </Link>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

export default LiveRoom;