import { Link } from "react-router-dom";

function LegalPage({ title }: { title: string }) {
    return (
        <div className="min-h-screen bg-canvas text-white">
            <header className="border-b border-hairline/70">
                <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
                    <Link className="flex items-center gap-3" to="/">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[13px] font-mono tracking-[0.18em] text-white">
                            PS
                        </span>
                        <span className="font-display text-[15px] tracking-[-0.03em] sm:text-base">Podora Studio</span>
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5"
                    >
                        Back home
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-[800px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Legal</p>
                <h1 className="mt-4 font-display text-[42px] leading-none tracking-tighter text-white sm:text-[56px]">{title}</h1>
                <div className="mt-8 space-y-6 text-[16px] leading-7 text-body-mid">
                    <p>
                        Podora Studio is a remote podcast recording platform built for creators. Recordings are captured locally in the browser,
                        uploaded in chunks to secure cloud storage, and processed after the session ends.
                    </p>
                    <p>
                        This page exists as a lightweight legal placeholder for the current landing experience. It is intentionally concise
                        while the product surface is still focused on the recording workflow.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default LegalPage;