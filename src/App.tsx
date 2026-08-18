import { Route, Routes } from "react-router-dom";
import { Show, RedirectToSignIn } from "@clerk/react";
import CreatePodcast from "./pages/CreatePodcast";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import LegalPage from "./pages/LegalPage";
import PodcastDetails from "./pages/PodcastDetails";
import PodcastRoom from "./pages/PodcastRoom";
import LiveRoom from "./pages/LiveRoom";

function Protected({ children }: { children: React.ReactNode }) {
    return (
        <Show when="signed-in" fallback={<RedirectToSignIn signInFallbackRedirectUrl="/dashboard" />}>
            {children}
        </Show>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/dashboard/create" element={<Protected><CreatePodcast /></Protected>} />
            <Route path="/dashboard/podcasts/:podcastId" element={<Protected><PodcastDetails /></Protected>} />
            <Route path="/dashboard/podcasts/:podcastId/room" element={<Protected><PodcastRoom /></Protected>} />
            <Route path="/join/live/:podcastId" element={<PodcastRoom />} />
            <Route path="/live/:podcastId" element={<LiveRoom />} />
            <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
            <Route path="/terms-and-conditions" element={<LegalPage title="Terms and Conditions" />} />
            <Route path="*" element={<Protected><Dashboard /></Protected>} />
        </Routes>
    );
}


export default App;
