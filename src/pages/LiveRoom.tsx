import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import ReactPlayer from "react-player";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { SocketContext } from '../context/SocketProvider.tsx';
import * as mediasoupClient from "mediasoup-client";
import { podcasts } from "../lib/podora-data";

const Player = ReactPlayer as any;

function LiveRoom() {
    const [myStream, setMyStream] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [remoteStream, setRemoteStream] = useState<any[]>([]);
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [showUserLeftPopup, setShowUserLeftPopup] = useState<boolean>(false);
    const [device, setDevice] = useState<any>();
    const [rtpCapabilities, setRtpCapabilities] = useState<any>();
    const [producerTransport, setProducerTransport] = useState<any>();
    const [removeStream, setRemoveStream] = useState<boolean>(false);
    const [remoteAudioEnabled, setRemoteAudioEnabled] = useState<boolean>(true);
    
    // Local device controls state
    const [localMicEnabled, setLocalMicEnabled] = useState<boolean>(true);
    const [localVideoEnabled, setLocalVideoEnabled] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    const pendingVideoTracksRef = useRef<any>({});
    const pendingAudioTracksRef = useRef<any>({});
    const consumedProducerIdsRef = useRef<any>(new Set()); // prevents duplicate consumers
    const socket = useContext(SocketContext) as any;
    const navigate = useNavigate();
    const producerTransRef = useRef<boolean>(false);
    const isSendTransportConnectedRef = useRef<boolean>(false);
    const roomJoinedRef = useRef<boolean>(false);
    const producersGot = useRef<boolean>(false);
    const deviceRef = useRef<any>(null);
    const consumerTransportRef = useRef<any>([]);
    const producerTransportRef = useRef<any>([]);

    const { podcastId } = useParams();
    const podcast = podcasts.find((p) => p.id === podcastId);
    const podcastName = podcast ? podcast.name : "Live Session";
    const inviteUrl = `${window.location.origin}/join/live/${podcastId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleLocalMic = () => {
        if (myStream) {
            const audioTrack = myStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setLocalMicEnabled(audioTrack.enabled);
            }
        }
    };

    const toggleLocalVideo = () => {
        if (myStream) {
            const videoTrack = myStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setLocalVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const handleUserJoined = useCallback(({ socketId }: { socketId: string }) => {
        setRemoteSocketId(socketId);
        if (socket) {
            socket.emit("user-joined-confirm:server", { user2Id: socketId, socketId: socket.id });
        }
    }, [setRemoteSocketId, socket]);

    const handleUserJoinedConfirm = useCallback((socketId: string) => {
        setRemoteSocketId(socketId);
        console.log(`User ${socketId} was waiting !`);
    }, [setRemoteSocketId]);

    let i = 0;
    const getProducers = () => {
        if (socket) {
            socket.emit("getProducers", (peer: any) => {
                console.log("Getting Producers ", ++i, peer);
                const flatProducerIds = peer.flat();
                signalNewRecvTransport(flatProducerIds);
            });
        }
    };

    const handleProducerClose = ({ remoteProducerId }: { remoteProducerId: string }) => {
        const consumerToClose = consumerTransportRef.current.find((transportData: any) => transportData.remoteProducerId === remoteProducerId);
        consumerTransportRef.current = consumerTransportRef.current.filter((transportData: any) => transportData.remoteProducerId !== remoteProducerId);

        if (consumerToClose) {
            consumerToClose.transport.close();
            consumerToClose.consumer.close();
        }

        setRemoveStream(true);
        setShowUserLeftPopup(true);
        setTimeout(() => {
            setShowUserLeftPopup(false);
        }, 2500);
    };

    const handleNewProducer = ({ newProducers, i }: { newProducers: any, i: any }) => {
        console.log("New Producer", i, newProducers);
        signalNewRecvTransport(newProducers);
    };

    const handleCallEnd = () => {
        producerTransportRef.current.forEach((producerData: any) => {
            producerData.transport.close();
            producerData.producer.close();
        });
        consumerTransportRef.current.forEach((consumerData: any) => {
            consumerData.transport.close();
            consumerData.consumer.close();
        });
        
        if (myStream) {
            myStream.getTracks().forEach((track: any) => {
                track.stop();
            });
        }
        setMyStream(null);
        navigate("/dashboard");
        setTimeout(() => window.location.reload(), 200);
    };

    const joinRoom = () => {
        if (socket) {
            socket.emit("joinRoom", { roomId: podcastId }, (data: any) => {
                setRtpCapabilities(data.rtpCapabilities);
            });
        }
    };

    const createDevice = useCallback(async () => {
        try {
            const newDevice = new mediasoupClient.Device();
            await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
            deviceRef.current = newDevice;
            setDevice(newDevice);
            return newDevice;
        }
        catch (error: any) {
            console.log(error);
            if (error.name === 'UnsupportedError') console.warn('browser not supported');
        }
    }, [rtpCapabilities]);

    const createSendTransport = useCallback(() => {
        if (socket) {
            socket.emit("createWebRTCTransport", { consumer: false }, ({ params }: any) => {
                const producerTransport = deviceRef.current.createSendTransport(params);

                producerTransport.on("connect", async ({ dtlsParameters }: any, callback: any, errback: any) => {
                    try {
                        await socket.emit("producerTransport-connect", { dtlsParameters });
                        callback();
                    }
                    catch (error: any) {
                        errback(error);
                    }
                });

                producerTransport.on("produce", (parameters: any, callback: any, errback: any) => {
                    try {
                        socket.emit("producerTransport-produce", {
                            kind: parameters.kind,
                            rtpParameters: parameters.rtpParameters,
                            appData: parameters.appData,
                        }, ({ id, producerExists }: any) => {
                            callback({ id });
                            if (producerExists) {
                                if(!producersGot.current){
                                    getProducers();
                                    producersGot.current = true;
                                }
                            }
                        });
                    }
                    catch (error: any) {
                        errback(error);
                    }
                });
                setProducerTransport(producerTransport);
            });
        }
    }, [device, socket]);

    const connectSendTransport = useCallback(async () => {
        let videoTrack = myStream.getVideoTracks()[0];
        let audioTrack = myStream.getAudioTracks()[0];
        
        let newVideoProducer = await producerTransport.produce({ track: videoTrack });
        let newAudioProducer = await producerTransport.produce({ track: audioTrack });
        
        producerTransportRef.current = [
            {
                transport: producerTransport,
                producer: newVideoProducer,
            },
            {
                transport: producerTransport,
                producer: newAudioProducer,
            }
        ];

        newVideoProducer.on("trackend", () => {
            console.log("Video Track ended");
        });
        newVideoProducer.on("transportclose", () => {
            console.log("Video Producer Transport closed");
        });
        newAudioProducer.on("trackend", () => {
            console.log("Audio Track ended");
        });
        newAudioProducer.on("transportclose", () => {
            console.log("Audio Producer Transport closed");
        });

        setIsConnected(true);
    }, [producerTransport, myStream]);

    const signalNewRecvTransport = useCallback((remoteProducerIds: any) => {
        if (socket) {
            socket.emit("createWebRTCTransport", { consumer: true }, ({ params }: any) => {
                if (params.error) {
                    console.error(params.error);
                    return;
                }
                let consumerTransport = deviceRef.current.createRecvTransport(params);

                consumerTransport.on("connect", ({ dtlsParameters }: any, callback: any, errback: any) => {
                    try {
                        socket.emit("consumerTransport-connect", {
                            dtlsParameters,
                            serverConsumerTransportId: params.id
                        });
                        callback();
                    }
                    catch (error: any) {
                        errback(error);
                    }
                });

                remoteProducerIds.forEach((remoteProducerId: string) => {
                    connectRecvTransport(consumerTransport, remoteProducerId, params.id);
                });
            });
        }
    }, [device, socket]);

    const connectRecvTransport = useCallback((consumerTransport: any, remoteProducerId: string, serverConsumerTransportId: string) => {
        if (consumedProducerIdsRef.current.has(remoteProducerId)) {
            console.log("Already consuming producer", remoteProducerId, "— skipping");
            return;
        }
        consumedProducerIdsRef.current.add(remoteProducerId);

        if (socket) {
            socket.emit("consumerTransport-consume", {
                rtpCapabilities: deviceRef.current.rtpCapabilities,
                serverConsumerTransportId,
                remoteProducerId
            },
                async ({ params }: any) => {
                    if (params.error) {
                        console.error(params.error);
                        consumedProducerIdsRef.current.delete(remoteProducerId);
                        return;
                    }
                    let consumer = await consumerTransport.consume(params);

                    consumerTransportRef.current = [
                        ...consumerTransportRef.current,
                        {
                            transport: consumerTransport,
                            remoteProducerId,
                            consumer,
                            serverConsumerTransportId
                        }
                    ];

                    const { track } = consumer;

                    socket.emit("consumer-resume", { consumerId: consumer.id });

                    if (track.kind === "video") {
                        pendingVideoTracksRef.current[remoteProducerId] = track;
                    } else {
                        pendingAudioTracksRef.current[remoteProducerId] = track;
                    }

                    const videoKeys = Object.keys(pendingVideoTracksRef.current);
                    const audioKeys = Object.keys(pendingAudioTracksRef.current);
                    const minPaired = Math.min(videoKeys.length, audioKeys.length);
                    if (minPaired > 0) {
                        const newStreams: any[] = [];
                        for (let idx = 0; idx < minPaired; idx++) {
                            const vTrack = pendingVideoTracksRef.current[videoKeys[idx]];
                            const aTrack = pendingAudioTracksRef.current[audioKeys[idx]];
                            newStreams.push(new MediaStream([vTrack, aTrack]));
                            delete pendingVideoTracksRef.current[videoKeys[idx]];
                            delete pendingAudioTracksRef.current[audioKeys[idx]];
                        }
                        setRemoteStream(prev => [...prev, ...newStreams]);
                    }
                });
        }
    }, [device, socket]);

    useEffect(() => {
        if (rtpCapabilities) {
            createDevice();
        }
    }, [rtpCapabilities, createDevice]);

    useEffect(() => {
        if (device) {
            if (!producerTransRef.current) {
                createSendTransport();
                producerTransRef.current = true;
            }
        }
    }, [device, createSendTransport]);

    useEffect(() => {
        if (producerTransport && myStream && producerTransRef.current && !isSendTransportConnectedRef.current) {
            connectSendTransport();
            isSendTransportConnectedRef.current = true;
        }
    }, [producerTransport, myStream, connectSendTransport]);

    useEffect(() => {
        if (!myStream && !roomJoinedRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setMyStream(stream);
                });
        }
        if (myStream && !roomJoinedRef.current) {
            joinRoom();
            roomJoinedRef.current = true;
        }
    }, [myStream]);

    useEffect(() => {
        if(removeStream && remoteStream) {
            let filteredStream = remoteStream.filter((stream: any) => stream.active);
            setRemoteStream(filteredStream);
            setRemoveStream(false);
        }
    }, [remoteStream, removeStream]);

    useEffect(() => {
        if (socket) {
            socket.on("user-joined", handleUserJoined);
            socket.on("user-joined-confirm:client", handleUserJoinedConfirm);
            socket.on("new-producer", handleNewProducer);
            socket.on('producer-closed', handleProducerClose);
        }

        return () => {
            if (socket) {
                socket.off("user-joined", handleUserJoined);
                socket.off("user-joined-confirm:client", handleUserJoinedConfirm);
                socket.off("new-producer", handleNewProducer);
                socket.off('producer-closed', handleProducerClose);
            }
        };
    }, [socket, handleUserJoined, handleUserJoinedConfirm]);

    const getGridLayout = (participantCount: number) => {
        if (participantCount <= 1) return "grid-cols-1 max-w-3xl mx-auto";
        if (participantCount === 2) return "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto";
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto";
    };

    const totalParticipants = 1 + (remoteStream?.length || 0);

    return (
        <div className="h-screen w-screen bg-canvas text-white font-sans flex flex-col overflow-hidden">
            {/* User Left Popup */}
            {showUserLeftPopup && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-zinc-900 border border-rose-500/30 rounded-xl px-5 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-md">
                        <span className="text-rose-400 text-sm font-semibold">User Left Room</span>
                        <button onClick={() => setShowUserLeftPopup(false)} className="text-zinc-500 hover:text-white text-xs">✕</button>
                    </div>
                </div>
            )}

            {/* Top Bar Header */}
            <header className="px-6 py-4 border-b border-hairline/60 bg-canvas-soft/80 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="h-8 w-8 rounded-lg border border-hairline flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight text-white">{podcastName}</h1>
                        <p className="text-[10px] font-mono text-zinc-500">Room: {podcastId}</p>
                    </div>
                </div>

                {/* Invite & Status */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={inviteUrl}
                            className="bg-zinc-950 border border-hairline px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 w-52 select-all outline-none"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 border border-hairline rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/5 text-white hover:bg-white/10 transition-colors"
                        >
                            {copied ? "Copied" : "Copy Link"}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className={`h-1.5 w-1.5 rounded-full ${
                            isConnected === true ? "bg-emerald-400" :
                            isConnected === false ? "bg-amber-400" : "bg-zinc-500"
                        }`} />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                            {isConnected === true ? "Live" : isConnected === false ? "Connecting" : "Waiting"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Video Canvas Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-0 flex items-center justify-center">
                <div className={`grid gap-6 w-full ${getGridLayout(totalParticipants)}`}>
                    {/* Local Feed */}
                    <div className="aspect-video bg-zinc-900/40 border border-hairline rounded-2xl overflow-hidden relative group shadow-xl">
                        {myStream && localVideoEnabled ? (
                            <Player
                                url={myStream}
                                muted
                                playing
                                playsinline
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-zinc-950/80">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-accent-sunset/20 to-accent-dusk/20 border border-accent-sunset/30 flex items-center justify-center text-white font-bold text-lg">
                                    You
                                </div>
                                <p className="text-[11px] font-mono text-zinc-600 mt-3 uppercase tracking-wider">Camera Muted</p>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-zinc-950/70 border border-hairline/80 backdrop-blur-md px-3 py-1 rounded-lg">
                            <span className="text-xs font-semibold text-white">You</span>
                        </div>
                    </div>

                    {/* Remote Feeds */}
                    {remoteStream && remoteStream.length > 0 ? (
                        remoteStream.map((stream: any, idx: number) => (
                            <div key={idx} className="aspect-video bg-zinc-900/40 border border-hairline rounded-2xl overflow-hidden relative group shadow-xl">
                                <Player
                                    url={stream}
                                    playing
                                    muted={!remoteAudioEnabled}
                                    playsinline
                                    onError={(e: any) => console.error("Remote player error", e)}
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="absolute bottom-4 left-4 bg-zinc-950/70 border border-hairline/80 backdrop-blur-md px-3 py-1 rounded-lg">
                                    <span className="text-xs font-semibold text-white">Guest {idx + 1}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        // If participant exists but stream not paired/sent yet
                        remoteSocketId && (
                            <div className="aspect-video bg-zinc-900/40 border border-hairline rounded-2xl overflow-hidden relative flex flex-col items-center justify-center bg-zinc-950/80">
                                <div className="h-16 w-16 rounded-full bg-zinc-900 border border-hairline flex items-center justify-center text-zinc-500 font-bold text-lg">
                                    G
                                </div>
                                <p className="text-[11px] font-mono text-zinc-600 mt-3 uppercase tracking-wider">Connecting Video...</p>
                            </div>
                        )
                    )}

                    {/* Waiting placeholder if completely alone */}
                    {!remoteSocketId && (
                        <div className="aspect-video bg-zinc-900/10 border border-dashed border-hairline rounded-2xl overflow-hidden relative flex flex-col items-center justify-center">
                            <div className="h-12 w-12 rounded-full border border-dashed border-hairline flex items-center justify-center text-zinc-600 text-lg">
                                👤
                            </div>
                            <p className="text-xs text-zinc-600 mt-3 font-semibold">Waiting for guest to join...</p>
                            <p className="text-[10px] text-zinc-500 mt-1 font-mono">{inviteUrl}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Controls Panel */}
            <div className="border-t border-hairline/60 bg-canvas-soft/90 backdrop-blur-md py-4 px-6 z-10 flex items-center justify-between">
                {/* Audio Sync Status */}
                <div className="text-xs text-zinc-500 font-mono hidden md:block">
                    {isConnected === true ? "✓ WebRTC audio/video sync active" : "— Waiting for connection"}
                </div>

                {/* Main Controls */}
                <div className="flex items-center gap-3 mx-auto md:mx-0">
                    {/* Microphone Toggle */}
                    <button
                        onClick={toggleLocalMic}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                            localMicEnabled
                                ? "border-hairline bg-white/5 hover:bg-white/10 text-white"
                                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        }`}
                        title={localMicEnabled ? "Mute Mic" : "Unmute Mic"}
                    >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                            {localMicEnabled ? (
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                            ) : (
                                <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.79 1.79C13.43 15.89 12.74 16 12 16c-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                            )}
                        </svg>
                    </button>

                    {/* Camera Toggle */}
                    <button
                        onClick={toggleLocalVideo}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                            localVideoEnabled
                                ? "border-hairline bg-white/5 hover:bg-white/10 text-white"
                                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        }`}
                        title={localVideoEnabled ? "Stop Camera" : "Start Camera"}
                    >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                            {localVideoEnabled ? (
                                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                            ) : (
                                <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 3L2 4.27 4.73 7H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-.73l3.27 3.27 1.27-1.27L3.27 3zM15 17H5V9.82L12.18 17H15z" />
                            )}
                        </svg>
                    </button>

                    {/* Remote Audio Toggle */}
                    {remoteStream && remoteStream.length > 0 && (
                        <button
                            onClick={() => setRemoteAudioEnabled(prev => !prev)}
                            className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                                remoteAudioEnabled
                                    ? "border-hairline bg-white/5 hover:bg-white/10 text-white"
                                    : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                            }`}
                            title={remoteAudioEnabled ? "Mute Remote Streams" : "Unmute Remote Streams"}
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                {remoteAudioEnabled ? (
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                ) : (
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                )}
                            </svg>
                        </button>
                    )}

                    {/* End Call / Leave Button */}
                    <button
                        onClick={handleCallEnd}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-opacity shadow-lg shadow-rose-500/10 cursor-pointer flex items-center gap-2"
                    >
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        Leave
                    </button>
                </div>

                {/* Extra Actions / Status */}
                <div className="hidden md:flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        {totalParticipants} {totalParticipants === 1 ? "Participant" : "Participants"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LiveRoom;