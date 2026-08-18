import { Link } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { podcasts } from "../lib/podora-data";

function Dashboard() {
    return (
        <PageShell
            eyebrow="Console"
            title="Podcasts"
            description="Manage your remote recordings, invite participants, and access processed audio/video feeds."
            actions={
                <>
                    <PrimaryButton href="/dashboard/create">Create Podcast</PrimaryButton>
                    <OutlineButton href="/">Landing Page</OutlineButton>
                </>
            }
        >
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1.6fr_1fr_1.2fr_1.2fr_0.8fr_0.8fr] gap-4 border-b border-hairline/80 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-body-mid">
                            <span>Podcast Name</span>
                            <span>Status</span>
                            <span>Start Time</span>
                            <span>End Time</span>
                            <span>Recordings</span>
                            <span className="text-right">Actions</span>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-hairline/60">
                            {podcasts.map((podcast) => (
                                <div key={podcast.id} className="grid grid-cols-[1.6fr_1fr_1.2fr_1.2fr_0.8fr_0.8fr] gap-4 items-center px-6 py-5 hover:bg-white/[0.01] transition-colors">
                                    <div>
                                        <p className="font-display text-[15px] font-semibold text-white tracking-tight">{podcast.name}</p>
                                        <p className="mt-1 text-[11px] font-mono text-zinc-500">{podcast.id}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <StatusPill status={podcast.status} />
                                    </div>
                                    <p className="text-xs text-body-mid font-mono">{podcast.startTime ?? "Waiting"}</p>
                                    <p className="text-xs text-body-mid font-mono">{podcast.endTime ?? "—"}</p>
                                    <div>
                                        <span className="inline-flex items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-xs text-white font-mono font-medium">
                                            {podcast.recordingCount}
                                        </span>
                                    </div>
                                    <div className="flex justify-end">
                                        <Link
                                            to={`/dashboard/podcasts/${podcast.id}`}
                                            className="inline-flex items-center justify-center rounded-lg border border-hairline bg-transparent px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/5 hover:border-white/20 transition-all"
                                        >
                                            View details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </PageShell>
    );
}

export default Dashboard;