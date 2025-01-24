import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Team from './pages/Team';
import WaterQualityPredictor from './pages/WaterQualityPredictor';
import EnvironmentalMonitor from './pages/EnvironmentalMonitor';
import FeedManagement from './pages/FeedManagement';
import GrowthTracker from './pages/GrowthTracker';
import DiseasePrevention from './pages/DiseasePrevention';
import InventoryManagement from './pages/InventoryManagement';
import MarketAnalysis from './pages/MarketAnalysis';
import SpeciesSuitability from './pages/SpeciesSuitability';
import PondSedimentManager from './pages/PondSedimentManager';
import HarvestTimingAdvisor from './pages/HarvestTimingAdvisor';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/water-quality-predictor" element={<WaterQualityPredictor />} />
            <Route path="/environmental-monitor" element={<EnvironmentalMonitor />} />
            <Route path="/feed-management" element={<FeedManagement />} />
            <Route path="/growth-tracker" element={<GrowthTracker />} />
            <Route path="/disease-prevention" element={<DiseasePrevention />} />
            <Route path="/inventory-management" element={<InventoryManagement />} />
            <Route path="/market-analysis" element={<MarketAnalysis />} />
            <Route path="/species-suitability" element={<SpeciesSuitability />} />
            <Route path="/pond-sediment-manager" element={<PondSedimentManager />} />
            <Route path="/harvest-timing-advisor" element={<HarvestTimingAdvisor />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
