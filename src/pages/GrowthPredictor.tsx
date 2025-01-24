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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import FormField from '../components/FormField';

interface GrowthData {
  species: string;
  initialWeight: string;
  feedingRate: string;
  waterTemperature: string;
  growthPeriod: string;
  fcr: string;
  stockingDensity: string;
  feedCost: string;
}

const initialFormData: GrowthData = {
  species: '',
  initialWeight: '',
  feedingRate: '',
  waterTemperature: '',
  growthPeriod: '',
  fcr: '',
  stockingDensity: '',
  feedCost: '',
};

interface Species {
  name: string;
  optimalTemp: number;
  maxGrowthRate: number;
  defaultFCR: number;
  optimalDensity: number;
  temperatureTolerance: number;
}

const fishSpecies: { [key: string]: Species } = {
  'Tilapia': {
    name: 'Tilapia',
    optimalTemp: 28,
    maxGrowthRate: 3.5,
    defaultFCR: 1.6,
    optimalDensity: 20,
    temperatureTolerance: 5,
  },
  'Common Carp': {
    name: 'Common Carp',
    optimalTemp: 25,
    maxGrowthRate: 4.0,
    defaultFCR: 1.8,
    optimalDensity: 15,
    temperatureTolerance: 8,
  },
  'Catfish': {
    name: 'Catfish',
    optimalTemp: 26,
    maxGrowthRate: 5.0,
    defaultFCR: 1.4,
    optimalDensity: 25,
    temperatureTolerance: 6,
  },
  'Rainbow Trout': {
    name: 'Rainbow Trout',
    optimalTemp: 15,
    maxGrowthRate: 4.5,
    defaultFCR: 1.2,
    optimalDensity: 10,
    temperatureTolerance: 4,
  },
  'Sea Bass': {
    name: 'Sea Bass',
    optimalTemp: 22,
    maxGrowthRate: 3.8,
    defaultFCR: 1.5,
    optimalDensity: 12,
    temperatureTolerance: 5,
  },
};

interface GrowthPrediction {
  finalWeight: number;
  totalBiomass: number;
  feedConsumption: number;
  feedCost: number;
  dailyGrowthRate: number;
  efficiencyScore: number;
  recommendations: string[];
  monthlyProjections: {
    month: number;
    weight: number;
    biomass: number;
    feedRequired: number;
  }[];
  environmentalFactors: {
    factor: string;
    status: string;
    impact: string;
  }[];
}

export default function GrowthPredictor() {
  const [formData, setFormData] = useState<GrowthData>(initialFormData);
  const [result, setResult] = useState<GrowthPrediction | null>(null);

  const handleChange = (field: keyof GrowthData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateGrowthEfficiency = (
    temp: number,
    species: Species,
    density: number
  ): number => {
    // Temperature effect
    const tempDiff = Math.abs(temp - species.optimalTemp);
    const tempEffect = Math.max(0.5, 1 - (tempDiff / species.temperatureTolerance) * 0.5);

    // Density effect
    const densityEffect = Math.max(
      0.7,
      1 - Math.abs(density - species.optimalDensity) / species.optimalDensity * 0.3
    );

    return tempEffect * densityEffect;
  };

  const calculateMonthlyGrowth = (
    initialWeight: number,
    dailyGrowthRate: number,
    months: number
  ): number[] => {
    const weights: number[] = [initialWeight];
    for (let i = 1; i <= months; i++) {
      const prevWeight = weights[i - 1];
      const monthlyGrowth = prevWeight * (1 + dailyGrowthRate * 30);
      weights.push(monthlyGrowth);
    }
    return weights;
  };

  const predictGrowth = (): GrowthPrediction => {
    const species = fishSpecies[formData.species];
    const initialWeight = parseFloat(formData.initialWeight);
    const feedingRate = parseFloat(formData.feedingRate) / 100; // Convert to decimal
    const temperature = parseFloat(formData.waterTemperature);
    const growthPeriod = parseFloat(formData.growthPeriod);
    const fcr = formData.fcr ? parseFloat(formData.fcr) : species.defaultFCR;
    const density = formData.stockingDensity ? parseFloat(formData.stockingDensity) : species.optimalDensity;
    const feedCost = formData.feedCost ? parseFloat(formData.feedCost) : 0;

    // Calculate growth efficiency based on environmental conditions
    const efficiency = calculateGrowthEfficiency(temperature, species, density);

    // Calculate daily growth rate
    const baseGrowthRate = (species.maxGrowthRate / 100) * efficiency * feedingRate;
    const dailyGrowthRate = baseGrowthRate / fcr;

    // Calculate monthly projections
    const months = Math.ceil(growthPeriod / 30);
    const monthlyWeights = calculateMonthlyGrowth(initialWeight, dailyGrowthRate, months);

    // Calculate final metrics
    const finalWeight = monthlyWeights[monthlyWeights.length - 1];
    const weightGain = finalWeight - initialWeight;
    const feedConsumption = weightGain * fcr;
    const totalBiomass = finalWeight * density;

    // Generate monthly projections
    const monthlyProjections = monthlyWeights.map((weight, index) => ({
      month: index,
      weight: weight,
      biomass: weight * density,
      feedRequired: index === 0 ? 0 : (weight - monthlyWeights[index - 1]) * fcr,
    }));

    // Analyze environmental factors
    const environmentalFactors = [
      {
        factor: 'Water Temperature',
        status: `${temperature}°C (Optimal: ${species.optimalTemp}°C)`,
        impact: Math.abs(temperature - species.optimalTemp) <= species.temperatureTolerance / 2
          ? 'Optimal'
          : Math.abs(temperature - species.optimalTemp) <= species.temperatureTolerance
          ? 'Acceptable'
          : 'Suboptimal',
      },
      {
        factor: 'Stocking Density',
        status: `${density} fish/m³ (Optimal: ${species.optimalDensity})`,
        impact: Math.abs(density - species.optimalDensity) <= species.optimalDensity * 0.2
          ? 'Optimal'
          : Math.abs(density - species.optimalDensity) <= species.optimalDensity * 0.4
          ? 'Acceptable'
          : 'Suboptimal',
      },
      {
        factor: 'Feed Conversion',
        status: `FCR: ${fcr.toFixed(2)} (Default: ${species.defaultFCR})`,
        impact: fcr <= species.defaultFCR * 1.1
          ? 'Optimal'
          : fcr <= species.defaultFCR * 1.3
          ? 'Acceptable'
          : 'Suboptimal',
      },
    ];

    // Calculate efficiency score (0-100)
    const efficiencyScore = efficiency * 100;

    // Generate recommendations
    const recommendations: string[] = [];

    if (Math.abs(temperature - species.optimalTemp) > species.temperatureTolerance / 2) {
      recommendations.push('Consider temperature control measures for optimal growth');
    }

    if (Math.abs(density - species.optimalDensity) > species.optimalDensity * 0.2) {
      recommendations.push('Adjust stocking density to optimize growth and resource utilization');
    }

    if (fcr > species.defaultFCR * 1.1) {
      recommendations.push('Review feeding practices to improve feed conversion efficiency');
    }

    if (feedingRate < 0.02) {
      recommendations.push('Consider increasing feeding rate for better growth performance');
    } else if (feedingRate > 0.04) {
      recommendations.push('Monitor water quality closely with high feeding rate');
    }

    return {
      finalWeight,
      totalBiomass,
      feedConsumption,
      feedCost: feedCost * feedConsumption,
      dailyGrowthRate: baseGrowthRate,
      efficiencyScore,
      recommendations,
      monthlyProjections,
      environmentalFactors,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = predictGrowth();
    setResult(result);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Fish Growth Predictor
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Predict fish growth and plan resources based on environmental conditions and feeding practices.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Basic Parameters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Species</InputLabel>
                <Select
                  value={formData.species}
                  onChange={(e) => handleChange('species')(e.target.value)}
                  label="Species"
                >
                  {Object.keys(fishSpecies).map((species) => (
                    <MenuItem key={species} value={species}>
                      {species}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Initial Weight (g)"
                value={formData.initialWeight}
                onChange={handleChange('initialWeight')}
                type="number"
                required
                helperText="Starting weight per fish"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Feeding Rate (% body weight)"
                value={formData.feedingRate}
                onChange={handleChange('feedingRate')}
                type="number"
                required
                helperText="Daily feed as % of body weight"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Water Temperature (°C)"
                value={formData.waterTemperature}
                onChange={handleChange('waterTemperature')}
                type="number"
                required
                helperText="Average water temperature"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Growth Period (days)"
                value={formData.growthPeriod}
                onChange={handleChange('growthPeriod')}
                type="number"
                required
                helperText="Duration of growth prediction"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Optional Parameters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Feed Conversion Ratio"
                value={formData.fcr}
                onChange={handleChange('fcr')}
                type="number"
                helperText="Leave blank for species default"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Stocking Density (fish/m³)"
                value={formData.stockingDensity}
                onChange={handleChange('stockingDensity')}
                type="number"
                helperText="Leave blank for species optimal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Feed Cost ($/kg)"
                value={formData.feedCost}
                onChange={handleChange('feedCost')}
                type="number"
                helperText="Optional for cost estimation"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Predict Growth
            </Button>
          </Box>
        </form>
      </Paper>

      {result && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Growth Prediction Results
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Growth Efficiency Score: {result.efficiencyScore.toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={result.efficiencyScore}
              color={
                result.efficiencyScore >= 80
                  ? 'success'
                  : result.efficiencyScore >= 60
                  ? 'warning'
                  : 'error'
              }
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Final Weight:</TableCell>
                      <TableCell align="right">
                        {result.finalWeight.toFixed(2)} g
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Biomass:</TableCell>
                      <TableCell align="right">
                        {result.totalBiomass.toFixed(2)} kg/m³
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Feed Required:</TableCell>
                      <TableCell align="right">
                        {result.feedConsumption.toFixed(2)} kg
                      </TableCell>
                    </TableRow>
                    {result.feedCost > 0 && (
                      <TableRow>
                        <TableCell>Estimated Feed Cost:</TableCell>
                        <TableCell align="right">
                          ${result.feedCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>Daily Growth Rate:</TableCell>
                      <TableCell align="right">
                        {(result.dailyGrowthRate * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Environmental Factors
              </Typography>
              {result.environmentalFactors.map((factor, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">{factor.factor}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        {factor.status}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color={
                          factor.impact === 'Optimal'
                            ? 'success.main'
                            : factor.impact === 'Acceptable'
                            ? 'warning.main'
                            : 'error.main'
                        }
                      >
                        Impact: {factor.impact}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Projections
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Weight (g)</TableCell>
                    <TableCell align="right">Biomass (kg/m³)</TableCell>
                    <TableCell align="right">Feed Required (kg)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.monthlyProjections.map((projection) => (
                    <TableRow key={projection.month}>
                      <TableCell>{projection.month}</TableCell>
                      <TableCell align="right">
                        {projection.weight.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {projection.biomass.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {projection.feedRequired.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {result.recommendations.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations:
              </Typography>
              <ul>
                {result.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Typography variant="body1">{rec}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Paper>
      )}

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          📈 Growth Prediction: Complete Guide to Production Planning
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on growth prediction in aquaculture! Accurate growth forecasting is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about predicting and optimizing fish growth. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Growth Prediction Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Growth prediction helps optimize feeding, plan harvests, and maximize profits. It's essential for efficient farm management.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Prediction
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better planning</li>
            <li>Feed efficiency</li>
            <li>Cost control</li>
            <li>Market timing</li>
            <li>Stock management</li>
            <li>Resource use</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Growth Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Species:</strong> Growth rates</li>
            <li><strong>Feed:</strong> Quality impact</li>
            <li><strong>Water:</strong> Conditions</li>
            <li><strong>Temperature:</strong> Effects</li>
            <li><strong>Stocking:</strong> Density</li>
            <li><strong>Health:</strong> Status</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Predict Growth
        </Typography>
        <Typography variant="body1" paragraph>
          Key prediction times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Crop planning</li>
            <li>Feed ordering</li>
            <li>Market planning</li>
            <li>System changes</li>
            <li>Regular updates</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Prediction
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Data:</strong> Use our tool</li>
            <li><strong>Analysis:</strong> Check factors</li>
            <li><strong>Modeling:</strong> Project growth</li>
            <li><strong>Planning:</strong> Set targets</li>
            <li><strong>Monitoring:</strong> Track progress</li>
            <li><strong>Adjustment:</strong> Update plans</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Growth Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Slow growth</li>
            <li>Size variation</li>
            <li>Feed waste</li>
            <li>Poor conversion</li>
            <li>Health impacts</li>
            <li>System limits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Growth Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Track growth
          2. <strong>Data Use:</strong> Make decisions
          3. <strong>Feed Management:</strong> Optimize
          4. <strong>Environment Control:</strong> Maintain
          5. <strong>Health Focus:</strong> Prevent issues
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Prediction
        </Typography>
        <Typography variant="body1" paragraph>
          Effective prediction leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-25% better FCR</li>
            <li>Optimal growth</li>
            <li>Cost savings</li>
            <li>Market timing</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How to predict growth?</strong>
          <Typography paragraph>
            A: Multiple factors matter. Our tool guides prediction.
          </Typography>

          <strong>Q: Best growth rates?</strong>
          <Typography paragraph>
            A: Varies by species. Our tool shows benchmarks.
          </Typography>

          <strong>Q: Feed impact?</strong>
          <Typography paragraph>
            A: Critical factor. Our tool calculates effects.
          </Typography>

          <strong>Q: Environment effects?</strong>
          <Typography paragraph>
            A: Major influence. Our tool models impacts.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper growth prediction is crucial for successful aquaculture operations. Use our growth predictor tool above to optimize your production. Follow the guidelines in this guide to implement effective growth management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Growth Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};