import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { currentRoom, podcasts } from "../lib/podora-data";

function PodcastRoom() {
    const { podcastId } = useParams();
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

    const [guestName, setGuestName] = useState("");
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const inviteUrl = `${window.location.origin}/join/live/${room.podcastId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PageShell
            eyebrow="Lobby"
            title={room.podcastName}
            description="Prepare to join the podcast session. Ensure your camera and microphone are connected before entering the live room."
            actions={
                <>
                    <StatusPill status={room.roomStatus} />
                    <OutlineButton href={`/dashboard/podcasts/${room.podcastId}`}>View Details</OutlineButton>
                    <PrimaryButton href="/dashboard">Dashboard</PrimaryButton>
                </>
            }
        >
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] max-w-5xl mx-auto">
                {/* Left: Info Card */}
                <div className="space-y-6">
                    <Card className="p-6 sm:p-8">
                        <div className="flex items-center justify-between border-b border-hairline/60 pb-5">
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-wider text-body-mid">Host Info</p>
                                <h3 className="mt-1.5 text-lg font-bold text-white tracking-tight">Created by {room.creatorName}</h3>
                            </div>
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="mt-6 space-y-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-body-mid font-semibold mb-2">
                                    Shareable Invite Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={inviteUrl}
                                        className="w-full rounded-xl border border-hairline bg-canvas/60 px-4 py-3 text-sm text-zinc-300 outline-none select-all font-mono"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="px-4 rounded-xl border border-hairline bg-white/5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                                    >
                                        {copied ? "Copied" : "Copy"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Guest Join Card */}
                <div>
                    <Card className="p-6 sm:p-8 border-accent-sunset/25">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-body-mid">Quick Access</p>
                        <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-white">Join as Guest</h3>
                        <p className="mt-3 text-xs leading-relaxed text-body-mid">
                            Enter your display name. No registration or credentials required to join this podcast call.
                        </p>

                        <form
                            className="mt-6 space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (guestName.trim()) {
                                    navigate(`/live/${room.podcastId}`, {
                                        state: { guestName: guestName.trim() },
                                    });
                                }
                            }}
                        >
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-body-mid font-semibold" htmlFor="guestName">
                                    Display Name
                                </label>
                                <input
                                    id="guestName"
                                    value={guestName}
                                    onChange={(event) => setGuestName(event.target.value)}
                                    placeholder="e.g. Ari Foster"
                                    className="mt-3 w-full rounded-xl border border-hairline bg-canvas/60 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-accent-sunset/50 transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-sunset to-accent-sunset/90 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-accent-sunset/10"
                            >
                                Join Live Room
                            </button>
                        </form>
                    </Card>
                </div>
            </div>
        </PageShell>
    );
}

export default PodcastRoom;