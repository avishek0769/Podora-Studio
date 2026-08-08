import { Route, Routes } from "react-router-dom";
import CreatePodcast from "./pages/CreatePodcast";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import LegalPage from "./pages/LegalPage";
import PodcastDetails from "./pages/PodcastDetails";
import PodcastRoom from "./pages/PodcastRoom";
import LiveRoom from "./pages/LiveRoom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create" element={<CreatePodcast />} />
            <Route path="/dashboard/podcasts/:podcastId" element={<PodcastDetails />} />
            <Route path="/dashboard/podcasts/:podcastId/room" element={<PodcastRoom />} />
            <Route path="/join/live/:podcastId" element={<PodcastRoom />} />
            <Route path="/live/:podcastId" element={<LiveRoom />} />
            <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
            <Route path="/terms-and-conditions" element={<LegalPage title="Terms and Conditions" />} />
            <Route path="*" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
