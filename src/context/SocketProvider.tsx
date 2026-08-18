import React, { createContext, useMemo } from "react";
import { io } from "socket.io-client";
// @ts-ignore
import { SERVER_ADDRESS } from "../constants.js";

export const SocketContext = createContext<any>(null);

function SocketProvider({ children }: { children: React.ReactNode }) {
    const socket = useMemo(() => io(SERVER_ADDRESS), []);
    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export default SocketProvider;
