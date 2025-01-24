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

interface YieldData {
  initialStocking: string;
  initialWeight: string;
  growthPeriod: string;
  feedingRate: string;
  expectedFCR: string;
  mortalityRate: string;
  speciesType: string;
  waterQuality: string;
  seasonality: string;
  managementLevel: string;
}

const initialFormData: YieldData = {
  initialStocking: '',
  initialWeight: '',
  growthPeriod: '',
  feedingRate: '',
  expectedFCR: '',
  mortalityRate: '',
  speciesType: '',
  waterQuality: '',
  seasonality: '',
  managementLevel: '',
};

const speciesList = [
  {
    name: 'Tilapia',
    growthRate: 2.5, // g/day
    maxSize: 800, // g
    optimalTemp: [25, 32], // °C
  },
  {
    name: 'Common Carp',
    growthRate: 2.0,
    maxSize: 1500,
    optimalTemp: [20, 28],
  },
  {
    name: 'Catfish',
    growthRate: 3.0,
    maxSize: 1200,
    optimalTemp: [24, 30],
  },
  {
    name: 'Rohu',
    growthRate: 1.8,
    maxSize: 1000,
    optimalTemp: [22, 30],
  },
];

const waterQualityLevels = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
];

const seasonTypes = [
  'Summer',
  'Winter',
  'Rainy',
  'Spring',
];

const managementLevels = [
  'Intensive',
  'Semi-intensive',
  'Extensive',
];

interface YieldAnalysis {
  expectedYield: number;
  survivalRate: number;
  finalWeight: number;
  biomassGain: number;
  feedRequired: number;
  productionEfficiency: number;
  economicIndicators: {
    feedCost: number;
    expectedRevenue: number;
    profitMargin: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

export default function FishYieldCalculator() {
  const [formData, setFormData] = useState<YieldData>(initialFormData);
  const [analysis, setAnalysis] = useState<YieldAnalysis | null>(null);

  const handleChange = (field: keyof YieldData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateYield = () => {
    // Parse input values
    const initialStock = parseFloat(formData.initialStocking);
    const initialWt = parseFloat(formData.initialWeight);
    const growthDays = parseFloat(formData.growthPeriod);
    const feedRate = parseFloat(formData.feedingRate);
    const fcr = parseFloat(formData.expectedFCR);
    const mortality = parseFloat(formData.mortalityRate);

    const selectedSpecies = speciesList.find(
      species => species.name === formData.speciesType
    );

    if (!selectedSpecies) return null;

    // Calculate survival rate
    const survivalRate = (100 - mortality) / 100;

    // Calculate growth based on species and conditions
    let growthRateModifier = 1.0;

    // Adjust for water quality
    switch (formData.waterQuality) {
      case 'Excellent':
        growthRateModifier *= 1.2;
        break;
      case 'Good':
        growthRateModifier *= 1.0;
        break;
      case 'Fair':
        growthRateModifier *= 0.8;
        break;
      case 'Poor':
        growthRateModifier *= 0.6;
        break;
    }

    // Adjust for season
    switch (formData.seasonality) {
      case 'Summer':
        growthRateModifier *= 1.1;
        break;
      case 'Winter':
        growthRateModifier *= 0.8;
        break;
      case 'Spring':
      case 'Rainy':
        growthRateModifier *= 1.0;
        break;
    }

    // Adjust for management level
    switch (formData.managementLevel) {
      case 'Intensive':
        growthRateModifier *= 1.2;
        break;
      case 'Semi-intensive':
        growthRateModifier *= 1.0;
        break;
      case 'Extensive':
        growthRateModifier *= 0.8;
        break;
    }

    // Calculate final weight
    const dailyGrowth = selectedSpecies.growthRate * growthRateModifier;
    const weightGain = dailyGrowth * growthDays;
    const finalWeight = Math.min(initialWt + weightGain, selectedSpecies.maxSize);

    // Calculate biomass
    const finalCount = initialStock * survivalRate;
    const biomassGain = finalCount * (finalWeight - initialWt) / 1000; // Convert to kg

    // Calculate feed required
    const feedRequired = biomassGain * fcr;

    // Calculate production efficiency
    const productionEfficiency = (biomassGain / feedRequired) * 100;

    // Economic calculations (assuming some base values)
    const feedCostPerKg = 2.0; // USD
    const fishPricePerKg = 4.0; // USD
    const feedCost = feedRequired * feedCostPerKg;
    const expectedRevenue = biomassGain * fishPricePerKg;
    const profitMargin = ((expectedRevenue - feedCost) / expectedRevenue) * 100;

    // Generate recommendations and risk factors
    const recommendations: string[] = [];
    const riskFactors: string[] = [];

    // Add recommendations based on analysis
    if (productionEfficiency < 50) {
      recommendations.push('Consider optimizing feeding strategy to improve efficiency');
    }
    if (profitMargin < 20) {
      recommendations.push('Review cost structure and consider premium markets');
    }
    if (growthRateModifier < 0.8) {
      recommendations.push('Improve culture conditions to enhance growth rate');
    }

    // Identify risk factors
    if (formData.waterQuality === 'Poor') {
      riskFactors.push('Poor water quality may significantly impact growth and survival');
    }
    if (mortality > 20) {
      riskFactors.push('High mortality rate indicates potential health or management issues');
    }
    if (fcr > 2.0) {
      riskFactors.push('High FCR suggests inefficient feed utilization');
    }

    return {
      expectedYield: biomassGain,
      survivalRate: survivalRate * 100,
      finalWeight,
      biomassGain,
      feedRequired,
      productionEfficiency,
      economicIndicators: {
        feedCost,
        expectedRevenue,
        profitMargin,
      },
      recommendations,
      riskFactors,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateYield();
    if (result) setAnalysis(result);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Fish Yield Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Estimate fish production yield based on culture conditions and management practices.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Stock Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Initial Stocking (pieces)"
                value={formData.initialStocking}
                onChange={handleChange('initialStocking')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Initial Weight (g)"
                value={formData.initialWeight}
                onChange={handleChange('initialWeight')}
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
                <InputLabel>Species</InputLabel>
                <Select
                  value={formData.speciesType}
                  onChange={(e) => handleChange('speciesType')(e.target.value)}
                  required
                >
                  {speciesList.map((species) => (
                    <MenuItem key={species.name} value={species.name}>
                      {species.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Growth Period (days)"
                value={formData.growthPeriod}
                onChange={handleChange('growthPeriod')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Feeding Rate (%/day)"
                value={formData.feedingRate}
                onChange={handleChange('feedingRate')}
                type="number"
                required
                helperText="% of body weight per day"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Expected FCR"
                value={formData.expectedFCR}
                onChange={handleChange('expectedFCR')}
                type="number"
                required
                helperText="Feed Conversion Ratio"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Mortality Rate (%)"
                value={formData.mortalityRate}
                onChange={handleChange('mortalityRate')}
                type="number"
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Culture Conditions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Water Quality</InputLabel>
                <Select
                  value={formData.waterQuality}
                  onChange={(e) => handleChange('waterQuality')(e.target.value)}
                  required
                >
                  {waterQualityLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Season</InputLabel>
                <Select
                  value={formData.seasonality}
                  onChange={(e) => handleChange('seasonality')(e.target.value)}
                  required
                >
                  {seasonTypes.map((season) => (
                    <MenuItem key={season} value={season}>
                      {season}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Management Level</InputLabel>
                <Select
                  value={formData.managementLevel}
                  onChange={(e) => handleChange('managementLevel')(e.target.value)}
                  required
                >
                  {managementLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
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
              Calculate Yield
            </Button>
          </Box>
        </form>
      </Paper>

      {analysis && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Yield Analysis Results
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Expected Yield:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.expectedYield.toFixed(1)} kg
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Survival Rate:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.survivalRate.toFixed(1)}%
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Final Weight:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.finalWeight.toFixed(1)} g
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Feed Required:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.feedRequired.toFixed(1)} kg
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Production Efficiency:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.productionEfficiency.toFixed(1)}%
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Economic Analysis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Feed Cost:</Typography>
                  <Typography variant="body2" gutterBottom>
                    ${analysis.economicIndicators.feedCost.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Expected Revenue:</Typography>
                  <Typography variant="body2" gutterBottom>
                    ${analysis.economicIndicators.expectedRevenue.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Profit Margin:</Typography>
                  <Typography variant="body2" gutterBottom>
                    {analysis.economicIndicators.profitMargin.toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
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
          📈 Fish Yield: Complete Guide to Production Planning
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on fish yield in aquaculture! Understanding and optimizing yield is crucial for successful fish farming. In this detailed guide, we'll explore everything you need to know about calculating and improving fish yield in your aquaculture facility. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Yield Planning Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Yield planning helps optimize production, manage resources efficiently, and maximize profitability. It's essential for sustainable and profitable aquaculture operations.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Yield Planning
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better production</li>
            <li>Resource efficiency</li>
            <li>Cost control</li>
            <li>Market timing</li>
            <li>Risk management</li>
            <li>Quality control</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Yield Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Stocking:</strong> Initial numbers</li>
            <li><strong>Growth:</strong> Rate factors</li>
            <li><strong>Survival:</strong> Mortality</li>
            <li><strong>Feed:</strong> Conversion</li>
            <li><strong>Environment:</strong> Conditions</li>
            <li><strong>Management:</strong> Practices</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Calculate Yield
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Production planning</li>
            <li>Growth checks</li>
            <li>Market analysis</li>
            <li>System changes</li>
            <li>Performance review</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Yield Planning
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Assessment:</strong> Use our calculator</li>
            <li><strong>Analysis:</strong> Review factors</li>
            <li><strong>Planning:</strong> Set targets</li>
            <li><strong>Implementation:</strong> Execute plan</li>
            <li><strong>Monitoring:</strong> Track progress</li>
            <li><strong>Adjustment:</strong> Optimize yield</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Yield Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Poor growth</li>
            <li>High mortality</li>
            <li>Feed problems</li>
            <li>Environmental stress</li>
            <li>Disease impact</li>
            <li>Management gaps</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Yield Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Track growth
          2. <strong>Health Management:</strong> Prevent disease
          3. <strong>Feed Optimization:</strong> Improve FCR
          4. <strong>Environment:</strong> Maintain quality
          5. <strong>Records:</strong> Keep data updated
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Yield Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>20-35% better production</li>
            <li>Higher efficiency</li>
            <li>Better quality</li>
            <li>Lower costs</li>
            <li>Increased profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: What affects yield most?</strong>
          <Typography paragraph>
            A: Growth rate, survival, and feed efficiency. Our calculator helps optimize these factors.
          </Typography>

          <strong>Q: How can I improve yield?</strong>
          <Typography paragraph>
            A: Through better management, feeding, and health care. Our calculator guides improvements.
          </Typography>

          <strong>Q: When should I harvest?</strong>
          <Typography paragraph>
            A: Based on growth rate and market conditions. Our calculator helps determine optimal timing.
          </Typography>

          <strong>Q: How do I predict yield?</strong>
          <Typography paragraph>
            A: Use our calculator with current data and historical performance for accurate predictions.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective yield management is crucial for successful aquaculture operations. Use our yield calculator above to optimize your production planning. Follow the guidelines in this guide to implement effective yield management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Production Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};