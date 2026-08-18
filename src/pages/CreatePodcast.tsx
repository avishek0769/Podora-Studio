import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { Card, OutlineButton, PageShell, PrimaryButton } from "../components/podora-ui";
import { gql, CREATE_PODCAST } from "../lib/gql";

function CreatePodcast() {
    const [podcastName, setPodcastName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!podcastName.trim()) return;

        setSubmitting(true);
        setError(null);

        try {
            const token = await getToken();
            const data = await gql<{ createPodcast: { _id: string; name: string } }>(
                CREATE_PODCAST,
                { name: podcastName.trim() },
                token
            );
            const podcastId = data.createPodcast._id;
            navigate(`/live/${podcastId}`);
        } catch (err: any) {
            setError(err.message || "Failed to create podcast");
            setSubmitting(false);
        }
    };

    return (
        <PageShell
            title="Create a new podcast."
            description="Give your session a name. Once created, you will get a shareable invite link and can enter the live media room immediately."
            actions={
                <>
                    <PrimaryButton href="/dashboard">Dashboard</PrimaryButton>
                </>
            }
        >
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-body-mid font-semibold" htmlFor="podcastName">
                                Podcast Name
                            </label>
                            <input
                                id="podcastName"
                                name="podcastName"
                                value={podcastName}
                                onChange={(event) => setPodcastName(event.target.value)}
                                placeholder="e.g. Remote Conversations Ep. 1"
                                className="mt-3 w-full rounded-xl border border-hairline bg-canvas/60 px-4 py-3.5 text-[15px] text-white outline-none placeholder:text-zinc-600 focus:border-accent-sunset/50 transition-colors"
                                required
                                disabled={submitting}
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-rose-400 font-mono">{error}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-sunset to-accent-sunset/90 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-accent-sunset/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Creating…" : "Create Podcast"}
                            </button>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center rounded-xl border border-hairline bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-body hover:border-white/30 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </PageShell>
    );
}

export default CreatePodcast;