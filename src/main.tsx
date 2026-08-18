import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import "./index.css";
import App from "./App";
import SocketProvider from "./context/SocketProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SocketProvider>
            <ClerkProvider publishableKey={PUBLISHABLE_KEY || ""}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ClerkProvider>
        </SocketProvider>
    </StrictMode>,
);
