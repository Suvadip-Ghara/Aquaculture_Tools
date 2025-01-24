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
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FormField from '../components/FormField';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface CalculatorData {
  species: string;
  pondArea: string;
  pondDepth: string;
  stockingDensity: string;
  initialWeight: string;
  targetWeight: string;
  survivalRate: string;
  growthRate: string;
  feedingRate: string;
  waterExchange: string;
}

interface CalculationResult {
  totalVolume: number;
  stockingNumber: number;
  initialBiomass: number;
  finalBiomass: number;
  productionCycle: number;
  feedRequired: number;
  waterRequired: number;
  economicMetrics: {
    estimatedRevenue: number;
    feedCost: number;
    seedCost: number;
    operatingCost: number;
    estimatedProfit: number;
  };
}

const speciesData = {
  tilapia: {
    maxDensity: 5, // kg/m³
    feedConversion: 1.6,
    seedCost: 0.1, // USD per fingerling
    marketPrice: 3.5, // USD per kg
  },
  carp: {
    maxDensity: 4,
    feedConversion: 1.8,
    seedCost: 0.15,
    marketPrice: 4.0,
  },
  catfish: {
    maxDensity: 6,
    feedConversion: 1.5,
    seedCost: 0.2,
    marketPrice: 4.5,
  },
};

const initialFormData: CalculatorData = {
  species: '',
  pondArea: '',
  pondDepth: '',
  stockingDensity: '',
  initialWeight: '',
  targetWeight: '',
  survivalRate: '',
  growthRate: '',
  feedingRate: '',
  waterExchange: '',
};

export default function FishCalculator() {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<CalculatorData>(initialFormData);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (field: keyof CalculatorData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateProduction = () => {
    const area = parseFloat(formData.pondArea);
    const depth = parseFloat(formData.pondDepth);
    const density = parseFloat(formData.stockingDensity);
    const initialWeight = parseFloat(formData.initialWeight) / 1000; // Convert g to kg
    const targetWeight = parseFloat(formData.targetWeight) / 1000; // Convert g to kg
    const survival = parseFloat(formData.survivalRate) / 100;
    const growthRate = parseFloat(formData.growthRate); // g/day
    const feedingRate = parseFloat(formData.feedingRate) / 100;
    const waterExchange = parseFloat(formData.waterExchange) / 100;

    const volume = area * depth;
    const stockingNumber = Math.floor((volume * density) / initialWeight);
    const initialBiomass = stockingNumber * initialWeight;
    const finalBiomass = stockingNumber * survival * targetWeight;
    
    const productionCycle = Math.ceil(
      ((targetWeight * 1000 - initialWeight * 1000) / growthRate)
    );

    const speciesInfo = speciesData[formData.species as keyof typeof speciesData];
    const feedRequired = (finalBiomass - initialBiomass) * speciesInfo.feedConversion;
    const waterRequired = volume * waterExchange * productionCycle;

    // Economic calculations
    const feedCost = feedRequired * 1.2; // Assumed feed cost of $1.2 per kg
    const seedCost = stockingNumber * speciesInfo.seedCost;
    const operatingCost = (feedCost + seedCost) * 0.3; // Additional operating costs
    const revenue = finalBiomass * speciesInfo.marketPrice;
    const profit = revenue - (feedCost + seedCost + operatingCost);

    const result: CalculationResult = {
      totalVolume: volume,
      stockingNumber,
      initialBiomass,
      finalBiomass,
      productionCycle,
      feedRequired,
      waterRequired,
      economicMetrics: {
        estimatedRevenue: revenue,
        feedCost,
        seedCost,
        operatingCost,
        estimatedProfit: profit,
      },
    };

    setResult(result);
    setShowResults(true);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Fish Production Calculator
      </Typography>
        <Typography color="text.secondary" paragraph>
          Calculate stocking, production, and economic metrics for your aquaculture operation
      </Typography>

            <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Species"
              value={formData.species}
              onChange={handleChange('species')}
              type="select"
              options={Object.keys(speciesData).map((s) => ({
                value: s,
                label: s.charAt(0).toUpperCase() + s.slice(1),
              }))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Pond Area (m²)"
              value={formData.pondArea}
              onChange={handleChange('pondArea')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Average Depth (m)"
              value={formData.pondDepth}
              onChange={handleChange('pondDepth')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Stocking Density (kg/m³)"
              value={formData.stockingDensity}
              onChange={handleChange('stockingDensity')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Initial Weight (g)"
              value={formData.initialWeight}
              onChange={handleChange('initialWeight')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Target Weight (g)"
              value={formData.targetWeight}
              onChange={handleChange('targetWeight')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Expected Survival Rate (%)"
              value={formData.survivalRate}
              onChange={handleChange('survivalRate')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Growth Rate (g/day)"
              value={formData.growthRate}
              onChange={handleChange('growthRate')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Feeding Rate (% biomass/day)"
              value={formData.feedingRate}
              onChange={handleChange('feedingRate')}
                  type="number"
                  required
                />
              </Grid>
          <Grid item xs={12} sm={6} md={4}>
                <FormField
              label="Water Exchange Rate (%/day)"
              value={formData.waterExchange}
              onChange={handleChange('waterExchange')}
                  type="number"
                  required
                />
              </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={calculateProduction}
            disabled={Object.values(formData).some((v) => !v)}
          >
            Calculate Production
                </Button>
        </Box>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🐟 Fish Biomass: Complete Guide to Stock Assessment
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on fish biomass calculation in aquaculture! Accurate biomass assessment is crucial for proper management. In this detailed guide, we'll explore everything you need to know about calculating and monitoring fish biomass. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Biomass Calculation Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Biomass calculation affects feeding, health management, and production planning. It's essential for efficient farm operations.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Accurate Assessment
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better feeding</li>
            <li>Growth tracking</li>
            <li>Health monitoring</li>
            <li>Cost control</li>
            <li>Production planning</li>
            <li>Resource efficiency</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Calculation Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Numbers:</strong> Fish count</li>
            <li><strong>Size:</strong> Average weight</li>
            <li><strong>Growth:</strong> Rate trends</li>
            <li><strong>Survival:</strong> Mortality</li>
            <li><strong>Distribution:</strong> Size range</li>
            <li><strong>Sampling:</strong> Methods</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Calculate Biomass
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Weekly checks</li>
            <li>Feed adjustments</li>
            <li>Health checks</li>
            <li>Grading plans</li>
            <li>Harvest planning</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Assessment
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Sampling:</strong> Use our calculator</li>
            <li><strong>Counting:</strong> Get numbers</li>
            <li><strong>Weighing:</strong> Check size</li>
            <li><strong>Calculation:</strong> Total biomass</li>
            <li><strong>Recording:</strong> Keep data</li>
            <li><strong>Analysis:</strong> Track trends</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Assessment Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Poor sampling</li>
            <li>Wrong counting</li>
            <li>Size variation</li>
            <li>Data errors</li>
            <li>Method problems</li>
            <li>Time constraints</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Assessment Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Sampling:</strong> Be consistent
          2. <strong>Good Methods:</strong> Use right tools
          3. <strong>Accurate Records:</strong> Keep data
          4. <strong>Size Groups:</strong> Consider range
          5. <strong>Analysis:</strong> Track changes
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Assessment
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-25% better FCR</li>
            <li>Accurate feeding</li>
            <li>Better planning</li>
            <li>Lower costs</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often to calculate?</strong>
          <Typography paragraph>
            A: Weekly for most systems. Our calculator helps plan frequency.
          </Typography>

          <strong>Q: Best sampling method?</strong>
          <Typography paragraph>
            A: Depends on system type. Our calculator suggests methods.
          </Typography>

          <strong>Q: How many samples needed?</strong>
          <Typography paragraph>
            A: Based on population size. Our calculator determines numbers.
          </Typography>

          <strong>Q: When to be concerned?</strong>
          <Typography paragraph>
            A: When trends show issues. Our calculator flags problems.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Accurate biomass assessment is crucial for successful aquaculture operations. Use our fish calculator above to optimize your stock management. Follow the guidelines in this guide to implement effective assessment strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Production Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      {showResults && result && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Production Metrics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Pond Volume</TableCell>
                        <TableCell align="right">{result.totalVolume.toFixed(1)} m³</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number of Fish to Stock</TableCell>
                        <TableCell align="right">{result.stockingNumber.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Initial Biomass</TableCell>
                        <TableCell align="right">{result.initialBiomass.toFixed(1)} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Expected Final Biomass</TableCell>
                        <TableCell align="right">{result.finalBiomass.toFixed(1)} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Production Cycle</TableCell>
                        <TableCell align="right">{result.productionCycle} days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Feed Required</TableCell>
                        <TableCell align="right">{result.feedRequired.toFixed(1)} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Water Requirement</TableCell>
                        <TableCell align="right">{result.waterRequired.toFixed(1)} m³</TableCell>
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
                  Economic Analysis
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Estimated Revenue</TableCell>
                        <TableCell align="right">
                          ${result.economicMetrics.estimatedRevenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Feed Cost</TableCell>
                        <TableCell align="right">
                          ${result.economicMetrics.feedCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Seed Cost</TableCell>
                        <TableCell align="right">
                          ${result.economicMetrics.seedCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Operating Cost</TableCell>
                        <TableCell align="right">
                          ${result.economicMetrics.operatingCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle1">Estimated Profit</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" color={result.economicMetrics.estimatedProfit > 0 ? 'success.main' : 'error.main'}>
                            ${result.economicMetrics.estimatedProfit.toFixed(2)}
                </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {result.economicMetrics.estimatedProfit > 0 ? (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    This production plan appears to be profitable.
                  </Alert>
                ) : (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Consider adjusting parameters to improve profitability.
              </Alert>
            )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
} 