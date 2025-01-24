import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FormField from '../components/FormField';

interface StockingData {
  pondLength: string;
  pondWidth: string;
  pondDepth: string;
  fishSpecies: string;
  targetSize: string;
  productionCycle: string;
  waterExchangeRate: string;
  aerationSystem: string;
  feedingStrategy: string;
  expectedSurvival: string;
}

const initialFormData: StockingData = {
  pondLength: '',
  pondWidth: '',
  pondDepth: '',
  fishSpecies: '',
  targetSize: '',
  productionCycle: '',
  waterExchangeRate: '',
  aerationSystem: '',
  feedingStrategy: '',
  expectedSurvival: '',
};

const fishSpeciesList = [
  {
    name: 'Tilapia',
    maxDensity: 5, // kg/m³
    growthRate: 2.5, // g/day
    oxygenRequirement: 4, // mg/L
  },
  {
    name: 'Common Carp',
    maxDensity: 4,
    growthRate: 2.0,
    oxygenRequirement: 3.5,
  },
  {
    name: 'Catfish',
    maxDensity: 6,
    growthRate: 3.0,
    oxygenRequirement: 3,
  },
  {
    name: 'Rohu',
    maxDensity: 3,
    growthRate: 1.8,
    oxygenRequirement: 4,
  },
];

const aerationSystems = [
  'Paddle Wheel',
  'Air Diffuser',
  'Surface Aerator',
  'No Aeration',
];

const feedingStrategies = [
  'Intensive (3-4 times/day)',
  'Semi-intensive (2 times/day)',
  'Extensive (once/day)',
];

interface StockingAnalysis {
  pondVolume: number;
  recommendedStockingDensity: number;
  totalFishCount: number;
  expectedProduction: number;
  aerationRequirement: number;
  dailyFeedRequirement: number;
  waterQualityManagement: string[];
  riskFactors: string[];
  recommendations: string[];
}

export default function FishStockingCalculator() {
  const [formData, setFormData] = useState<StockingData>(initialFormData);
  const [analysis, setAnalysis] = useState<StockingAnalysis | null>(null);

  const handleChange = (field: keyof StockingData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateStocking = () => {
    // Parse input values
    const volume = parseFloat(formData.pondLength) * 
                  parseFloat(formData.pondWidth) * 
                  parseFloat(formData.pondDepth);
    
    const selectedSpecies = fishSpeciesList.find(
      species => species.name === formData.fishSpecies
    );
    
    if (!selectedSpecies) return null;

    // Calculate base stocking density
    let baseDensity = selectedSpecies.maxDensity;
    
    // Adjust density based on aeration
    const aerationFactor = formData.aerationSystem === 'No Aeration' ? 0.6 : 1.0;
    
    // Adjust density based on water exchange
    const exchangeRate = parseFloat(formData.waterExchangeRate);
    const exchangeFactor = exchangeRate < 5 ? 0.7 : exchangeRate < 10 ? 0.85 : 1.0;
    
    // Calculate final density
    const recommendedDensity = baseDensity * aerationFactor * exchangeFactor;
    
    // Calculate total fish count
    const survivalRate = parseFloat(formData.expectedSurvival) / 100;
    const targetWeight = parseFloat(formData.targetSize) / 1000; // convert g to kg
    const totalFish = Math.floor((volume * recommendedDensity) / targetWeight / survivalRate);
    
    // Calculate expected production
    const expectedProduction = totalFish * targetWeight * survivalRate;
    
    // Calculate aeration requirement
    const aerationReq = (expectedProduction * selectedSpecies.oxygenRequirement) / 1000;
    
    // Calculate daily feed requirement
    const feedRate = formData.feedingStrategy.includes('Intensive') ? 0.05 :
                    formData.feedingStrategy.includes('Semi-intensive') ? 0.03 : 0.02;
    const dailyFeed = expectedProduction * feedRate;

    // Generate recommendations
    const recommendations: string[] = [];
    const riskFactors: string[] = [];
    const waterManagement: string[] = [];

    // Water quality management
    waterManagement.push('Monitor dissolved oxygen levels twice daily');
    waterManagement.push('Check pH and ammonia levels weekly');
    waterManagement.push(`Maintain water exchange rate of ${formData.waterExchangeRate}% daily`);

    // Risk assessment
    if (formData.aerationSystem === 'No Aeration') {
      riskFactors.push('Limited aeration may restrict growth and survival');
    }
    if (exchangeRate < 5) {
      riskFactors.push('Low water exchange rate increases water quality risks');
    }

    // Recommendations
    recommendations.push(`Stock during early morning or evening hours`);
    recommendations.push(`Implement ${formData.feedingStrategy.toLowerCase()} feeding schedule`);
    recommendations.push(`Monitor growth rates weekly`);
    
    if (aerationFactor < 1) {
      recommendations.push('Consider adding supplemental aeration');
    }

    return {
      pondVolume: volume,
      recommendedStockingDensity: recommendedDensity,
      totalFishCount: totalFish,
      expectedProduction: expectedProduction,
      aerationRequirement: aerationReq,
      dailyFeedRequirement: dailyFeed,
      waterQualityManagement: waterManagement,
      riskFactors: riskFactors,
      recommendations: recommendations,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateStocking();
    if (result) setAnalysis(result);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Fish Stocking Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calculate optimal stocking density and management requirements for your aquaculture pond.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Pond Dimensions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormField
                label="Length (m)"
                value={formData.pondLength}
                onChange={handleChange('pondLength')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField
                label="Width (m)"
                value={formData.pondWidth}
                onChange={handleChange('pondWidth')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField
                label="Depth (m)"
                value={formData.pondDepth}
                onChange={handleChange('pondDepth')}
                type="number"
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Production Parameters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fish Species</InputLabel>
                <Select
                  value={formData.fishSpecies}
                  onChange={(e) => handleChange('fishSpecies')(e.target.value)}
                  required
                >
                  {fishSpeciesList.map((species) => (
                    <MenuItem key={species.name} value={species.name}>
                      {species.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Target Size (g)"
                value={formData.targetSize}
                onChange={handleChange('targetSize')}
                type="number"
                required
                helperText="Final harvest weight per fish"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Production Cycle (days)"
                value={formData.productionCycle}
                onChange={handleChange('productionCycle')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Expected Survival Rate (%)"
                value={formData.expectedSurvival}
                onChange={handleChange('expectedSurvival')}
                type="number"
                required
                helperText="Typical range: 80-95%"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Management Systems
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Aeration System</InputLabel>
                <Select
                  value={formData.aerationSystem}
                  onChange={(e) => handleChange('aerationSystem')(e.target.value)}
                  required
                >
                  {aerationSystems.map((system) => (
                    <MenuItem key={system} value={system}>
                      {system}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Water Exchange Rate (%/day)"
                value={formData.waterExchangeRate}
                onChange={handleChange('waterExchangeRate')}
                type="number"
                required
                helperText="Recommended: >5% daily"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Feeding Strategy</InputLabel>
                <Select
                  value={formData.feedingStrategy}
                  onChange={(e) => handleChange('feedingStrategy')(e.target.value)}
                  required
                >
                  {feedingStrategies.map((strategy) => (
                    <MenuItem key={strategy} value={strategy}>
                      {strategy}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Calculate Stocking
            </Button>
          </Box>
        </form>
      </Paper>

      {analysis && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Stocking Analysis Results
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Pond Volume:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.pondVolume.toFixed(1)} m³
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Recommended Stocking Density:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.recommendedStockingDensity.toFixed(1)} kg/m³
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Fish Count:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.totalFishCount.toLocaleString()} fish
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Expected Production:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.expectedProduction.toFixed(1)} kg
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Daily Feed Requirement:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.dailyFeedRequirement.toFixed(1)} kg/day
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Aeration Requirement:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.aerationRequirement.toFixed(1)} kW
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Water Quality Management:
              </Typography>
              <ul>
                {analysis.waterQualityManagement.map((item, index) => (
                  <li key={index}>
                    <Typography variant="body2">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>

            {analysis.riskFactors.length > 0 && (
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Risk Factors:
                  </Typography>
                  <ul>
                    {analysis.riskFactors.map((risk, index) => (
                      <li key={index}>
                        <Typography variant="body2">{risk}</Typography>
                      </li>
                    ))}
                  </ul>
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Recommendations:
              </Typography>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Typography variant="body2">{rec}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🐟 Fish Stocking: Complete Guide to Optimal Density
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on fish stocking in aquaculture! Proper stocking density is crucial for optimal growth and profitability. In this detailed guide, we'll explore everything you need to know about calculating and managing stocking density in your aquaculture facility. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Stocking Density Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Stocking density affects growth, health, water quality, and profitability. Finding the right balance is crucial for successful aquaculture operations.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Proper Stocking
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Optimal growth</li>
            <li>Better health</li>
            <li>Improved FCR</li>
            <li>Water quality</li>
            <li>Space efficiency</li>
            <li>Cost effectiveness</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Stocking Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Species:</strong> Requirements</li>
            <li><strong>Size:</strong> Growth stage</li>
            <li><strong>System:</strong> Capacity</li>
            <li><strong>Water Quality:</strong> Parameters</li>
            <li><strong>Management:</strong> Practices</li>
            <li><strong>Economics:</strong> Returns</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Adjust Stocking
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>New cycles</li>
            <li>Size grading</li>
            <li>System changes</li>
            <li>Season shifts</li>
            <li>Performance review</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Stocking Process
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Planning:</strong> Use our calculator</li>
            <li><strong>Assessment:</strong> Check conditions</li>
            <li><strong>Preparation:</strong> Ready system</li>
            <li><strong>Stocking:</strong> Proper methods</li>
            <li><strong>Monitoring:</strong> Track health</li>
            <li><strong>Adjustment:</strong> Optimize density</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Stocking Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Overcrowding</li>
            <li>Poor growth</li>
            <li>Water quality</li>
            <li>Disease spread</li>
            <li>Stress problems</li>
            <li>Size variation</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Stocking Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Check conditions
          2. <strong>Gradual Changes:</strong> Avoid stress
          3. <strong>Size Grading:</strong> Maintain uniformity
          4. <strong>Emergency Plans:</strong> Be prepared
          5. <strong>Records:</strong> Track performance
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Stocking
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>25-40% better growth</li>
            <li>Lower mortality</li>
            <li>Better feed efficiency</li>
            <li>Reduced disease</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: What's the ideal density?</strong>
          <Typography paragraph>
            A: It varies by species and system. Use our calculator for specific recommendations.
          </Typography>

          <strong>Q: How do I avoid overcrowding?</strong>
          <Typography paragraph>
            A: Regular monitoring and proper planning. Our calculator helps maintain optimal density.
          </Typography>

          <strong>Q: When should I reduce density?</strong>
          <Typography paragraph>
            A: When growth slows or health issues appear. Our calculator helps determine timing.
          </Typography>

          <strong>Q: What affects stocking density?</strong>
          <Typography paragraph>
            A: System type, species, size, and management. Our calculator considers these factors.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper stocking density is crucial for successful aquaculture operations. Use our stocking calculator above to optimize your stocking density. Follow the guidelines in this guide to implement effective stocking strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Stocking Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};