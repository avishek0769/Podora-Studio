import { Link } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { podcasts } from "../lib/podora-data";

function Dashboard() {
    return (
        <PageShell
            eyebrow="Dashboard"
            title="Created podcasts in one place."
            description="Track each podcast by status, recording window, and participant recording count. Create a new podcast when you are ready to start another room."
            actions={
                <>
                    <PrimaryButton href="/dashboard/create">Create Podcast</PrimaryButton>
                    <OutlineButton href="/">Landing Page</OutlineButton>
                </>
            }
        >
            <Card className="overflow-hidden">
                <div className="grid gap-4 border-b border-hairline px-5 py-4 text-[12px] uppercase tracking-[0.22em] text-body-mid sm:grid-cols-[1.3fr_0.7fr_0.9fr_0.9fr_0.7fr_0.7fr] sm:px-6">
                    <span>Name</span>
                    <span>Status</span>
                    <span>Start time</span>
                    <span>End time</span>
                    <span>Recordings</span>
                    <span>Actions</span>
                </div>

                <div className="divide-y divide-hairline">
                    {podcasts.map((podcast) => (
                        <div key={podcast.id} className="grid gap-4 px-5 py-5 sm:grid-cols-[1.3fr_0.7fr_0.9fr_0.9fr_0.7fr_0.7fr] sm:px-6">
                            <div>
                                <p className="font-display text-[20px] tracking-[-0.04em] text-white">{podcast.name}</p>
                                <p className="mt-2 text-sm text-body-mid">{podcast.id}</p>
                            </div>
                            <div className="flex items-start sm:items-center">
                                <StatusPill status={podcast.status} />
                            </div>
                            <p className="text-sm text-body-mid">{podcast.startTime ?? "Waiting"}</p>
                            <p className="text-sm text-body-mid">{podcast.endTime ?? "In progress"}</p>
                            <p className="text-sm text-white">{podcast.recordingCount}</p>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/dashboard/podcasts/${podcast.id}`}
                                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-3 py-1.5 text-xs text-white transition-colors hover:border-white/45 hover:bg-white/5"
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </PageShell>
    );
}

export default Dashboard;