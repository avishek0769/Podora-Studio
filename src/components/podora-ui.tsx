import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { PodcastStatus } from "../lib/podora-data";

const statusTone: Record<PodcastStatus, string> = {
    waiting: "border-white/20 bg-white/5 text-body-mid",
    recording: "border-white bg-white text-canvas",
    uploading: "border-white/25 bg-canvas text-white",
    processing: "border-white/25 bg-canvas-soft text-white",
    completed: "border-white/25 bg-white text-canvas",
    failed: "border-[#7c3aed]/40 bg-[#7c3aed]/10 text-white",
};

export function StatusPill({ status }: { status: PodcastStatus }) {
    return <span className={`inline-flex rounded-full border px-3 py-1 text-[12px] uppercase tracking-[0.18em] ${statusTone[status]}`}>{status}</span>;
}

export function AppHeader() {
    return (
        <header className="border-b border-hairline/70 bg-canvas/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
                <Link className="flex items-center gap-3" to="/">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[13px] font-mono tracking-[0.18em] text-white">
                        PS
                    </span>
                    <span className="font-display text-[15px] tracking-[-0.03em] sm:text-base">Podora Studio</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link to="/dashboard" className="text-sm text-body-mid transition-colors hover:text-white">
                        Dashboard
                    </Link>
                    <Link to="/dashboard/create" className="text-sm text-body-mid transition-colors hover:text-white">
                        Create Podcast
                    </Link>
                    <Link to="/" className="text-sm text-body-mid transition-colors hover:text-white">
                        Landing
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export function PageShell({
    eyebrow,
    title,
    description,
    actions,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-canvas text-white">
            <AppHeader />
            <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">{eyebrow}</p>
                        <h1 className="mt-4 font-display text-[42px] leading-none tracking-tighter text-white sm:text-[56px]">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-[16px] leading-7 text-body">{description}</p>
                    </div>

                    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
                </div>

                <div className="mt-10">{children}</div>
            </main>
        </div>
    );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`rounded-[8px] border border-hairline bg-canvas-card ${className}`}>{children}</div>;
}

export function OutlineButton({ children, href }: { children: ReactNode; href: string }) {
    return (
        <Link
            to={href}
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5"
        >
            {children}
        </Link>
    );
}

export function PrimaryButton({ children, href }: { children: ReactNode; href: string }) {
    return (
        <Link
            to={href}
            className="inline-flex items-center justify-center rounded-full border border-white bg-transparent px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-canvas"
        >
            {children}
        </Link>
    );
}
