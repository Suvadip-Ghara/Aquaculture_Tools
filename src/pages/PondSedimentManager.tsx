import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SedimentData {
  pondArea: number;
  pondDepth: number;
  sedimentDepth: number;
  sedimentType: string;
  organicContent: number;
  pondAge: number;
  lastCleaned: number;
  feedingRate: number;
  stockingDensity: number;
  waterExchangeRate: number;
}

interface SedimentAnalysis {
  totalVolume: number;
  removalRequired: boolean;
  disposalMethod: string;
  estimatedCost: number;
  nutrientContent: {
    nitrogen: number;
    phosphorus: number;
    organicMatter: number;
  };
  recommendations: string[];
  managementPlan: string[];
  preventiveMeasures: string[];
  timeline: string;
}

const sedimentTypes = {
  sandy: { density: 1500, nutrientRetention: 0.6, description: 'Sandy sediment with low nutrient content' },
  loamy: { density: 1300, nutrientRetention: 0.8, description: 'Loamy sediment with moderate nutrient content' },
  clayey: { density: 1200, nutrientRetention: 0.9, description: 'Clay-rich sediment with high nutrient retention' },
  organic: { density: 1100, nutrientRetention: 1.0, description: 'Highly organic sediment' },
};

const disposalMethods = {
  agricultural: { cost: 10, description: 'Use as agricultural fertilizer' },
  landfill: { cost: 30, description: 'Disposal at landfill' },
  composting: { cost: 20, description: 'Composting and soil amendment' },
  landReclamation: { cost: 15, description: 'Use in land reclamation projects' },
};

const initialFormData: SedimentData = {
  pondArea: 0,
  pondDepth: 0,
  sedimentDepth: 0,
  sedimentType: '',
  organicContent: 0,
  pondAge: 0,
  lastCleaned: 0,
  feedingRate: 0,
  stockingDensity: 0,
  waterExchangeRate: 0,
};

const PondSedimentManager: React.FC = () => {
  const [formData, setFormData] = useState<SedimentData>(initialFormData);
  const [analysis, setAnalysis] = useState<SedimentAnalysis | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; depth: number }>>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value),
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateSedimentAnalysis = () => {
    const {
      pondArea,
      pondDepth,
      sedimentDepth,
      sedimentType,
      organicContent,
      pondAge,
      lastCleaned,
      feedingRate,
      stockingDensity,
      waterExchangeRate,
    } = formData;

    // Calculate total sediment volume
    const totalVolume = pondArea * sedimentDepth;

    // Determine if removal is required based on multiple factors
    const depthRatio = sedimentDepth / pondDepth;
    const timeFactor = lastCleaned > 2;
    const organicFactor = organicContent > 30;
    const removalRequired = depthRatio > 0.2 || timeFactor || organicFactor;

    // Select disposal method based on sediment characteristics
    let disposalMethod = 'agricultural';
    if (organicContent > 40) {
      disposalMethod = 'composting';
    } else if (organicContent < 10) {
      disposalMethod = 'landReclamation';
    }

    // Calculate nutrient content
    const sedimentInfo = sedimentTypes[sedimentType as keyof typeof sedimentTypes];
    const nutrientContent = {
      nitrogen: totalVolume * sedimentInfo.nutrientRetention * (organicContent / 100) * 0.05,
      phosphorus: totalVolume * sedimentInfo.nutrientRetention * (organicContent / 100) * 0.02,
      organicMatter: totalVolume * sedimentInfo.nutrientRetention * (organicContent / 100),
    };

    // Calculate estimated cost
    const removalCost = totalVolume * 5; // Base removal cost
    const disposalCost = totalVolume * disposalMethods[disposalMethod as keyof typeof disposalMethods].cost;
    const totalCost = removalCost + disposalCost;

    // Generate recommendations
    const recommendations = [];
    if (depthRatio > 0.2) {
      recommendations.push('Immediate sediment removal recommended due to high accumulation');
    }
    if (organicContent > 30) {
      recommendations.push('High organic content indicates need for improved feeding management');
    }
    if (waterExchangeRate < 10) {
      recommendations.push('Increase water exchange rate to reduce sediment accumulation');
    }

    // Generate management plan
    const managementPlan = [
      'Regular monitoring of sediment depth',
      'Optimize feeding practices to reduce waste',
      'Maintain proper water exchange',
      'Schedule periodic sediment removal',
      'Monitor water quality parameters',
    ];

    // Generate preventive measures
    const preventiveMeasures = [
      'Implement proper feeding management',
      'Maintain optimal stocking density',
      'Regular water quality monitoring',
      'Use high-quality feeds',
      'Install sediment traps',
    ];

    // Determine timeline
    let timeline = 'Annual removal recommended';
    if (depthRatio > 0.3) {
      timeline = 'Immediate removal required';
    } else if (depthRatio < 0.1) {
      timeline = 'Monitor and reassess in 6 months';
    }

    // Add to historical data
    const newDataPoint = {
      date: new Date().toISOString().split('T')[0],
      depth: sedimentDepth,
    };
    setHistoricalData(prev => [...prev, newDataPoint]);

    setAnalysis({
      totalVolume,
      removalRequired,
      disposalMethod,
      estimatedCost: totalCost,
      nutrientContent,
      recommendations,
      managementPlan,
      preventiveMeasures,
      timeline,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pond Sediment Manager
        </Typography>
        <Typography variant="body1" paragraph>
          Monitor and manage pond sediment accumulation for optimal pond health
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pond Parameters
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pond Area (m²)"
                      name="pondArea"
                      type="number"
                      value={formData.pondArea || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pond Depth (m)"
                      name="pondDepth"
                      type="number"
                      value={formData.pondDepth || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Sediment Depth (m)"
                      name="sedimentDepth"
                      type="number"
                      value={formData.sedimentDepth || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Sediment Type</InputLabel>
                      <Select
                        name="sedimentType"
                        value={formData.sedimentType}
                        label="Sediment Type"
                        onChange={handleSelectChange}
                      >
                        {Object.entries(sedimentTypes).map(([key, { description }]) => (
                          <MenuItem key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Organic Content (%)"
                      name="organicContent"
                      type="number"
                      value={formData.organicContent || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pond Age (years)"
                      name="pondAge"
                      type="number"
                      value={formData.pondAge || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Years Since Last Cleaned"
                      name="lastCleaned"
                      type="number"
                      value={formData.lastCleaned || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Daily Feeding Rate (kg)"
                      name="feedingRate"
                      type="number"
                      value={formData.feedingRate || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stocking Density (fish/m³)"
                      name="stockingDensity"
                      type="number"
                      value={formData.stockingDensity || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Water Exchange Rate (%/day)"
                      name="waterExchangeRate"
                      type="number"
                      value={formData.waterExchangeRate || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  onClick={calculateSedimentAnalysis}
                  disabled={!formData.pondArea || !formData.pondDepth || !formData.sedimentDepth || !formData.sedimentType}
                  sx={{ mt: 2 }}
                >
                  Analyze Sediment
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {analysis && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sediment Analysis Results
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Sediment Volume</TableCell>
                          <TableCell>{analysis.totalVolume.toFixed(2)} m³</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Removal Required</TableCell>
                          <TableCell>{analysis.removalRequired ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Recommended Disposal Method</TableCell>
                          <TableCell>{analysis.disposalMethod}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Estimated Cost</TableCell>
                          <TableCell>${analysis.estimatedCost.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Nutrient Content
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Nitrogen</TableCell>
                          <TableCell>{analysis.nutrientContent.nitrogen.toFixed(2)} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Phosphorus</TableCell>
                          <TableCell>{analysis.nutrientContent.phosphorus.toFixed(2)} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Organic Matter</TableCell>
                          <TableCell>{analysis.nutrientContent.organicMatter.toFixed(2)} kg</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Timeline: {analysis.timeline}
                    </Typography>
                  </Alert>

                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Recommendations:
                    </Typography>
                    <ul>
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </Alert>

                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Management Plan:
                    </Typography>
                    <ul>
                      {analysis.managementPlan.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </Alert>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Preventive Measures:
                    </Typography>
                    <ul>
                      {analysis.preventiveMeasures.map((measure, index) => (
                        <li key={index}>{measure}</li>
                      ))}
                    </ul>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          )}

          {historicalData.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sediment Accumulation History
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Sediment Depth (m)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="depth" stroke="#8884d8" name="Sediment Depth" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🌊 Pond Sediment: Complete Guide to Bottom Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on pond sediment management in aquaculture! Proper sediment control is crucial for pond health and productivity. In this detailed guide, we'll explore everything you need to know about managing pond bottom conditions. 🏊‍♂️
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Sediment Management Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Sediment management affects water quality, fish health, and pond productivity. It's essential for maintaining optimal growing conditions.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Management
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better water quality</li>
            <li>Healthier fish</li>
            <li>Higher production</li>
            <li>Less disease</li>
            <li>Easier harvest</li>
            <li>Lower costs</li>
            <li>Longer pond life</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Sediment Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Depth:</strong> Accumulation</li>
            <li><strong>Type:</strong> Material composition</li>
            <li><strong>Source:</strong> Origin points</li>
            <li><strong>Impact:</strong> Effects</li>
            <li><strong>Removal:</strong> Methods</li>
            <li><strong>Prevention:</strong> Control</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Manage Sediment
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for management:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Between cycles</li>
            <li>Heavy buildup</li>
            <li>Quality issues</li>
            <li>Before stocking</li>
            <li>Regular maintenance</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Management
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Assessment:</strong> Use our calculator</li>
            <li><strong>Planning:</strong> Strategy development</li>
            <li><strong>Preparation:</strong> Get equipment</li>
            <li><strong>Removal:</strong> Apply methods</li>
            <li><strong>Disposal:</strong> Proper handling</li>
            <li><strong>Prevention:</strong> Future control</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Sediment Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Excess buildup</li>
            <li>Poor quality</li>
            <li>Oxygen depletion</li>
            <li>Disease problems</li>
            <li>Harvest difficulty</li>
            <li>Cost increases</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Management Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Check depth
          2. <strong>Aeration:</strong> Keep mixing
          3. <strong>Feed Management:</strong> Reduce waste
          4. <strong>Water Flow:</strong> Maintain circulation
          5. <strong>Documentation:</strong> Track changes
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>25-40% better production</li>
            <li>Cleaner water</li>
            <li>Healthier fish</li>
            <li>Lower costs</li>
            <li>Better sustainability</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often to remove sediment?</strong>
          <Typography paragraph>
            A: Depends on accumulation rate. Our calculator helps determine timing.
          </Typography>

          <strong>Q: Best removal method?</strong>
          <Typography paragraph>
            A: Varies by pond type and sediment. Our calculator suggests methods.
          </Typography>

          <strong>Q: How to prevent buildup?</strong>
          <Typography paragraph>
            A: Through proper management practices. Our calculator guides prevention.
          </Typography>

          <strong>Q: When to be concerned?</strong>
          <Typography paragraph>
            A: When depth affects quality or health. Our calculator shows critical levels.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective sediment management is crucial for successful aquaculture operations. Use our sediment calculator above to optimize your pond bottom management. Follow the guidelines in this guide to implement effective control strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Pond Management Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default PondSedimentManager; 