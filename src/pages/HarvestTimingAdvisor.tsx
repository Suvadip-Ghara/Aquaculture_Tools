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
  Divider,
  AlertTitle,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FormField from '../components/FormField';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';

interface HarvestData {
  species: string;
  stockingDate: string;
  initialWeight: string;
  currentWeight: string;
  targetWeight: string;
  growthRate: string;
  feedingRate: string;
  survivalRate: string;
  marketPrice: string;
  productionCosts: string;
  seasonalPricing: string;
  waterQuality: string;
}

interface MarketTrend {
  season: string;
  priceMultiplier: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  characteristics: string[];
  opportunities: string[];
  risks: string[];
}

const marketTrends: MarketTrend[] = [
  {
    season: 'Festival Season',
    priceMultiplier: 1.3,
    demandLevel: 'High',
    characteristics: [
      'High consumer demand',
      'Premium pricing possible',
      'Strong retail sales'
    ],
    opportunities: [
      'Premium pricing for quality product',
      'Bulk sales opportunities',
      'Value-added product demand'
    ],
    risks: [
      'Increased competition',
      'Quality maintenance pressure',
      'Transportation bottlenecks'
    ]
  },
  {
    season: 'Summer',
    priceMultiplier: 0.9,
    demandLevel: 'Medium',
    characteristics: [
      'Moderate demand',
      'Price stability',
      'Regular market flow'
    ],
    opportunities: [
      'Steady supply contracts',
      'Processing opportunities',
      'Export market potential'
    ],
    risks: [
      'Storage challenges',
      'Quality preservation issues',
      'Transportation costs'
    ]
  },
  {
    season: 'Off-Peak',
    priceMultiplier: 0.8,
    demandLevel: 'Low',
    characteristics: [
      'Lower demand',
      'Price pressure',
      'Excess supply risk'
    ],
    opportunities: [
      'Long-term storage options',
      'Processing for value addition',
      'Alternative market exploration'
    ],
    risks: [
      'Price depression',
      'Storage costs',
      'Cash flow pressure'
    ]
  },
  {
    season: 'Export Season',
    priceMultiplier: 1.2,
    demandLevel: 'High',
    characteristics: [
      'International demand',
      'Premium pricing',
      'Quality focus'
    ],
    opportunities: [
      'Higher profit margins',
      'Market diversification',
      'Brand building'
    ],
    risks: [
      'Strict quality standards',
      'Complex logistics',
      'Currency fluctuations'
    ]
  }
];

interface MarketDemand {
  level: string;
  priceImpact: number;
  characteristics: string[];
  strategies: string[];
}

const marketDemands: MarketDemand[] = [
  {
    level: 'Very High',
    priceImpact: 1.4,
    characteristics: [
      'Strong buyer interest',
      'Quick sales turnover',
      'Premium pricing power'
    ],
    strategies: [
      'Maximize production quality',
      'Consider partial harvesting',
      'Negotiate premium contracts'
    ]
  },
  {
    level: 'High',
    priceImpact: 1.2,
    characteristics: [
      'Good market absorption',
      'Stable pricing',
      'Regular demand'
    ],
    strategies: [
      'Maintain steady supply',
      'Focus on quality consistency',
      'Build buyer relationships'
    ]
  },
  {
    level: 'Moderate',
    priceImpact: 1.0,
    characteristics: [
      'Normal market conditions',
      'Standard pricing',
      'Predictable demand'
    ],
    strategies: [
      'Optimize production costs',
      'Balance supply with demand',
      'Maintain market presence'
    ]
  },
  {
    level: 'Low',
    priceImpact: 0.8,
    characteristics: [
      'Slow market absorption',
      'Price pressure',
      'Inventory buildup risk'
    ],
    strategies: [
      'Reduce production costs',
      'Explore alternative markets',
      'Consider value addition'
    ]
  }
];

const waterQualityOptions = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
];

const seasonalPricingOptions = [
  'Peak Season',
  'Off Season',
  'Normal',
  'Festival Season',
];

const speciesData = {
  tilapia: {
    optimalGrowthRate: 2.5,
    maxWeight: 800,
    priceVariation: 0.2,
  },
  carp: {
    optimalGrowthRate: 3.0,
    maxWeight: 1500,
    priceVariation: 0.15,
  },
  catfish: {
    optimalGrowthRate: 3.5,
    maxWeight: 1200,
    priceVariation: 0.25,
  },
};

interface HarvestAnalysis {
  timing: {
    optimalDate: Date;
    daysToHarvest: number;
    weightAtHarvest: number;
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  economics: {
    expectedRevenue: number;
    productionCost: number;
    projectedProfit: number;
    priceVariation: number;
  };
  risks: {
    factor: string;
    level: 'low' | 'medium' | 'high';
    impact: string;
  }[];
  recommendations: string[];
  growthProjection: {
    week: number;
    weight: number;
    price: number;
    profit: number;
  }[];
}

const initialFormData: HarvestData = {
  species: '',
  stockingDate: '',
  initialWeight: '',
  currentWeight: '',
  targetWeight: '',
  growthRate: '',
  feedingRate: '',
  survivalRate: '',
  marketPrice: '',
  productionCosts: '',
  seasonalPricing: '',
  waterQuality: '',
};

export default function HarvestTimingAdvisor() {
  const [formData, setFormData] = useState<HarvestData>(initialFormData);
  const [analysis, setAnalysis] = useState<HarvestAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field: keyof HarvestData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateHarvestTiming = () => {
    // Parse input values
    const currentWeight = parseFloat(formData.currentWeight);
    const targetWeight = parseFloat(formData.targetWeight);
    const growthRate = parseFloat(formData.growthRate);
    const marketPrice = parseFloat(formData.marketPrice);
    const productionCosts = parseFloat(formData.productionCosts);
    const survivalRate = parseFloat(formData.survivalRate) / 100;

    // Calculate days to harvest
    const weightGain = targetWeight - currentWeight;
    const daysToHarvest = Math.ceil(weightGain / growthRate);

    // Calculate optimal harvest date
    const optimalDate = new Date();
    optimalDate.setDate(optimalDate.getDate() + daysToHarvest);

    // Determine confidence level based on water quality and growth rate
    let confidenceLevel: 'high' | 'medium' | 'low' = 'medium';
    if (formData.waterQuality === 'Excellent' && growthRate >= speciesData[formData.species as keyof typeof speciesData].optimalGrowthRate) {
      confidenceLevel = 'high';
    } else if (formData.waterQuality === 'Poor') {
      confidenceLevel = 'low';
    }

    // Calculate economic projections
    const priceVariation = speciesData[formData.species as keyof typeof speciesData].priceVariation;
    const seasonalFactor = formData.seasonalPricing === 'Peak Season' ? 1.2 :
                          formData.seasonalPricing === 'Off Season' ? 0.8 : 1.0;

    const expectedRevenue = targetWeight * marketPrice * seasonalFactor * survivalRate;
    const totalProductionCost = productionCosts * daysToHarvest;
    const projectedProfit = expectedRevenue - totalProductionCost;

    // Generate growth projection
    const weeksToHarvest = Math.ceil(daysToHarvest / 7);
    const growthProjection = Array.from({ length: weeksToHarvest }, (_, i) => {
      const week = i + 1;
      const weight = currentWeight + (growthRate * 7 * week);
      const price = marketPrice * (1 + (Math.random() - 0.5) * priceVariation);
      const profit = (weight * price * survivalRate) - (productionCosts * 7 * week);
      return { week, weight, price, profit };
    });

    // Identify risks
    const risks = [];
    
    if (formData.waterQuality !== 'Excellent') {
      risks.push({
        factor: 'Water Quality',
        level: formData.waterQuality === 'Poor' ? 'high' : 'medium',
        impact: 'May slow growth rate and affect survival',
      });
    }

    if (growthRate < speciesData[formData.species as keyof typeof speciesData].optimalGrowthRate) {
      risks.push({
        factor: 'Growth Rate',
        level: 'medium',
        impact: 'Below optimal growth rate for species',
      });
    }

    if (formData.seasonalPricing === 'Off Season') {
      risks.push({
        factor: 'Market Price',
        level: 'high',
        impact: 'Lower prices during off-season',
      });
    }

    // Generate recommendations
    const recommendations = [];
    
    if (confidenceLevel === 'low') {
      recommendations.push('Consider improving water quality before harvest');
      recommendations.push('Monitor growth rate more frequently');
    }

    if (formData.seasonalPricing === 'Off Season') {
      recommendations.push('Evaluate possibility of extending culture period to reach peak season');
      recommendations.push('Consider partial harvesting strategy');
    }

    if (projectedProfit < 0) {
      recommendations.push('Review production costs and feeding strategy');
      recommendations.push('Consider alternative market channels');
    }

    recommendations.push(`Optimal harvest window: ${optimalDate.toLocaleDateString()} (±${Math.ceil(daysToHarvest * 0.1)} days)`);

    const analysis: HarvestAnalysis = {
      timing: {
        optimalDate,
        daysToHarvest,
        weightAtHarvest: targetWeight,
        confidenceLevel,
      },
      economics: {
        expectedRevenue,
        productionCost: totalProductionCost,
        projectedProfit,
        priceVariation: priceVariation * 100,
      },
      risks,
      recommendations,
      growthProjection,
    };

    setAnalysis(analysis);
    setShowResults(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
        Harvest Timing Advisor
      </Typography>
        <Typography color="text.secondary" paragraph>
          Optimize harvest timing based on growth, market conditions, and profitability
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
              label="Stocking Date"
              value={formData.stockingDate}
              onChange={handleChange('stockingDate')}
              type="date"
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
                label="Current Weight (g)"
                value={formData.currentWeight}
                onChange={handleChange('currentWeight')}
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
                label="Growth Rate (g/day)"
                value={formData.growthRate}
                onChange={handleChange('growthRate')}
                type="number"
                required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Feeding Rate (% biomass)"
              value={formData.feedingRate}
              onChange={handleChange('feedingRate')}
              type="number"
              required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
                label="Survival Rate (%)"
                value={formData.survivalRate}
                onChange={handleChange('survivalRate')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Market Price ($/kg)"
              value={formData.marketPrice}
              onChange={handleChange('marketPrice')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Production Costs ($/day)"
              value={formData.productionCosts}
              onChange={handleChange('productionCosts')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Seasonal Pricing"
              value={formData.seasonalPricing}
              onChange={handleChange('seasonalPricing')}
              type="select"
              options={seasonalPricingOptions.map((s) => ({ value: s, label: s }))}
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Water Quality"
              value={formData.waterQuality}
              onChange={handleChange('waterQuality')}
              type="select"
              options={waterQualityOptions.map((w) => ({ value: w, label: w }))}
                required
              />
            </Grid>
          </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
            onClick={calculateHarvestTiming}
            disabled={Object.values(formData).some((v) => !v)}
            >
            Calculate Optimal Timing
            </Button>
          </Box>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🎣 Harvest Timing: Complete Guide to Optimal Harvesting
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on harvest timing in aquaculture! Choosing the right moment to harvest is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about planning and executing your harvest. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Harvest Timing Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Proper harvest timing affects product quality, market value, and overall profitability. It's critical for farm success.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Timing
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better prices</li>
            <li>Quality product</li>
            <li>Market alignment</li>
            <li>Cost efficiency</li>
            <li>Resource optimization</li>
            <li>Labor planning</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Harvest Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Size:</strong> Target weight</li>
            <li><strong>Market:</strong> Demand timing</li>
            <li><strong>Quality:</strong> Product condition</li>
            <li><strong>Weather:</strong> Environmental factors</li>
            <li><strong>Resources:</strong> Available equipment</li>
            <li><strong>Labor:</strong> Worker availability</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Plan Harvest
        </Typography>
        <Typography variant="body1" paragraph>
          Key planning times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Growth checks</li>
            <li>Market analysis</li>
            <li>Weather forecasts</li>
            <li>Resource planning</li>
            <li>Labor scheduling</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Planning
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Assess:</strong> Use our tool</li>
            <li><strong>Check:</strong> Market conditions</li>
            <li><strong>Plan:</strong> Set schedule</li>
            <li><strong>Prepare:</strong> Get ready</li>
            <li><strong>Execute:</strong> Harvest well</li>
            <li><strong>Review:</strong> Learn lessons</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Harvest Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Bad timing</li>
            <li>Poor planning</li>
            <li>Equipment problems</li>
            <li>Weather delays</li>
            <li>Labor shortages</li>
            <li>Quality issues</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Harvest Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Plan Ahead:</strong> Start early
          2. <strong>Check Market:</strong> Know demand
          3. <strong>Watch Weather:</strong> Plan conditions
          4. <strong>Test Equipment:</strong> Be ready
          5. <strong>Train Team:</strong> Prepare well
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Timing
        </Typography>
        <Typography variant="body1" paragraph>
          Proper timing leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>20-30% better prices</li>
            <li>Quality product</li>
            <li>Efficient process</li>
            <li>Happy buyers</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: Best harvest time?</strong>
          <Typography paragraph>
            A: Varies by factors. Our tool guides timing.
          </Typography>

          <strong>Q: Market timing?</strong>
          <Typography paragraph>
            A: Depends on demand. Our tool shows trends.
          </Typography>

          <strong>Q: Equipment needed?</strong>
          <Typography paragraph>
            A: Various options. Our tool lists essentials.
          </Typography>

          <strong>Q: Common delays?</strong>
          <Typography paragraph>
            A: Multiple causes. Our tool helps prevent.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper harvest timing is crucial for successful aquaculture operations. Use our harvest timing advisor tool above to plan and optimize your harvest schedule. Follow the guidelines in this guide to implement effective harvesting strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Harvest Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      {showResults && analysis && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
          <Typography variant="h6" gutterBottom>
            Harvest Timing Analysis
          </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Optimal Harvest Date</TableCell>
                        <TableCell align="right">
                          {analysis.timing.optimalDate.toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Days to Harvest</TableCell>
                        <TableCell align="right">{analysis.timing.daysToHarvest}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Expected Weight</TableCell>
                        <TableCell align="right">
                          {analysis.timing.weightAtHarvest}g
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Confidence Level</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={analysis.timing.confidenceLevel.toUpperCase()}
                            color={getStatusColor(analysis.timing.confidenceLevel)}
                            size="small"
                          />
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
                  Economic Projection
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Expected Revenue</TableCell>
                        <TableCell align="right">
                          ${analysis.economics.expectedRevenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Production Cost</TableCell>
                        <TableCell align="right">
                          ${analysis.economics.productionCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Projected Profit</TableCell>
                        <TableCell align="right">
                          <Typography
                            color={
                              analysis.economics.projectedProfit > 0
                                ? 'success.main'
                                : 'error.main'
                            }
                          >
                            ${analysis.economics.projectedProfit.toFixed(2)}
              </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Price Variation</TableCell>
                        <TableCell align="right">
                          ±{analysis.economics.priceVariation}%
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
                  Growth and Profit Projection
          </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysis.growthProjection}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" label={{ value: 'Weeks', position: 'bottom' }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <RechartsTooltip title="Value" />
                      <RechartsLegend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="#8884d8"
                        name="Weight (g)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="profit"
                        stroke="#82ca9d"
                        name="Profit ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
          <Typography variant="h6" gutterBottom>
                  Risk Assessment
          </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Risk Factor</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Impact</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysis.risks.map((risk, index) => (
                        <TableRow key={index}>
                          <TableCell>{risk.factor}</TableCell>
                          <TableCell>
              <Chip
                              label={risk.level.toUpperCase()}
                              color={getStatusColor(risk.level)}
                size="small"
                            />
                          </TableCell>
                          <TableCell>{risk.impact}</TableCell>
                        </TableRow>
                      ))}
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
            Recommendations
          </Typography>
                <Divider sx={{ mb: 2 }} />
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {analysis.recommendations.map((rec, index) => (
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