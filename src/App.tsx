import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage"
import LegalPage from "./pages/LegalPage"

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
            <Route path="/terms-and-conditions" element={<LegalPage title="Terms and Conditions" />} />
            <Route path="*" element={<LandingPage />} />
        </Routes>
    );
}

export default App;
