import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import FormField from '../components/FormField';

interface FCRData {
  species: string;
  initialWeight: string;
  finalWeight: string;
  feedGiven: string;
  mortality: string;
  duration: string;
}

interface FCRResult {
  fcr: number;
  efficiency: number;
  targetFCR: number;
  deviation: number;
  recommendations: string[];
  costImplications: {
    currentCost: number;
    potentialSavings: number;
  };
}

const targetFCR = {
  tilapia: 1.6,
  carp: 1.8,
  catfish: 1.5,
  trout: 1.2,
  seabass: 1.7,
  seabream: 1.8,
};

const feedCost = 45; // USD per kg

const initialFormData: FCRData = {
  species: '',
  initialWeight: '',
  finalWeight: '',
  feedGiven: '',
  mortality: '',
  duration: '',
};

export default function FcrCalculator() {
  const [formData, setFormData] = useState<FCRData>(initialFormData);
  const [result, setResult] = useState<FCRResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field: keyof FCRData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEfficiency = (fcr: number, targetFcr: number): number => {
    return ((targetFcr - fcr) / targetFcr) * 100;
  };

  const generateRecommendations = (
    fcr: number,
    targetFcr: number,
    efficiency: number
  ): string[] => {
    const recommendations: string[] = [];

    if (fcr > targetFcr + 0.5) {
      recommendations.push('Significant improvement needed in feed management');
      recommendations.push('Review feeding frequency and portion sizes');
      recommendations.push('Check for feed wastage during feeding');
      recommendations.push('Assess water quality parameters');
    } else if (fcr > targetFcr + 0.2) {
      recommendations.push('Monitor feeding behavior more closely');
      recommendations.push('Adjust feed amounts based on appetite');
      recommendations.push('Consider feed quality and storage conditions');
    } else if (fcr > targetFcr) {
      recommendations.push('Fine-tune feeding schedule');
      recommendations.push('Continue monitoring growth rates');
      recommendations.push('Maintain current water quality');
    } else {
      recommendations.push('Maintain current feeding practices');
      recommendations.push('Document successful management strategies');
      recommendations.push('Consider sharing best practices');
    }

    if (efficiency < -20) {
      recommendations.push('Urgent action needed to improve feed efficiency');
      recommendations.push('Consider consulting a feed specialist');
    }

    return recommendations;
  };

  const calculateFCR = () => {
    const initialBiomass = parseFloat(formData.initialWeight);
    const finalBiomass = parseFloat(formData.finalWeight);
    const feedGiven = parseFloat(formData.feedGiven);
    const mortality = parseFloat(formData.mortality) || 0;
    const duration = parseInt(formData.duration);

    const biomassGain = finalBiomass - initialBiomass;
    const fcr = feedGiven / biomassGain;
    const targetFcr = targetFCR[formData.species as keyof typeof targetFCR];
    const efficiency = calculateEfficiency(fcr, targetFcr);
    const deviation = fcr - targetFcr;

    const currentCost = feedGiven * feedCost;
    const idealFeed = biomassGain * targetFcr;
    const idealCost = idealFeed * feedCost;
    const potentialSavings = fcr > targetFcr ? currentCost - idealCost : 0;

    const result: FCRResult = {
      fcr: parseFloat(fcr.toFixed(2)),
      efficiency: parseFloat(efficiency.toFixed(2)),
      targetFCR: targetFcr,
      deviation: parseFloat(deviation.toFixed(2)),
      recommendations: generateRecommendations(fcr, targetFcr, efficiency),
      costImplications: {
        currentCost: parseFloat(currentCost.toFixed(2)),
        potentialSavings: parseFloat(potentialSavings.toFixed(2)),
      },
    };

    setResult(result);
    setShowResults(true);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 0) return 'success';
    if (efficiency >= -10) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          FCR Calculator
        </Typography>
        <Typography color="text.secondary" paragraph>
          Calculate and analyze Feed Conversion Ratio for your aquaculture operation
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Species"
              value={formData.species}
              onChange={handleChange('species')}
              type="select"
              options={Object.keys(targetFCR).map((s) => ({
                value: s,
                label: s.charAt(0).toUpperCase() + s.slice(1),
              }))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Initial Weight (kg)"
              value={formData.initialWeight}
              onChange={handleChange('initialWeight')}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Final Weight (kg)"
              value={formData.finalWeight}
              onChange={handleChange('finalWeight')}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Total Feed Given (kg)"
              value={formData.feedGiven}
              onChange={handleChange('feedGiven')}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Mortality (%)"
              value={formData.mortality}
              onChange={handleChange('mortality')}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Duration (days)"
              value={formData.duration}
              onChange={handleChange('duration')}
              type="number"
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={calculateFCR}
            disabled={
              !formData.species ||
              !formData.initialWeight ||
              !formData.finalWeight ||
              !formData.feedGiven ||
              !formData.duration
            }
          >
            Calculate FCR
          </Button>
        </Box>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🎯 FCR Management: Complete Guide to Feed Efficiency
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on Feed Conversion Ratio (FCR) in aquaculture! Understanding and optimizing FCR is crucial for profitability and sustainability. In this detailed guide, we'll explore everything you need to know about managing FCR in your aquaculture facility. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is FCR Important?
        </Typography>
        <Typography variant="body1" paragraph>
          FCR directly affects feed costs and profitability. Better FCR means more efficient production, lower costs, and reduced environmental impact. It's a key indicator of farm performance.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good FCR
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Lower feed costs</li>
            <li>Better profitability</li>
            <li>Reduced waste</li>
            <li>Environmental sustainability</li>
            <li>Improved efficiency</li>
            <li>Quality enhancement</li>
            <li>Better management</li>
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
            <li><strong>Feed Quality:</strong> Nutrient content</li>
            <li><strong>Feeding Method:</strong> Technique</li>
            <li><strong>Environment:</strong> Water quality</li>
            <li><strong>Fish Health:</strong> Condition</li>
            <li><strong>Genetics:</strong> Species traits</li>
            <li><strong>Management:</strong> Practices</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Calculate FCR
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Regular intervals</li>
            <li>Feed changes</li>
            <li>Growth checks</li>
            <li>Cost analysis</li>
            <li>Performance review</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step FCR Management
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Calculation:</strong> Use our tool above</li>
            <li><strong>Analysis:</strong> Compare results</li>
            <li><strong>Planning:</strong> Set targets</li>
            <li><strong>Implementation:</strong> Make changes</li>
            <li><strong>Monitoring:</strong> Track progress</li>
            <li><strong>Adjustment:</strong> Optimize</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common FCR Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Poor feed quality</li>
            <li>Overfeeding</li>
            <li>Health problems</li>
            <li>Environmental stress</li>
            <li>Wrong feed type</li>
            <li>Management issues</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert FCR Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Track daily
          2. <strong>Feed Management:</strong> Proper storage
          3. <strong>Health Care:</strong> Disease prevention
          4. <strong>Environment:</strong> Maintain quality
          5. <strong>Records:</strong> Keep detailed data
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good FCR
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-30% cost reduction</li>
            <li>Better growth rates</li>
            <li>Less environmental impact</li>
            <li>Higher quality</li>
            <li>Increased profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: What's a good FCR?</strong>
          <Typography paragraph>
            A: It varies by species. Use our calculator to compare with industry standards.
          </Typography>

          <strong>Q: How can I improve FCR?</strong>
          <Typography paragraph>
            A: Through better feed, management, and environment. Our calculator helps track improvements.
          </Typography>

          <strong>Q: What affects FCR most?</strong>
          <Typography paragraph>
            A: Feed quality, health, and environment. Our calculator considers these factors.
          </Typography>

          <strong>Q: How often should I calculate FCR?</strong>
          <Typography paragraph>
            A: Monthly for overall trends, weekly for specific groups. Use our calculator regularly.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective FCR management is crucial for profitable aquaculture operations. Use our FCR calculator above to track and optimize your feed efficiency. Follow the guidelines in this guide to implement effective FCR management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Feed Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      {showResults && result && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  FCR Analysis
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Current FCR</TableCell>
                        <TableCell align="right">{result.fcr}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Target FCR</TableCell>
                        <TableCell align="right">{result.targetFCR}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Deviation</TableCell>
                        <TableCell align="right">{result.deviation}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Feed Efficiency</TableCell>
                        <TableCell align="right">
                          <Alert
                            severity={getEfficiencyColor(result.efficiency)}
                            sx={{ py: 0 }}
                          >
                            {result.efficiency}%
                          </Alert>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cost Analysis
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Current Feed Cost</TableCell>
                        <TableCell align="right">
                          ${result.costImplications.currentCost}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Potential Savings</TableCell>
                        <TableCell align="right">
                          ${result.costImplications.potentialSavings}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>
                      <Typography variant="body1" paragraph>
                        {rec}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}