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
    const navigate = useNavigate();

    return (
        <PageShell
            eyebrow="Podcast Room"
            title={room.podcastName}
            description="This invite page shows the room state, creator, and shareable link. Guests only need to enter their name before joining the live call."
            actions={
                <>
                    <StatusPill status={room.roomStatus} />
                    <OutlineButton href={`/dashboard/podcasts/${room.podcastId}`}>View Details</OutlineButton>
                    <PrimaryButton href="/dashboard">Dashboard</PrimaryButton>
                </>
            }
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_0.82fr]">
                <Card className="p-6 sm:p-8">
                    <div className="flex flex-col gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Room status</p>
                            <h2 className="mt-2 font-display text-[26px] tracking-[-0.04em] text-white">Live recording room</h2>
                        </div>
                        <StatusPill status={room.roomStatus} />
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[8px] border border-hairline bg-canvas-soft p-4">
                            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-body-mid">Creator</p>
                            <p className="mt-3 text-[18px] text-white">{room.creatorName}</p>
                        </div>
                        <div className="rounded-[8px] border border-hairline bg-canvas-soft p-4">
                            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-body-mid">Shareable invite link</p>
                            <Link
                                to={room.inviteLink}
                                className="mt-3 block break-all text-[15px] text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                            >
                                {room.inviteLink}
                            </Link>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Guest join</p>
                        <h3 className="mt-3 font-display text-[24px] tracking-[-0.04em] text-white">Guests only need their name.</h3>
                        <p className="mt-3 text-sm leading-6 text-body-mid">
                            The invite link carries the room. This form represents the guest join step before the backend and WebRTC flow are connected.
                        </p>

                        <form
                            className="mt-5 space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                navigate(`/live/${room.podcastId}`, {
                                    state: { guestName: guestName.trim() || "Guest" },
                                });
                            }}
                        >
                            <div>
                                <label className="block font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid" htmlFor="guestName">
                                    Guest name
                                </label>
                                <input
                                    id="guestName"
                                    value={guestName}
                                    onChange={(event) => setGuestName(event.target.value)}
                                    placeholder="Ari Foster"
                                    className="mt-3 w-full rounded-lg border border-hairline bg-canvas-soft px-4 py-3 text-[16px] text-white outline-none placeholder:text-body-mid focus:border-white/40"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-full border border-white bg-transparent px-5 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-canvas"
                            >
                                Join room
                            </button>
                        </form>
                    </Card>

                    <div className="flex flex-wrap gap-3">
                        <OutlineButton href="/dashboard">Back to Dashboard</OutlineButton>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

export default PodcastRoom;