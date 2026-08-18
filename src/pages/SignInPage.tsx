import { SignIn } from "@clerk/react";

function SignInPage() {
    return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4">
            {/* Branding */}
            <div className="flex items-center gap-3 mb-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-sunset to-accent-dusk text-[14px] font-bold text-white shadow-lg shadow-accent-dusk/20">
                    P
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-white">
                    Podora<span className="text-accent-sunset font-medium font-mono text-sm ml-1">STUDIO</span>
                </span>
            </div>

            {/* Clerk SignIn component — appearance overrides to match dark theme */}
            <SignIn
                routing="hash"
                fallbackRedirectUrl="/dashboard"
                appearance={{
                    variables: {
                        colorPrimary: "#f97316",
                        colorBackground: "#09090b",
                        colorInput: "#18181b",
                        colorInputForeground: "#fafafa",
                        colorForeground: "#fafafa",
                        colorMutedForeground: "#a1a1aa",
                        colorNeutral: "white",
                        borderRadius: "0.75rem",
                        fontFamily: "inherit",
                    },
                    elements: {
                        card: "shadow-2xl border border-white/8 bg-zinc-950/80",
                        formButtonPrimary:
                            "bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 text-white text-xs font-semibold uppercase tracking-wider",
                        footerActionLink: "text-orange-400 hover:text-orange-300",
                        headerTitle: "text-white font-display font-bold tracking-tight",
                        headerSubtitle: "text-zinc-400",
                    },
                }}
            />
        </div>
    );
}

export default SignInPage;
