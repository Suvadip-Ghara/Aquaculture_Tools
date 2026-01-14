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
import WaterQuality from './pages/WaterQuality';
import WaterQualityMonitor from './pages/WaterQualityMonitor';
import PondEvaporationCalculator from './pages/PondEvaporationCalculator';
import PondLimingCalculator from './pages/PondLimingCalculator';
import PondLiningCalculator from './pages/PondLiningCalculator';
import GrowthBenchmark from './pages/GrowthBenchmark';
import GrowthPredictor from './pages/GrowthPredictor';
import FishStressIndicator from './pages/FishStressIndicator';
import FishCalculator from './pages/FishCalculator';
import FishStockingCalculator from './pages/FishStockingCalculator';
import FishYieldCalculator from './pages/FishYieldCalculator';
import FcrCalculator from './pages/FcrCalculator';
import FcrOptimizer from './pages/FcrOptimizer';
import FeedingCalculator from './pages/FeedingCalculator';
import DiseaseRiskAssessment from './pages/DiseaseRiskAssessment';
import WasteFertilizerCalculator from './pages/WasteFertilizerCalculator';
import EnergyEfficiencyCalculator from './pages/EnergyEfficiencyCalculator';
import WeatherImpactAnalyzer from './pages/WeatherImpactAnalyzer';
import AerationCalculator from './pages/AerationCalculator';
import ProfitabilityCalculator from './pages/ProfitabilityCalculator';
import ReportGenerator from './pages/ReportGenerator';
import ProductionCalendar from './pages/ProductionCalendar';
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

            {/* Water Management */}
            <Route path="/water-quality" element={<WaterQuality />} />
            <Route path="/water-quality-monitor" element={<WaterQualityMonitor />} />
            <Route path="/water-quality-predictor" element={<WaterQualityPredictor />} />
            <Route path="/pond-evaporation" element={<PondEvaporationCalculator />} />
            <Route path="/pond-sediment" element={<PondSedimentManager />} />
            <Route path="/pond-liming" element={<PondLimingCalculator />} />
            <Route path="/pond-lining" element={<PondLiningCalculator />} />

            {/* Fish Management */}
            <Route path="/growth-tracker" element={<GrowthTracker />} />
            <Route path="/growth-benchmark" element={<GrowthBenchmark />} />
            <Route path="/growth-predictor" element={<GrowthPredictor />} />
            <Route path="/fish-stress" element={<FishStressIndicator />} />
            <Route path="/fish-calculator" element={<FishCalculator />} />
            <Route path="/fish-stocking" element={<FishStockingCalculator />} />
            <Route path="/fish-yield" element={<FishYieldCalculator />} />

            {/* Feed Management */}
            <Route path="/feed-management" element={<FeedManagement />} />
            <Route path="/fcr-calculator" element={<FcrCalculator />} />
            <Route path="/fcr-optimizer" element={<FcrOptimizer />} />
            <Route path="/feeding-calculator" element={<FeedingCalculator />} />

            {/* Health Management */}
            <Route path="/disease-prevention" element={<DiseasePrevention />} />
            <Route path="/disease-risk" element={<DiseaseRiskAssessment />} />
            <Route path="/waste-fertilizer" element={<WasteFertilizerCalculator />} />

            {/* Environment */}
            <Route path="/environmental-monitor" element={<EnvironmentalMonitor />} />
            <Route path="/energy-efficiency" element={<EnergyEfficiencyCalculator />} />
            <Route path="/weather-impact" element={<WeatherImpactAnalyzer />} />
            <Route path="/aeration-calculator" element={<AerationCalculator />} />

            {/* Business Tools */}
            <Route path="/market-analysis" element={<MarketAnalysis />} />
            <Route path="/profitability" element={<ProfitabilityCalculator />} />
            <Route path="/harvest-timing" element={<HarvestTimingAdvisor />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/reports" element={<ReportGenerator />} />
            <Route path="/calendar" element={<ProductionCalendar />} />

            <Route path="/species-suitability" element={<SpeciesSuitability />} />
            <Route path="/pond-sediment-manager" element={<PondSedimentManager />} />
            <Route path="/harvest-timing-advisor" element={<HarvestTimingAdvisor />} />
            <Route path="/inventory-management" element={<InventoryManagement />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
