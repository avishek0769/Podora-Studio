import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { PodcastStatus } from "../lib/podora-data";

const statusTone: Record<PodcastStatus, string> = {
    waiting: "border-zinc-800 bg-zinc-900/50 text-zinc-400",
    recording: "border-red-500/20 bg-red-500/5 text-red-400",
    uploading: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    processing: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    completed: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    failed: "border-rose-500/20 bg-rose-500/5 text-rose-400",
};

export function StatusPill({ status }: { status: PodcastStatus }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] ${statusTone[status]}`}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                status === "recording" ? "bg-red-400" :
                status === "uploading" ? "bg-blue-400" :
                status === "processing" ? "bg-amber-400" :
                status === "completed" ? "bg-emerald-400" :
                status === "failed" ? "bg-rose-400" : "bg-zinc-400"
            }`} />
            {status}
        </span>
    );
}

export function AppHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-hairline/60 bg-canvas/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 lg:px-8">
                <Link className="flex items-center gap-3 group" to="/">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-sunset to-accent-dusk text-[13px] font-bold tracking-wider text-white shadow-lg shadow-accent-dusk/20">
                        P
                    </div>
                    <span className="font-display text-[16px] font-bold tracking-tight text-white sm:text-lg">
                        Podora<span className="text-accent-sunset font-medium font-mono text-[14px] ml-1">STUDIO</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-8">
                    <Link to="/dashboard" className="text-sm font-medium text-body-mid hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/dashboard/create" className="text-sm font-medium text-body-mid hover:text-white transition-colors">
                        Create
                    </Link>
                    <Link to="/" className="text-sm font-medium text-body-mid hover:text-white transition-colors">
                        Landing
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export function PageShell({
    title,
    description,
    actions,
    children,
}: {
    title: string;
    description: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-canvas text-white selection:bg-white/10">
            <AppHeader />
            <main className="mx-auto max-w-[1200px] px-6 pb-10 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-hairline/50 pb-8 mb-10">
                    <div className="max-w-3xl">
                        <h1 className="mt-4 font-display text-[36px] font-extrabold tracking-tight text-white sm:text-[48px]">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-body-mid">{description}</p>
                    </div>

                    {actions ? <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">{actions}</div> : null}
                </div>

                <div>{children}</div>
            </main>
        </div>
    );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-hairline bg-canvas-soft/40 backdrop-blur-md shadow-xl ${className}`}>
            {children}
        </div>
    );
}

export function OutlineButton({ children, href }: { children: ReactNode; href: string }) {
    return (
        <Link
            to={href}
            className="inline-flex items-center justify-center rounded-xl border border-hairline bg-transparent px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-body hover:border-white/30 hover:bg-white/5 transition-colors"
        >
            {children}
        </Link>
    );
}

export function PrimaryButton({ children, href }: { children: ReactNode; href: string }) {
    return (
        <Link
            to={href}
            className="inline-flex items-center justify-center rounded-xl border border-hairline bg-transparent px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-canvas hover:bg-zinc-700 transition-colors shadow-lg shadow-white/5"
        >
            {children}
        </Link>
    );
}
