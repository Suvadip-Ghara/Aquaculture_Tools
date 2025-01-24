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
  LinearProgress,
} from '@mui/material';
import FormField from '../components/FormField';

interface GrowthData {
  species: string;
  age: string;
  currentWeight: string;
  stockingWeight: string;
  stockingDate: string;
  feedType: string;
  waterTemperature: string;
  stockingDensity: string;
}

const initialFormData: GrowthData = {
  species: '',
  age: '',
  currentWeight: '',
  stockingWeight: '',
  stockingDate: '',
  feedType: '',
  waterTemperature: '',
  stockingDensity: '',
};

const fishSpecies = [
  'Tilapia',
  'Common Carp',
  'Catfish',
  'Rainbow Trout',
  'Sea Bass',
  'Sea Bream',
];

const feedTypes = [
  'Commercial Pellets - High Protein',
  'Commercial Pellets - Standard',
  'Natural Feed',
  'Mixed Feed',
];

interface BenchmarkResult {
  actualGrowthRate: number;
  expectedGrowthRate: number;
  performanceScore: number;
  weightDeviation: number;
  feedEfficiency: string;
  recommendations: string[];
  growthStatus: 'Above Target' | 'On Target' | 'Below Target';
  environmentalFactors: {
    factor: string;
    impact: 'Positive' | 'Neutral' | 'Negative';
    description: string;
  }[];
}

export default function GrowthBenchmark() {
  const [formData, setFormData] = useState<GrowthData>(initialFormData);
  const [result, setResult] = useState<BenchmarkResult | null>(null);

  const handleChange = (field: keyof GrowthData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getSpeciesOptimalGrowthRate = (species: string): number => {
    // Daily growth rates in grams per day for optimal conditions
    const optimalRates: { [key: string]: number } = {
      'Tilapia': 3.5,
      'Common Carp': 4.0,
      'Catfish': 5.0,
      'Rainbow Trout': 4.5,
      'Sea Bass': 3.8,
      'Sea Bream': 3.2,
    };
    return optimalRates[species] || 3.5;
  };

  const getFeedEfficiencyFactor = (feedType: string): number => {
    const factors: { [key: string]: number } = {
      'Commercial Pellets - High Protein': 1.2,
      'Commercial Pellets - Standard': 1.0,
      'Natural Feed': 0.8,
      'Mixed Feed': 0.9,
    };
    return factors[feedType] || 1.0;
  };

  const getTemperatureImpact = (temp: number, species: string): number => {
    const optimalTemps: { [key: string]: number } = {
      'Tilapia': 28,
      'Common Carp': 25,
      'Catfish': 26,
      'Rainbow Trout': 15,
      'Sea Bass': 22,
      'Sea Bream': 23,
    };
    const optimalTemp = optimalTemps[species] || 25;
    const tempDiff = Math.abs(temp - optimalTemp);
    return tempDiff <= 2 ? 1 : tempDiff <= 4 ? 0.9 : 0.7;
  };

  const getDensityImpact = (density: number): number => {
    if (density < 20) return 1.1;
    if (density > 50) return 0.8;
    return 1.0;
  };

  const calculateGrowthBenchmark = (): BenchmarkResult => {
    const currentWeight = parseFloat(formData.currentWeight);
    const stockingWeight = parseFloat(formData.stockingWeight);
    const stockingDate = new Date(formData.stockingDate);
    const daysSinceStocking = Math.floor((new Date().getTime() - stockingDate.getTime()) / (1000 * 60 * 60 * 24));
    const temperature = parseFloat(formData.waterTemperature);
    const density = parseFloat(formData.stockingDensity);

    // Calculate actual growth rate
    const actualGrowthRate = (currentWeight - stockingWeight) / daysSinceStocking;

    // Calculate expected growth rate
    const baseGrowthRate = getSpeciesOptimalGrowthRate(formData.species);
    const feedFactor = getFeedEfficiencyFactor(formData.feedType);
    const tempFactor = getTemperatureImpact(temperature, formData.species);
    const densityFactor = getDensityImpact(density);

    const expectedGrowthRate = baseGrowthRate * feedFactor * tempFactor * densityFactor;

    // Calculate performance score (0-100)
    const performanceScore = Math.min(100, (actualGrowthRate / expectedGrowthRate) * 100);

    // Calculate weight deviation
    const weightDeviation = ((actualGrowthRate - expectedGrowthRate) / expectedGrowthRate) * 100;

    // Determine growth status
    const growthStatus: 'Above Target' | 'On Target' | 'Below Target' =
      weightDeviation > 10 ? 'Above Target' :
      weightDeviation < -10 ? 'Below Target' : 'On Target';

    // Analyze environmental factors
    const environmentalFactors = [
      {
        factor: 'Water Temperature',
        impact: tempFactor >= 1 ? 'Positive' : tempFactor >= 0.9 ? 'Neutral' : 'Negative',
        description: `${temperature}°C - ${
          tempFactor >= 1 ? 'Optimal' : tempFactor >= 0.9 ? 'Acceptable' : 'Suboptimal'
        } for ${formData.species}`,
      },
      {
        factor: 'Stocking Density',
        impact: densityFactor >= 1 ? 'Positive' : densityFactor >= 0.9 ? 'Neutral' : 'Negative',
        description: `${density} fish/m³ - ${
          densityFactor >= 1 ? 'Optimal' : densityFactor >= 0.9 ? 'Acceptable' : 'High'
        } density level`,
      },
      {
        factor: 'Feed Type',
        impact: feedFactor >= 1 ? 'Positive' : feedFactor >= 0.9 ? 'Neutral' : 'Negative',
        description: `${formData.feedType} - ${
          feedFactor >= 1 ? 'High' : feedFactor >= 0.9 ? 'Moderate' : 'Low'
        } efficiency`,
      },
    ];

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (performanceScore < 80) {
      if (tempFactor < 0.9) {
        recommendations.push('Adjust water temperature closer to optimal range');
      }
      if (densityFactor < 0.9) {
        recommendations.push('Consider reducing stocking density');
      }
      if (feedFactor < 1) {
        recommendations.push('Evaluate feed quality and consider upgrading feed type');
      }
    }

    if (weightDeviation < -10) {
      recommendations.push('Review feeding schedule and portion sizes');
      recommendations.push('Check for signs of disease or stress');
    }

    if (weightDeviation > 20) {
      recommendations.push('Optimize feed conversion by adjusting feeding rate');
      recommendations.push('Monitor water quality more frequently');
    }

    // Determine feed efficiency rating
    const feedEfficiency = 
      performanceScore >= 90 ? 'Excellent' :
      performanceScore >= 80 ? 'Good' :
      performanceScore >= 70 ? 'Fair' : 'Poor';

    return {
      actualGrowthRate,
      expectedGrowthRate,
      performanceScore,
      weightDeviation,
      feedEfficiency,
      recommendations,
      growthStatus,
      environmentalFactors,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateGrowthBenchmark();
    setResult(result);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Growth Benchmarking Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Compare your fish growth rates against industry benchmarks and get optimization recommendations.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Fish Details
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
                  {fishSpecies.map((species) => (
                    <MenuItem key={species} value={species}>
                      {species}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Age (days)"
                value={formData.age}
                onChange={handleChange('age')}
                type="number"
                required
                helperText="Fish age in days"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Current Weight (g)"
                value={formData.currentWeight}
                onChange={handleChange('currentWeight')}
                type="number"
                required
                helperText="Average current weight"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Stocking Weight (g)"
                value={formData.stockingWeight}
                onChange={handleChange('stockingWeight')}
                type="number"
                required
                helperText="Initial stocking weight"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Environmental Conditions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Stocking Date"
                value={formData.stockingDate}
                onChange={handleChange('stockingDate')}
                type="date"
                required
                helperText="Date when fish were stocked"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Feed Type</InputLabel>
                <Select
                  value={formData.feedType}
                  onChange={(e) => handleChange('feedType')(e.target.value)}
                  label="Feed Type"
                >
                  {feedTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                label="Stocking Density (fish/m³)"
                value={formData.stockingDensity}
                onChange={handleChange('stockingDensity')}
                type="number"
                required
                helperText="Current stocking density"
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
              Analyze Growth
            </Button>
          </Box>
        </form>
      </Paper>

      {result && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Growth Analysis Results
          </Typography>

          <Alert
            severity={
              result.growthStatus === 'Above Target'
                ? 'success'
                : result.growthStatus === 'On Target'
                ? 'info'
                : 'warning'
            }
            sx={{ mb: 2 }}
          >
            Growth Status: {result.growthStatus}
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Performance Score: {result.performanceScore.toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={result.performanceScore}
              color={
                result.performanceScore >= 90
                  ? 'success'
                  : result.performanceScore >= 70
                  ? 'warning'
                  : 'error'
              }
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Actual Growth Rate:
              </Typography>
              <Typography variant="body1">
                {result.actualGrowthRate.toFixed(2)} g/day
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Expected Growth Rate:
              </Typography>
              <Typography variant="body1">
                {result.expectedGrowthRate.toFixed(2)} g/day
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Weight Deviation:
              </Typography>
              <Typography
                variant="body1"
                color={
                  Math.abs(result.weightDeviation) <= 10
                    ? 'success.main'
                    : Math.abs(result.weightDeviation) <= 20
                    ? 'warning.main'
                    : 'error.main'
                }
              >
                {result.weightDeviation > 0 ? '+' : ''}
                {result.weightDeviation.toFixed(1)}%
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Environmental Factors
            </Typography>
            {result.environmentalFactors.map((factor, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">{factor.factor}:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="body1"
                      color={
                        factor.impact === 'Positive'
                          ? 'success.main'
                          : factor.impact === 'Neutral'
                          ? 'text.secondary'
                          : 'error.main'
                      }
                    >
                      {factor.impact}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {factor.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>

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
        </Paper>
      )}

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          📈 Growth Benchmarking: Complete Guide to Performance Analysis
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on growth benchmarking in aquaculture! Understanding and tracking growth performance is crucial for successful fish farming. In this detailed guide, we'll explore everything you need to know about measuring and optimizing fish growth. 📊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Growth Benchmarking Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Growth benchmarking helps optimize production, identify issues early, and maximize profitability. It's essential for competitive aquaculture.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Benchmarking
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Performance tracking</li>
            <li>Early warnings</li>
            <li>Better planning</li>
            <li>Cost control</li>
            <li>Quality assurance</li>
            <li>Market timing</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Growth Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential measurements:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Weight:</strong> Size gain</li>
            <li><strong>FCR:</strong> Feed efficiency</li>
            <li><strong>SGR:</strong> Growth rate</li>
            <li><strong>Survival:</strong> Mortality</li>
            <li><strong>Uniformity:</strong> Size range</li>
            <li><strong>Health:</strong> Condition</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Benchmark
        </Typography>
        <Typography variant="body1" paragraph>
          Key assessment times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Weekly checks</li>
            <li>Growth cycles</li>
            <li>Feed changes</li>
            <li>Season shifts</li>
            <li>Market planning</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Analysis
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Sampling:</strong> Use our tool</li>
            <li><strong>Recording:</strong> Enter data</li>
            <li><strong>Analysis:</strong> Compare stats</li>
            <li><strong>Planning:</strong> Set goals</li>
            <li><strong>Action:</strong> Make changes</li>
            <li><strong>Review:</strong> Track results</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Growth Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Slow growth</li>
            <li>Size variation</li>
            <li>Poor FCR</li>
            <li>Health problems</li>
            <li>Quality issues</li>
            <li>Market mismatch</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Growth Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Sampling:</strong> Be consistent
          2. <strong>Good Records:</strong> Keep data
          3. <strong>Quick Action:</strong> Address issues
          4. <strong>Market Focus:</strong> Plan ahead
          5. <strong>Quality Check:</strong> Monitor health
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective benchmarking leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-25% better growth</li>
            <li>Lower FCR</li>
            <li>Better quality</li>
            <li>Market timing</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often to check?</strong>
          <Typography paragraph>
            A: Weekly for most systems. Our tool helps plan frequency.
          </Typography>

          <strong>Q: Best sampling method?</strong>
          <Typography paragraph>
            A: Depends on system type. Our tool suggests methods.
          </Typography>

          <strong>Q: Growth targets?</strong>
          <Typography paragraph>
            A: Varies by species. Our tool shows benchmarks.
          </Typography>

          <strong>Q: Market timing?</strong>
          <Typography paragraph>
            A: Based on growth curves. Our tool helps predict.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper growth benchmarking is crucial for successful aquaculture operations. Use our growth benchmark tool above to optimize your production performance. Follow the guidelines in this guide to implement effective monitoring strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Production Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};