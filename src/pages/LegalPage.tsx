import { Link } from "react-router-dom";
import { AppHeader } from "../components/podora-ui";

function LegalPage({ title }: { title: string }) {
    return (
        <div className="min-h-screen bg-canvas text-white selection:bg-white/10">
            <AppHeader />

            <main className="mx-auto max-w-[800px] px-6 py-16 sm:py-20 lg:py-24">
                <div className="inline-block rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-body-mid">
                    Legal
                </div>
                <h1 className="mt-4 font-display text-[36px] font-extrabold tracking-tight text-white sm:text-[48px]">{title}</h1>
                
                <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-body-mid border-t border-hairline/60 pt-8">
                    <p>
                        Podora Studio is a remote podcast recording platform built for creators. Recordings are captured locally in the browser,
                        uploaded in chunks to secure cloud storage, and processed after the session ends.
                    </p>
                    <p>
                        This page exists as a lightweight legal placeholder for the current landing experience. It is intentionally concise
                        while the product surface is still focused on the recording workflow.
                    </p>
                </div>

                <div className="mt-10">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-xl border border-hairline px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-body hover:border-white/30 hover:bg-white/5 transition-colors"
                    >
                        Back Home
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default LegalPage;