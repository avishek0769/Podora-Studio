import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton } from "../components/podora-ui";

function CreatePodcast() {
    const [podcastName, setPodcastName] = useState("");
    const navigate = useNavigate();

    return (
        <PageShell
            eyebrow="Create Podcast"
            title="Create a new podcast room."
            description="Enter only the podcast name here. The room, invite link, recording lifecycle, and media pipeline will connect later from the backend."
            actions={
                <>
                    <PrimaryButton href="/dashboard">Dashboard</PrimaryButton>
                    <OutlineButton href="/live/pod-003">Preview Room</OutlineButton>
                </>
            }
        >
            <Card className="max-w-2xl p-6 sm:p-8">
                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        navigate("/live/pod-003");
                    }}
                >
                    <div>
                        <label className="block font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid" htmlFor="podcastName">
                            Podcast name
                        </label>
                        <input
                            id="podcastName"
                            name="podcastName"
                            value={podcastName}
                            onChange={(event) => setPodcastName(event.target.value)}
                            placeholder="Remote Conversations"
                            className="mt-3 w-full rounded-lg border border-hairline bg-canvas-soft px-4 py-3 text-[16px] text-white outline-none placeholder:text-body-mid focus:border-white/40"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full border border-white bg-transparent px-5 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-canvas"
                        >
                            Create Podcast
                        </button>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>

            </Card>
        </PageShell>
    );
}

export default CreatePodcast;