import { Link } from "react-router-dom";

const navigationLinks = [
    { label: "Why", href: "#why" },
    { label: "Features", href: "#features" },
    { label: "Process", href: "#process" },
    { label: "FAQ", href: "#faq" },
];

const featureCards = [
    {
        eyebrow: "Remote podcast rooms",
        title: "Create a live room for remote interviews and creator conversations.",
        body: "Set up a recording room, invite guests, and run the podcast session through a polished browser-based interface.",
    },
    {
        eyebrow: "Invite-only access",
        title: "Share one link and let guests join without creating an account.",
        body: "The guest flow stays lightweight so you can bring people into a session quickly and keep the recording moving.",
    },
    {
        eyebrow: "Local capture",
        title: "Each participant is recorded locally in the browser.",
        body: "Podora Studio captures cleaner source media than a compressed meeting stream, which protects quality at the source.",
    },
    {
        eyebrow: "Chunked cloud uploads",
        title: "Media uploads while the session is still running.",
        body: "Chunks are sent to secure cloud storage in the background so the session does not depend on a single final upload.",
    },
    {
        eyebrow: "Post-session processing",
        title: "Files are merged after the host ends the podcast.",
        body: "Once recording stops, the backend processes the uploads and prepares the final assets for download.",
    },
    {
        eyebrow: "Creator dashboard",
        title: "Manage rooms, guests, and recordings in one place.",
        body: "The dashboard keeps each podcast session organized and makes the next recording easier to launch.",
    },
];

const processSteps = [
    {
        step: "01",
        title: "Create a podcast room",
        body: "Start a new recording session from the creator dashboard and prepare it for guests.",
    },
    {
        step: "02",
        title: "Share the invite link",
        body: "Send a shareable link so guests can join immediately without making an account.",
    },
    {
        step: "03",
        title: "Record together remotely",
        body: "Everyone joins the live call while Podora Studio captures each participant locally.",
    },
    {
        step: "04",
        title: "Download processed recordings",
        body: "When the session ends, processed participant recordings become available for download.",
    },
];

const faqItems = [
    {
        question: "Do guests need an account?",
        answer: "No. Guests join through a shareable invite link and do not need to create an account.",
    },
    {
        question: "Where are recordings stored?",
        answer: "Recordings are uploaded in chunks to secure cloud storage during the session.",
    },
    {
        question: "What happens if someone joins late?",
        answer: "Late arrivals join the live room from that point forward and their browser capture starts when they enter.",
    },
    {
        question: "When are recordings available?",
        answer: "After the host ends the podcast, backend processing merges the uploads and prepares the files for download.",
    },
    {
        question: "How many participants can join?",
        answer: "Podora Studio is designed for remote podcast conversations and interview-style sessions with multiple participants.",
    },
];

function LandingPage() {
    return (
        <div className="min-h-screen bg-canvas text-white">
            <header className="sticky top-0 z-50 border-b border-hairline/80 bg-canvas/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
                    <Link className="flex items-center gap-3" to="/" aria-label="Podora Studio home">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[13px] font-mono tracking-[0.18em] text-white">
                            PS
                        </span>
                        <span className="font-display text-[15px] tracking-[-0.03em] sm:text-base">Podora Studio</span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
                        {navigationLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="font-display text-sm tracking-[-0.01em] text-body-mid transition-colors hover:text-white"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="#contact"
                        className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/45 hover:bg-white hover:text-canvas"
                    >
                        Get started for free
                    </a>
                </div>
            </header>

            <main id="top">
                <section className="border-b border-hairline/70">
                    <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-24">
                        <div className="max-w-2xl">
                            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid sm:text-[13px]">
                                Remote podcast recording platform
                            </p>
                            <h1 className="mt-5 font-display text-[48px] leading-[0.95] tracking-[-0.06em] text-white sm:text-[64px] lg:text-[88px] lg:tracking-[-0.07em]">
                                Record high-quality podcasts from anywhere.
                            </h1>
                            <p className="mt-6 max-w-xl text-[17px] leading-7 text-body sm:text-[18px]">
                                Podora Studio captures each participant locally in the browser, uploads media in chunks, and
                                processes the session into individual recordings after the host ends the podcast.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <a
                                    href="#contact"
                                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-canvas"
                                >
                                    Start Recording
                                </a>
                            </div>

                            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                                {[
                                    "Local capture per participant",
                                    "Chunked cloud uploads",
                                    "Processed downloads after recording",
                                ].map((item) => (
                                    <div key={item} className="rounded-lg border border-hairline bg-canvas-card p-4">
                                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Ready</p>
                                        <p className="mt-2 text-sm leading-6 text-white">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-10 top-10 h-24 w-24 rounded-full border border-white/10" />
                            <div className="absolute -right-4 bottom-6 h-16 w-16 rounded-full border border-white/10" />

                            <div className="relative rounded-[8px] border border-hairline bg-canvas-card p-4 sm:p-6">
                                <div className="flex items-center justify-between border-b border-hairline pb-4">
                                    <div>
                                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">
                                            Live recording room
                                        </p>
                                        <p className="mt-2 font-display text-[22px] tracking-[-0.04em] text-white sm:text-[28px]">
                                            Clean source capture for every guest.
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-white/20 px-3 py-1 text-[12px] text-body-mid">
                                        Recording
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                                    <div className="rounded-[8px] border border-white/10 bg-canvas p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-body-mid">Participants</p>
                                            <p className="text-xs text-body-mid">Browser capture on</p>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="aspect-4/3 rounded-[8px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,122,23,0.12))] p-3">
                                                <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Host</p>
                                                <div className="mt-6 h-10 w-10 rounded-full border border-white/20 bg-white/10" />
                                                <p className="mt-4 text-sm text-white">Studio camera</p>
                                            </div>
                                            <div className="aspect-4/3 rounded-[8px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(124,58,237,0.12))] p-3">
                                                <p className="text-xs uppercase tracking-[0.2em] text-body-mid">Guest</p>
                                                <div className="mt-6 h-10 w-10 rounded-full border border-white/20 bg-white/10" />
                                                <p className="mt-4 text-sm text-white">Remote camera</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="rounded-[8px] border border-hairline bg-canvas p-4">
                                            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-body-mid">
                                                Upload progress
                                            </p>
                                            <div className="mt-3 h-2 rounded-full bg-white/10">
                                                <div className="h-2 w-4/5 rounded-full bg-white" />
                                            </div>
                                            <p className="mt-3 text-sm text-body-mid">Chunks are syncing while the call is live.</p>
                                        </div>
                                        <div className="rounded-[8px] border border-hairline bg-canvas p-4">
                                            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-body-mid">
                                                Session state
                                            </p>
                                            <ul className="mt-3 space-y-2 text-sm text-body-mid">
                                                <li>• Shareable invite link ready</li>
                                                <li>• Local audio and video capture active</li>
                                                <li>• Individual participant files will be available after processing</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-hairline/70">
                    <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
                        <div className="rounded-[8px] border border-hairline bg-canvas-card p-5 sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Coming soon</p>
                                    <p className="mt-3 font-display text-[22px] tracking-[-0.04em] text-white sm:text-[28px]">
                                        Creator-facing podcast rooms are being prepared now.
                                    </p>
                                </div>
                                <p className="max-w-2xl text-sm leading-6 text-body-mid">
                                    No fake numbers or logos here. Podora Studio is designed around a real workflow: invite guests,
                                    record locally, upload in chunks, and process the session after the host ends it.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="why" className="border-b border-hairline/70">
                    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                            <div className="max-w-xl">
                                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Why Podora Studio</p>
                                <h2 className="mt-4 font-display text-[34px] leading-none tracking-tighter text-white sm:text-[48px]">
                                    Local recordings protect quality when the connection is imperfect.
                                </h2>
                                <p className="mt-5 text-[16px] leading-7 text-body">
                                    Traditional meeting apps often record the compressed call stream. Podora Studio records each
                                    participant locally in the browser, then uploads those files in chunks while the session continues.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    {
                                        title: "Cleaner source media",
                                        body: "The final recordings are built from each participant's own local capture instead of a single compressed stream.",
                                    },
                                    {
                                        title: "Reliable background uploads",
                                        body: "Chunked uploads keep media moving to secure cloud storage while the session is still running.",
                                    },
                                    {
                                        title: "Processed after the session",
                                        body: "When the host ends the podcast, the backend merges uploads and prepares the participant recordings.",
                                    },
                                    {
                                        title: "Built for creators",
                                        body: "The product is shaped for podcasters, interview channels, content creators, and remote teams.",
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="rounded-[8px] border border-hairline bg-canvas-card p-5 sm:p-6">
                                        <h3 className="font-display text-[20px] tracking-[-0.04em] text-white">{item.title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-body-mid">{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="border-b border-hairline/70">
                    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                        <div className="max-w-2xl">
                            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Features</p>
                            <h2 className="mt-4 font-display text-[34px] leading-none tracking-tighter text-white sm:text-[48px]">
                                Everything on this page maps to the current product, not generic marketing filler.
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-4 lg:grid-cols-3">
                            {featureCards.map((card) => (
                                <article key={card.title} className="rounded-[8px] border border-hairline bg-canvas-card p-6 sm:p-7">
                                    <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-body-mid">{card.eyebrow}</p>
                                    <h3 className="mt-4 max-w-sm font-display text-[24px] leading-[1.15] tracking-[-0.04em] text-white">
                                        {card.title}
                                    </h3>
                                    <p className="mt-4 text-[15px] leading-7 text-body">{card.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="process" className="border-b border-hairline/70">
                    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                            <div className="max-w-xl">
                                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">How it works</p>
                                <h2 className="mt-4 font-display text-[34px] leading-none tracking-tighter text-white sm:text-[48px]">
                                    A 4-step flow from room creation to processed downloads.
                                </h2>
                                <p className="mt-5 text-[16px] leading-7 text-body">
                                    The flow keeps hosts and guests focused on the recording while the backend handles uploads and
                                    post-session processing.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute left-[18px] top-0 hidden h-full w-px bg-white/12 lg:block" />
                                <div className="grid gap-4 lg:grid-cols-4 lg:gap-3">
                                    {processSteps.map((step, index) => (
                                        <div key={step.step} className="relative lg:pt-6">
                                            <div className="absolute left-4 top-8 hidden h-px w-full bg-white/12 lg:block" />
                                            <div className="relative flex items-start gap-4 rounded-[8px] border border-hairline bg-canvas-card p-5 lg:flex-col lg:p-6">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-canvas text-[12px] font-mono tracking-[0.2em] text-white">
                                                    {step.step}
                                                </div>
                                                <div>
                                                    <h3 className="font-display text-[20px] tracking-[-0.04em] text-white">{step.title}</h3>
                                                    <p className="mt-3 text-sm leading-6 text-body-mid">{step.body}</p>
                                                </div>
                                            </div>
                                            {index < processSteps.length - 1 ? (
                                                <div className="ml-4 mt-3 h-6 w-px bg-white/12 lg:hidden" />
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-hairline/70">
                    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
                            <div className="max-w-xl">
                                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Product preview</p>
                                <h2 className="mt-4 font-display text-[34px] leading-none tracking-tighter text-white sm:text-[48px]">
                                    A dashboard and room preview built around the recording workflow.
                                </h2>
                                <p className="mt-5 text-[16px] leading-7 text-body">
                                    The preview shows what creators need most: a room, a live session state, upload progress, and
                                    individual participant recordings waiting to be processed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="faq" className="border-b border-hairline/70">
                    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                        <div className="max-w-2xl">
                            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">FAQ</p>
                            <h2 className="mt-4 font-display text-[34px] leading-none tracking-tighter text-white sm:text-[48px]">
                                Practical answers for people planning a remote podcast session.
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-4 lg:grid-cols-2">
                            {faqItems.map((item) => (
                                <details key={item.question} className="group rounded-[8px] border border-hairline bg-canvas-card p-5">
                                    <summary className="cursor-pointer list-none font-display text-[20px] tracking-[-0.04em] text-white">
                                        {item.question}
                                    </summary>
                                    <p className="mt-4 max-w-2xl text-sm leading-6 text-body-mid">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact">
                    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                        <div className="rounded-[8px] border border-hairline bg-canvas-card p-6 sm:p-8 lg:p-10">
                            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div className="max-w-2xl">
                                    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Final CTA</p>
                                    <h2 className="mt-4 font-display text-[34px] leading-none tracking-tighter text-white sm:text-[48px]">
                                        Start your first remote recording session with Podora Studio.
                                    </h2>
                                    <p className="mt-4 text-[16px] leading-7 text-body">
                                        Launch a creator workflow built around local capture, secure uploads, and processed participant
                                        recordings that are ready after the session ends.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                    <a
                                        href="mailto:hello@podorastudio.com"
                                        className="inline-flex items-center justify-center rounded-full border border-white bg-transparent px-5 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-canvas"
                                    >
                                        Start Recording
                                    </a>
                                    <Link
                                        to="/privacy-policy"
                                        className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/5"
                                    >
                                        Privacy Policy
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-hairline/70">
                <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-xl">
                            <p className="font-display text-[18px] tracking-[-0.04em] text-white">Podora Studio</p>
                            <p className="mt-3 text-sm leading-6 text-body-mid">
                                Remote podcast recording built for creators, interview channels, podcasters, and remote teams who
                                need high-quality source recordings from anywhere.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Company</p>
                                <div className="mt-3 space-y-2 text-sm text-body-mid">
                                    <Link to="/privacy-policy" className="block transition-colors hover:text-white">
                                        Privacy Policy
                                    </Link>
                                    <Link to="/terms-and-conditions" className="block transition-colors hover:text-white">
                                        Terms and Conditions
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Contact</p>
                                <div className="mt-3 space-y-2 text-sm text-body-mid">
                                    <p>hello@podorastudio.com</p>
                                    <p>Designed for remote recording workflows.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}


export default LandingPage;