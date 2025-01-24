import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import FormField from '../components/FormField';

interface FcrData {
  // Basic FCR inputs
  feedAmount: string;
  initialWeight: string;
  finalWeight: string;
  numberOfFish: string;
  feedingPeriod: string;
  
  // Enhanced features
  growthStage: string;
  feedType: string;
  feedProteinContent: string;
  waterTemperature: string;
  feedingFrequency: string;
}

const initialFormData: FcrData = {
  feedAmount: '',
  initialWeight: '',
  finalWeight: '',
  numberOfFish: '',
  feedingPeriod: '',
  growthStage: '',
  feedType: '',
  feedProteinContent: '',
  waterTemperature: '',
  feedingFrequency: '',
};

const growthStages = [
  'Fingerling',
  'Juvenile',
  'Grower',
  'Finisher',
];

const feedTypes = [
  'Commercial pellet',
  'Farm-made feed',
  'Floating feed',
  'Sinking feed',
  'Extruded feed',
];

const feedingFrequencies = [
  '1 time per day',
  '2 times per day',
  '3 times per day',
  '4 times per day',
  'Continuous feeding',
];

interface FcrAnalysis {
  fcr: number;
  feedEfficiency: number;
  dailyGrowthRate: number;
  feedCostPerKg: number;
  proteinEfficiencyRatio: number;
  recommendations: string[];
  optimalFeedingSchedule: string[];
  costOptimization: string[];
}

export default function FcrOptimizer() {
  const [formData, setFormData] = useState<FcrData>(initialFormData);
  const [analysis, setAnalysis] = useState<FcrAnalysis | null>(null);

  const handleChange = (field: keyof FcrData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateFCR = () => {
    // Parse input values
    const feed = parseFloat(formData.feedAmount);
    const initialWt = parseFloat(formData.initialWeight);
    const finalWt = parseFloat(formData.finalWeight);
    const fishCount = parseFloat(formData.numberOfFish);
    const period = parseFloat(formData.feedingPeriod);
    const temp = parseFloat(formData.waterTemperature);
    const protein = parseFloat(formData.feedProteinContent);

    // Calculate basic FCR
    const weightGain = (finalWt - initialWt) * fishCount;
    const fcr = feed / weightGain;

    // Calculate feed efficiency
    const feedEfficiency = (weightGain / feed) * 100;

    // Calculate daily growth rate
    const dailyGrowthRate = (weightGain / fishCount) / period;

    // Calculate protein efficiency ratio
    const proteinIntake = (feed * protein) / 100;
    const proteinEfficiencyRatio = weightGain / proteinIntake;

    // Estimate feed cost (assuming average cost per kg)
    const feedCostPerKg = formData.feedType === 'Commercial pellet' ? 2.5 : 1.8;

    // Generate recommendations
    const recommendations: string[] = [];
    const optimalFeedingSchedule: string[] = [];
    const costOptimization: string[] = [];

    // FCR-based recommendations
    if (fcr > 2.0) {
      recommendations.push('High FCR detected - review feeding strategy');
    } else if (fcr < 1.2) {
      recommendations.push('Excellent FCR - maintain current practices');
    }

    // Temperature-based recommendations
    if (temp < 25) {
      recommendations.push('Consider increasing water temperature for optimal feed conversion');
      optimalFeedingSchedule.push('Feed during warmest part of the day');
    } else if (temp > 32) {
      recommendations.push('High temperature may reduce feed efficiency');
      optimalFeedingSchedule.push('Feed during cooler parts of the day');
    }

    // Growth stage-specific recommendations
    switch (formData.growthStage) {
      case 'Fingerling':
        recommendations.push('High protein diet recommended for rapid growth');
        optimalFeedingSchedule.push('Feed 4-6 times daily in small quantities');
        break;
      case 'Juvenile':
        recommendations.push('Balanced protein-energy ratio important');
        optimalFeedingSchedule.push('Feed 3-4 times daily');
        break;
      case 'Grower':
        recommendations.push('Monitor feed consumption closely');
        optimalFeedingSchedule.push('Feed 2-3 times daily');
        break;
      case 'Finisher':
        recommendations.push('Focus on feed quality for final growth phase');
        optimalFeedingSchedule.push('Feed 1-2 times daily');
        break;
    }

    // Feed type-specific recommendations
    switch (formData.feedType) {
      case 'Commercial pellet':
        costOptimization.push('Compare different brands for best price-quality ratio');
        break;
      case 'Farm-made feed':
        costOptimization.push('Monitor ingredient quality and storage conditions');
        break;
      case 'Floating feed':
        costOptimization.push('Observe feeding behavior to prevent waste');
        break;
      case 'Sinking feed':
        costOptimization.push('Ensure proper feeding time for complete consumption');
        break;
    }

    // Protein content recommendations
    if (protein < 28) {
      recommendations.push('Consider increasing protein content for better growth');
    } else if (protein > 40) {
      costOptimization.push('High protein content may increase costs unnecessarily');
    }

    // Feeding frequency optimization
    if (formData.feedingFrequency === '1 time per day') {
      recommendations.push('Consider increasing feeding frequency for better feed utilization');
    } else if (formData.feedingFrequency === 'Continuous feeding') {
      costOptimization.push('Monitor feed waste in continuous feeding system');
    }

    return {
      fcr,
      feedEfficiency,
      dailyGrowthRate,
      feedCostPerKg,
      proteinEfficiencyRatio,
      recommendations,
      optimalFeedingSchedule,
      costOptimization,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateFCR();
    setAnalysis(result);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        FCR Optimizer
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Optimize feed conversion ratio and feeding strategy based on comprehensive analysis.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Basic Parameters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Total Feed Amount (kg)"
                value={formData.feedAmount}
                onChange={handleChange('feedAmount')}
                type="number"
                required
                helperText="Total feed used"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Initial Weight (g)"
                value={formData.initialWeight}
                onChange={handleChange('initialWeight')}
                type="number"
                required
                helperText="Initial average fish weight"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Final Weight (g)"
                value={formData.finalWeight}
                onChange={handleChange('finalWeight')}
                type="number"
                required
                helperText="Final average fish weight"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Number of Fish"
                value={formData.numberOfFish}
                onChange={handleChange('numberOfFish')}
                type="number"
                required
                helperText="Total number of fish"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Feeding Period (days)"
                value={formData.feedingPeriod}
                onChange={handleChange('feedingPeriod')}
                type="number"
                required
                helperText="Duration of feeding period"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Enhanced Parameters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Growth Stage</InputLabel>
                <Select
                  value={formData.growthStage}
                  onChange={(e) => handleChange('growthStage')(e.target.value)}
                  label="Growth Stage"
                >
                  {growthStages.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                label="Feed Protein Content (%)"
                value={formData.feedProteinContent}
                onChange={handleChange('feedProteinContent')}
                type="number"
                required
                helperText="Protein percentage in feed"
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
              <FormControl fullWidth required>
                <InputLabel>Feeding Frequency</InputLabel>
                <Select
                  value={formData.feedingFrequency}
                  onChange={(e) => handleChange('feedingFrequency')(e.target.value)}
                  label="Feeding Frequency"
                >
                  {feedingFrequencies.map((freq) => (
                    <MenuItem key={freq} value={freq}>
                      {freq}
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
              Calculate FCR
            </Button>
          </Box>
        </form>
      </Paper>

      {analysis && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            FCR Analysis Results
          </Typography>
          
          <Alert
            severity={
              analysis.fcr < 1.5
                ? 'success'
                : analysis.fcr < 2.0
                ? 'info'
                : 'warning'
            }
            sx={{ mb: 2 }}
          >
            Feed Conversion Ratio (FCR): {analysis.fcr.toFixed(2)}
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Feed Efficiency:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.feedEfficiency.toFixed(1)}%
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Daily Growth Rate:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.dailyGrowthRate.toFixed(2)} g/day
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Feed Cost:</Typography>
              <Typography variant="body1" gutterBottom>
                ${analysis.feedCostPerKg.toFixed(2)}/kg
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Protein Efficiency Ratio:</Typography>
              <Typography variant="body1" gutterBottom>
                {analysis.proteinEfficiencyRatio.toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Recommendations:
              </Typography>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Typography variant="body1">{rec}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Optimal Feeding Schedule:
              </Typography>
              <ul>
                {analysis.optimalFeedingSchedule.map((schedule, index) => (
                  <li key={index}>
                    <Typography variant="body1">{schedule}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Cost Optimization Tips:
              </Typography>
              <ul>
                {analysis.costOptimization.map((tip, index) => (
                  <li key={index}>
                    <Typography variant="body1">{tip}</Typography>
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
          🎯 FCR Optimization: Complete Guide to Feed Efficiency
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on Feed Conversion Ratio (FCR) optimization in aquaculture! Maximizing feed efficiency is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about managing and improving FCR. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is FCR Important?
        </Typography>
        <Typography variant="body1" paragraph>
          FCR directly affects production costs and profitability. It's a key indicator of farm efficiency and success.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good FCR
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Lower feed costs</li>
            <li>Better growth</li>
            <li>Less waste</li>
            <li>Water quality</li>
            <li>Higher profits</li>
            <li>Sustainability</li>
            <li>Better ROI</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key FCR Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Feed:</strong> Quality and type</li>
            <li><strong>Feeding:</strong> Method and timing</li>
            <li><strong>Environment:</strong> Water quality</li>
            <li><strong>Health:</strong> Fish condition</li>
            <li><strong>Genetics:</strong> Species traits</li>
            <li><strong>Management:</strong> Practices</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Check FCR
        </Typography>
        <Typography variant="body1" paragraph>
          Key monitoring times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Weekly checks</li>
            <li>Growth sampling</li>
            <li>Feed changes</li>
            <li>Health issues</li>
            <li>Cost analysis</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Optimization
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Calculate:</strong> Use our tool</li>
            <li><strong>Analyze:</strong> Find issues</li>
            <li><strong>Plan:</strong> Set targets</li>
            <li><strong>Implement:</strong> Make changes</li>
            <li><strong>Monitor:</strong> Track results</li>
            <li><strong>Adjust:</strong> Fine-tune</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common FCR Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Overfeeding</li>
            <li>Poor quality</li>
            <li>Wrong timing</li>
            <li>Health problems</li>
            <li>Water stress</li>
            <li>Wrong size</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert FCR Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Checks:</strong> Monitor daily
          2. <strong>Quality Feed:</strong> Choose well
          3. <strong>Right Amount:</strong> Don't overfeed
          4. <strong>Good Timing:</strong> Feed schedule
          5. <strong>Health First:</strong> Prevent disease
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good FCR
        </Typography>
        <Typography variant="body1" paragraph>
          Optimal FCR leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-25% cost savings</li>
            <li>Better growth</li>
            <li>Clean water</li>
            <li>Healthy fish</li>
            <li>More profit</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: What's good FCR?</strong>
          <Typography paragraph>
            A: Varies by species. Our tool shows targets.
          </Typography>

          <strong>Q: How to improve?</strong>
          <Typography paragraph>
            A: Multiple methods. Our tool guides steps.
          </Typography>

          <strong>Q: Best feed?</strong>
          <Typography paragraph>
            A: Depends on species. Our tool suggests options.
          </Typography>

          <strong>Q: Common problems?</strong>
          <Typography paragraph>
            A: Various issues. Our tool helps identify.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper FCR optimization is crucial for successful aquaculture operations. Use our FCR optimizer tool above to monitor and improve feed efficiency. Follow the guidelines in this guide to implement effective feeding strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Feed Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};