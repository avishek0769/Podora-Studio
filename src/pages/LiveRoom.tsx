import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Card, OutlineButton, PageShell, PrimaryButton, StatusPill } from "../components/podora-ui";
import { currentRoom, podcasts } from "../lib/podora-data";

// Pool of guest names for dynamic simulation
const MOCK_GUESTS_POOL = [
    "Sophia Patel",
    "Liam Vance",
    "Chloe Zhao",
    "Derrick Thorne",
    "Elena Rostova",
    "Kenji Takahashi",
    "Zahra Al-Fayed"
];

// Local video feed handler using real camera/audio tracks
function LocalVideoFeed({
    cameraEnabled,
    micEnabled,
    name,
}: {
    cameraEnabled: boolean;
    micEnabled: boolean;
    name: string;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [streamError, setStreamError] = useState<string | null>(null);

    useEffect(() => {
        let activeStream: MediaStream | null = null;
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user",
                },
                audio: true,
            })
            .then((mediaStream) => {
                activeStream = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            })
            .catch((err) => {
                console.error("Camera access failed:", err);
                setStreamError(err.message || "Permission Denied");
            });

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // Sync cameraEnabled state with local stream tracks
    useEffect(() => {
        if (stream) {
            stream.getVideoTracks().forEach((track) => {
                track.enabled = cameraEnabled;
            });
        }
    }, [cameraEnabled, stream]);

    // Sync micEnabled state with local stream tracks
    useEffect(() => {
        if (stream) {
            stream.getAudioTracks().forEach((track) => {
                track.enabled = micEnabled;
            });
        }
    }, [micEnabled, stream]);

    if (!cameraEnabled || streamError || !stream) {
        return (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-[#7c3aed]/15 to-canvas-soft p-6">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.1),transparent)]" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                        <span className="font-display text-[26px] font-medium text-white">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-body-mid">
                        {!cameraEnabled ? "Camera turned off" : streamError ? "Camera offline" : "Starting camera..."}
                    </span>
                    {streamError && (
                        <span className="mt-1 text-[11px] text-[#7c3aed]/70">
                            ({streamError === "Permission Denied" || streamError.includes("permission")
                                ? "Access blocked by browser"
                                : streamError})
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full rounded-lg object-cover"
        />
    );
}

// Canvas-animated feed to represent remote participants realistically
function RemoteVideoFeed({ name, isTalking }: { name: string; isTalking: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let phase = 0;
        const speed = 0.04;
        
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);

        const render = () => {
            if (!canvas || !ctx) return;
            const width = canvas.width;
            const height = canvas.height;

            // Clear canvas with a nice studio gradient background
            const bgGradient = ctx.createLinearGradient(0, 0, width, height);
            bgGradient.addColorStop(0, `hsla(${hue}, 25%, 12%, 1)`);
            bgGradient.addColorStop(1, `#08080a`);
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Draw abstract perspective lines
            ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 50) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }
            for (let i = 0; i < height; i += 50) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(width, i);
                ctx.stroke();
            }

            // Floating glowing ambient lights
            ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.08)`;
            for (let i = 0; i < 4; i++) {
                const x = width * 0.5 + Math.cos(phase * 0.25 + i * 1.5) * (width * 0.25);
                const y = height * 0.5 + Math.sin(phase * 0.35 + i * 2) * (height * 0.25);
                const size = 20 + Math.sin(phase + i) * 6;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            const centerX = width / 2;
            const centerY = height / 2 - 10;
            
            // Halo glow for talking states
            const glowSize = 35 + (isTalking ? Math.sin(phase * 2.5) * 6 : 0);
            const haloGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, glowSize);
            haloGradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.2)`);
            haloGradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);
            ctx.fillStyle = haloGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Head silhouette
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.beginPath();
            ctx.arc(centerX, centerY - 15, 20, 0, Math.PI * 2);
            ctx.fill();

            // Shoulders silhouette
            ctx.beginPath();
            ctx.arc(centerX, centerY + 30, 35, Math.PI, 0);
            ctx.fill();

            // Audio wave representation at the bottom
            const waveY = height - 25;
            const waveAmplitude = isTalking ? 16 : 2;
            ctx.strokeStyle = `hsla(${hue}, 75%, 60%, 0.5)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 25; x <= width - 25; x += 3) {
                const normalizedX = (x - 25) / (width - 50);
                const envelope = Math.sin(normalizedX * Math.PI);
                const y = waveY + Math.sin(normalizedX * 12 + phase * 3) * waveAmplitude * envelope;
                if (x === 25) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            phase += speed;
            animationFrameId = requestAnimationFrame(render);
        };

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement?.clientWidth || 400;
            canvas.height = canvas.parentElement?.clientHeight || 300;
        };

        resizeCanvas();
        render();

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [name, isTalking]);

    return (
        <canvas
            ref={canvasRef}
            className="h-full w-full object-cover rounded-lg"
        />
    );
}

function LiveRoom() {
    const { podcastId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve name and user details from state
    const guestName = (location.state as { guestName?: string } | null)?.guestName;
    const isHost = !guestName;

    const room = useMemo(() => {
        if (podcastId === currentRoom.podcastId) {
            return currentRoom;
        }

        const podcast = podcasts.find((item) => item.id === podcastId);
        if (!podcast) {
            return currentRoom;
        }

        return {
            ...currentRoom,
            podcastId: podcast.id,
            podcastName: podcast.name,
            roomStatus: podcast.status,
        };
    }, [podcastId]);

    // Setup initial participant structure
    const localUser = {
        name: isHost ? room.creatorName : (guestName || "Guest"),
        role: isHost ? "You (Host)" : "You",
        isLocal: true,
        tone: isHost ? "from-[#ff7a17]/25 to-white/10" : "from-[#7c3aed]/25 to-white/10",
        recordingState: "recording" as const,
    };

    const initialRemotes = useMemo(() => {
        return room.participants
            .filter((p) => p.name !== localUser.name)
            .map((p) => {
                const isCreator = p.name === room.creatorName;
                return {
                    name: p.name,
                    role: isCreator ? "Host" : "Guest",
                    isLocal: false,
                    tone: isCreator ? "from-[#ff7a17]/15 to-white/5" : "from-white/10 to-white/5",
                    recordingState: p.recordingState,
                };
            });
    }, [room, localUser.name]);

    // Local user controls state
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [micEnabled, setMicEnabled] = useState(true);

    // List of active remote participants (allowing additions/removals)
    const [remoteParticipants, setRemoteParticipants] = useState(initialRemotes);

    // Track active speaking participant
    const [talkingParticipant, setTalkingParticipant] = useState<string | null>(null);

    // Cycle talking states to show dynamic call activity
    useEffect(() => {
        const interval = setInterval(() => {
            const randomVal = Math.random();
            if (randomVal < 0.3) {
                // Mic volume spike from local user
                if (micEnabled) {
                    setTalkingParticipant(localUser.name);
                } else {
                    setTalkingParticipant(null);
                }
            } else if (randomVal < 0.4) {
                setTalkingParticipant(null); // silence
            } else {
                if (remoteParticipants.length > 0) {
                    const idx = Math.floor(Math.random() * remoteParticipants.length);
                    setTalkingParticipant(remoteParticipants[idx].name);
                } else {
                    setTalkingParticipant(null);
                }
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [remoteParticipants, localUser.name, micEnabled]);

    // Dynamically calculate grid columns and max widths based on participant count
    const gridClasses = useMemo(() => {
        const count = remoteParticipants.length + 1; // +1 for localUser
        if (count === 1) return "grid-cols-1 max-w-xl mx-auto";
        if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
        if (count === 3) return "grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto";
        if (count === 4) return "grid-cols-2 max-w-4xl mx-auto";
        if (count <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }, [remoteParticipants.length]);

    // Action simulation controls
    const handleAddMockParticipant = () => {
        const nextGuest = MOCK_GUESTS_POOL[remoteParticipants.length % MOCK_GUESTS_POOL.length];
        const suffix = remoteParticipants.some(p => p.name === nextGuest) 
            ? ` ${Math.floor(Math.random() * 9) + 1}` 
            : "";
        const uniqueName = nextGuest + suffix;

        setRemoteParticipants(prev => [
            ...prev,
            {
                name: uniqueName,
                role: "Guest",
                isLocal: false,
                tone: "from-white/10 to-white/5",
                recordingState: "recording" as const,
            }
        ]);
    };

    const handleRemoveMockParticipant = () => {
        if (remoteParticipants.length > 0) {
            setRemoteParticipants(prev => prev.slice(0, -1));
        }
    };

    const handleEndSession = () => {
        // Stop any media tracks
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(s => s.getTracks().forEach(t => t.stop()))
            .catch(() => {});
        navigate(isHost ? `/dashboard/podcasts/${room.podcastId}` : "/dashboard");
    };

    return (
        <PageShell
            eyebrow="Live Room"
            title={room.podcastName}
            description="This is the shared call surface for host and guests. Video feeds resize automatically in a responsive grid so the interface works from two people to many participants."
            actions={
                <>
                    <StatusPill status={room.roomStatus} />
                    <OutlineButton href={`/dashboard/podcasts/${room.podcastId}`}>Podcast Details</OutlineButton>
                    <PrimaryButton href="/dashboard">Dashboard</PrimaryButton>
                </>
            }
        >
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Card className="p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Live session</p>
                                <h2 className="mt-2 font-display text-[26px] tracking-[-0.04em] text-white">Video calling studio</h2>
                            </div>
                            <span className="flex items-center gap-2 rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10 px-3.5 py-1.5 text-xs text-white">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                {remoteParticipants.length + 1} Connected
                            </span>
                        </div>

                        {/* Video feeds grid */}
                        <div className={`mt-6 grid gap-4 transition-all duration-300 ${gridClasses}`}>
                            {/* Local participant card */}
                            <div className={`relative aspect-video rounded-xl border overflow-hidden transition-all duration-300 ${
                                talkingParticipant === localUser.name 
                                    ? "border-white ring-2 ring-white/10" 
                                    : "border-white/10 hover:border-white/20"
                            }`}>
                                <div className="absolute inset-0 bg-canvas-soft">
                                    <LocalVideoFeed 
                                        cameraEnabled={cameraEnabled} 
                                        micEnabled={micEnabled} 
                                        name={localUser.name}
                                    />
                                </div>

                                {/* Participant overlay metadata */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-4.5 pointer-events-none">
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full bg-white/10 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase text-white/90">
                                            {localUser.role}
                                        </span>
                                        {talkingParticipant === localUser.name && (
                                            <span className="flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/30 px-2 py-0.5 text-[10px] text-green-400 font-mono uppercase">
                                                Speaking
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-white">{localUser.name}</p>
                                        <div className="flex gap-1.5">
                                            {/* Microphones state icon */}
                                            <span className={`flex h-6 w-6 items-center justify-center rounded-full backdrop-blur-md border ${
                                                micEnabled ? "bg-white/10 border-white/10 text-white" : "bg-red-500/20 border-red-500/30 text-red-400"
                                            }`}>
                                                {micEnabled ? (
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .9-1.077 1.337-1.707.707L5.586 15z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                                    </svg>
                                                )}
                                            </span>
                                            {/* Camera state icon */}
                                            <span className={`flex h-6 w-6 items-center justify-center rounded-full backdrop-blur-md border ${
                                                cameraEnabled ? "bg-white/10 border-white/10 text-white" : "bg-red-500/20 border-red-500/30 text-red-400"
                                            }`}>
                                                {cameraEnabled ? (
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Remote participants cards */}
                            {remoteParticipants.map((participant) => {
                                const isTalking = talkingParticipant === participant.name;
                                return (
                                    <div key={participant.name} className={`relative aspect-video rounded-xl border overflow-hidden transition-all duration-300 ${
                                        isTalking 
                                            ? "border-white ring-2 ring-white/10" 
                                            : "border-white/10 hover:border-white/20"
                                    }`}>
                                        <div className="absolute inset-0 bg-canvas-soft">
                                            <RemoteVideoFeed name={participant.name} isTalking={isTalking} />
                                        </div>

                                        {/* Remote participant overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-4.5 pointer-events-none">
                                            <div className="flex items-center justify-between">
                                                <span className="rounded-full bg-white/10 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase text-white/90">
                                                    {participant.role}
                                                </span>
                                                {isTalking && (
                                                    <span className="flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/30 px-2 py-0.5 text-[10px] text-green-400 font-mono uppercase animate-pulse">
                                                        Speaking
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <p className="text-sm font-medium text-white">{participant.name}</p>
                                                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-body-mid font-mono uppercase bg-black/30">
                                                    {participant.recordingState}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    {/* Primary calling controls */}
                    <Card className="p-6">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Controls</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button 
                                onClick={() => setMicEnabled(!micEnabled)}
                                className={`inline-flex items-center gap-2 justify-center rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    micEnabled 
                                        ? "border-white bg-transparent text-white hover:bg-white hover:text-canvas" 
                                        : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25"
                                }`}
                            >
                                {micEnabled ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                        Mute Mic
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .9-1.077 1.337-1.707.707L5.586 15z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                        </svg>
                                        Unmute Mic
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={() => setCameraEnabled(!cameraEnabled)}
                                className={`inline-flex items-center gap-2 justify-center rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    cameraEnabled 
                                        ? "border-white bg-transparent text-white hover:bg-white hover:text-canvas" 
                                        : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25"
                                }`}
                            >
                                {cameraEnabled ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Stop Camera
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        Start Camera
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={handleEndSession}
                                className="inline-flex items-center gap-2 justify-center rounded-full border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/25 cursor-pointer"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2 2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                                </svg>
                                {isHost ? "End Session" : "Leave Room"}
                            </button>
                        </div>
                    </Card>

                    {/* Simulation controls panel */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#7c3aed] animate-pulse"></span>
                            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Studio Simulator</p>
                        </div>
                        <p className="mt-2 text-xs text-body-mid leading-relaxed">
                            Simulate active guest audio-visual streams to verify the layout adjustments dynamically across different participant volumes.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                            <button
                                onClick={handleAddMockParticipant}
                                className="inline-flex items-center gap-1.5 justify-center rounded-full border border-white/20 bg-white/5 px-4.5 py-2 text-xs font-mono text-white transition-all hover:bg-white/10 cursor-pointer"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Add Guest
                            </button>
                            <button
                                onClick={handleRemoveMockParticipant}
                                disabled={remoteParticipants.length === 0}
                                className="inline-flex items-center gap-1.5 justify-center rounded-full border border-white/10 bg-white/5 px-4.5 py-2 text-xs font-mono text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 20a6 6 0 00-6-6H3a6 6 0 006 6v1h1v-1z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H15" />
                                </svg>
                                Remove Guest
                            </button>
                        </div>
                    </Card>

                    {/* Session details */}
                    <Card className="p-6">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Live Session Details</p>
                        <div className="mt-4 space-y-3.5 text-sm text-body-mid font-mono">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Room ID</span>
                                <span className="text-white">{room.podcastId}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Host Name</span>
                                <span className="text-white">{room.creatorName}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Joined As</span>
                                <span className="text-white">{localUser.name}</span>
                            </div>
                            <div className="flex flex-col gap-1.5 pt-1">
                                <span>Share Link</span>
                                <span className="text-white text-xs select-all bg-canvas-soft px-3 py-2 rounded-lg border border-white/5 break-all">
                                    {window.location.origin + room.inviteLink}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Help details */}
                    <Card className="p-6">
                        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-body-mid">Recording State</p>
                        <div className="mt-4 space-y-3 text-xs leading-5 text-body-mid">
                            <p>• <span className="text-white font-medium">Recording:</span> capturing audio-video feed locally in the browser.</p>
                            <p>• <span className="text-white font-medium">Uploading:</span> syncing chunks to storage buffer dynamically.</p>
                            <p>• <span className="text-white font-medium">Processing:</span> multi-track synchronization starting on host signal.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </PageShell>
    );
}

export default LiveRoom;