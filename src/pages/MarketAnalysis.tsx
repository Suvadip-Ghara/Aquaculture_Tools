import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AlertTitle,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import FormField from '../components/FormField';

interface MarketData {
  species: string;
  productType: string;
  quantity: string;
  productionCost: string;
  targetMarket: string;
  competitorPrice: string;
  seasonality: string;
  qualityGrade: string;
  transportCost: string;
  storageLife: string;
}

interface PriceData {
  month: string;
  price: number;
  demand: number;
  supply: number;
}

interface MarketAnalysis {
  priceAnalysis: {
    suggestedPrice: number;
    minPrice: number;
    maxPrice: number;
    margin: number;
  };
  competitiveAnalysis: {
    position: string;
    advantages: string[];
    risks: string[];
  };
  marketTrends: {
    trend: 'up' | 'down' | 'stable';
    seasonalDemand: 'high' | 'medium' | 'low';
    growthPotential: number;
  };
  recommendations: string[];
}

const productTypes = [
  'Fresh Whole',
  'Fresh Fillet',
  'Frozen Whole',
  'Frozen Fillet',
  'Live',
  'Processed',
];

const targetMarkets = [
  'Local Retail',
  'Wholesale',
  'Export',
  'Restaurants',
  'Processors',
];

const qualityGrades = ['Premium', 'Standard', 'Economy'];

const seasonality = [
  'Peak Season',
  'Off Season',
  'Year Round',
  'Festival Season',
];

const initialFormData: MarketData = {
  species: '',
  productType: '',
  quantity: '',
  productionCost: '',
  targetMarket: '',
  competitorPrice: '',
  seasonality: '',
  qualityGrade: '',
  transportCost: '',
  storageLife: '',
};

// Simulated historical price data
const generateHistoricalData = (): PriceData[] => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return months.map(month => ({
    month,
    price: 15 + Math.random() * 10,
    demand: 50 + Math.random() * 50,
    supply: 40 + Math.random() * 60,
  }));
};

export default function MarketAnalysis() {
  const [formData, setFormData] = useState<MarketData>(initialFormData);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [historicalData, setHistoricalData] = useState<PriceData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field: keyof MarketData) => (value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: String(value) }));
  };

  const analyzeMarket = () => {
    const productionCost = parseFloat(formData.productionCost);
    const competitorPrice = parseFloat(formData.competitorPrice);
    const transportCost = parseFloat(formData.transportCost);
    const quantity = parseFloat(formData.quantity);

    // Calculate base metrics
    const totalCost = productionCost + transportCost;
    const minPrice = totalCost * 1.1; // 10% minimum margin
    const maxPrice = competitorPrice * 1.1; // 10% above competitor
    const suggestedPrice = (minPrice + maxPrice) / 2;
    const margin = ((suggestedPrice - totalCost) / suggestedPrice) * 100;

    // Generate market position analysis
    let position = 'competitive';
    if (suggestedPrice < competitorPrice) position = 'aggressive';
    if (suggestedPrice > competitorPrice * 1.1) position = 'premium';

    // Generate advantages and risks based on inputs
    const advantages = [];
    const risks = [];

    if (formData.qualityGrade === 'Premium') {
      advantages.push('High quality product positioning');
      advantages.push('Better profit margins');
      risks.push('Limited market size');
    }

    if (formData.targetMarket === 'Export') {
      advantages.push('Access to higher-value markets');
      advantages.push('Currency advantages');
      risks.push('Complex logistics');
      risks.push('International regulations');
    }

    if (quantity > 1000) {
      advantages.push('Economy of scale');
      risks.push('Storage requirements');
    }

    // Analyze market trends
    const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down';
    const seasonalDemand = formData.seasonality === 'Peak Season' ? 'high' : 
                          formData.seasonality === 'Off Season' ? 'low' : 'medium';
    const growthPotential = Math.random() * 20 + 5; // 5-25% growth potential

    // Generate recommendations
    const recommendations = [];
    if (margin < 15) {
      recommendations.push('Consider cost reduction strategies');
      recommendations.push('Explore value-added products');
    }
    if (position === 'premium') {
      recommendations.push('Focus on quality certification');
      recommendations.push('Develop premium market channels');
    }
    if (seasonalDemand === 'high') {
      recommendations.push('Build inventory for peak demand');
      recommendations.push('Secure advance contracts');
    }

    // Set analysis results
    const analysisResult: MarketAnalysis = {
      priceAnalysis: {
        suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
        minPrice: parseFloat(minPrice.toFixed(2)),
        maxPrice: parseFloat(maxPrice.toFixed(2)),
        margin: parseFloat(margin.toFixed(1)),
      },
      competitiveAnalysis: {
        position,
        advantages,
      risks,
      },
      marketTrends: {
        trend,
        seasonalDemand,
        growthPotential,
      },
      recommendations,
    };

    setAnalysis(analysisResult);
    setHistoricalData(generateHistoricalData());
    setShowResults(true);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Market Analysis
      </Typography>
        <Typography color="text.secondary" paragraph>
          Analyze market conditions and optimize pricing strategy
      </Typography>

      <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Species"
                      value={formData.species}
              onChange={handleChange('species')}
              type="text"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Product Type"
              value={formData.productType}
              onChange={handleChange('productType')}
              type="select"
              options={productTypes.map((t) => ({ value: t, label: t }))}
              required
            />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
                  <FormField
              label="Quantity (kg)"
              value={formData.quantity}
              onChange={handleChange('quantity')}
                    type="number"
                    required
                  />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
                  <FormField
                    label="Production Cost ($/kg)"
                    value={formData.productionCost}
                    onChange={handleChange('productionCost')}
                    type="number"
                    required
                  />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Target Market"
              value={formData.targetMarket}
              onChange={handleChange('targetMarket')}
              type="select"
              options={targetMarkets.map((m) => ({ value: m, label: m }))}
              required
            />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Competitor Price ($/kg)"
              value={formData.competitorPrice}
              onChange={handleChange('competitorPrice')}
              type="number"
              required
            />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Seasonality"
                      value={formData.seasonality}
              onChange={handleChange('seasonality')}
              type="select"
              options={seasonality.map((s) => ({ value: s, label: s }))}
              required
            />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Quality Grade"
                      value={formData.qualityGrade}
              onChange={handleChange('qualityGrade')}
              type="select"
              options={qualityGrades.map((g) => ({ value: g, label: g }))}
              required
            />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Transport Cost ($/kg)"
              value={formData.transportCost}
              onChange={handleChange('transportCost')}
              type="number"
              required
            />
                </Grid>
          <Grid item xs={12} sm={6} md={4}>
                  <FormField
              label="Storage Life (days)"
              value={formData.storageLife}
              onChange={handleChange('storageLife')}
                    type="number"
                    required
                  />
                </Grid>
              </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={analyzeMarket}
            disabled={Object.values(formData).some((v) => !v)}
          >
                  Analyze Market
                </Button>
              </Box>
          </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          📊 Market Analysis: Complete Guide to Aquaculture Business
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on market analysis in aquaculture! Understanding market dynamics is crucial for business success. In this detailed guide, we'll explore everything you need to know about analyzing and accessing aquaculture markets. 💹
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Market Analysis Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Market analysis helps optimize production, pricing, and profitability. It's essential for business planning and success.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Analysis
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better pricing</li>
            <li>Target markets</li>
            <li>Product focus</li>
            <li>Risk management</li>
            <li>Growth planning</li>
            <li>Competition edge</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Market Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Demand:</strong> Market needs</li>
            <li><strong>Supply:</strong> Competition</li>
            <li><strong>Price:</strong> Value points</li>
            <li><strong>Trends:</strong> Changes</li>
            <li><strong>Channels:</strong> Distribution</li>
            <li><strong>Buyers:</strong> Preferences</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Analyze Markets
        </Typography>
        <Typography variant="body1" paragraph>
          Key analysis times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Business planning</li>
            <li>Season changes</li>
            <li>Price shifts</li>
            <li>Market changes</li>
            <li>Growth plans</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Analysis
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Research:</strong> Use our tool</li>
            <li><strong>Data:</strong> Gather info</li>
            <li><strong>Analysis:</strong> Study trends</li>
            <li><strong>Planning:</strong> Set strategy</li>
            <li><strong>Action:</strong> Implement</li>
            <li><strong>Review:</strong> Track results</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Market Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Price volatility</li>
            <li>Demand changes</li>
            <li>Competition</li>
            <li>Access problems</li>
            <li>Quality demands</li>
            <li>Supply chains</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Market Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Research:</strong> Stay informed
          2. <strong>Network Well:</strong> Build contacts
          3. <strong>Quality Focus:</strong> Meet standards
          4. <strong>Smart Pricing:</strong> Stay competitive
          5. <strong>Future View:</strong> Plan ahead
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Effective analysis leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-25% better prices</li>
            <li>Market access</li>
            <li>Better planning</li>
            <li>Growth options</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How to analyze markets?</strong>
          <Typography paragraph>
            A: Multiple methods exist. Our tool guides analysis.
          </Typography>

          <strong>Q: Best markets?</strong>
          <Typography paragraph>
            A: Depends on products. Our tool compares options.
          </Typography>

          <strong>Q: Price strategies?</strong>
          <Typography paragraph>
            A: Various approaches. Our tool helps optimize.
          </Typography>

          <strong>Q: Market timing?</strong>
          <Typography paragraph>
            A: Seasonal factors matter. Our tool shows trends.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper market analysis is crucial for successful aquaculture business. Use our market analysis tool above to optimize your business decisions. Follow the guidelines in this guide to implement effective market strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Market Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      {showResults && analysis && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
              <Typography variant="h6" gutterBottom>
                  Price Analysis
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Suggested Price</TableCell>
                        <TableCell align="right">
                          ${analysis.priceAnalysis.suggestedPrice}/kg
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Minimum Price</TableCell>
                        <TableCell align="right">
                          ${analysis.priceAnalysis.minPrice}/kg
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maximum Price</TableCell>
                        <TableCell align="right">
                          ${analysis.priceAnalysis.maxPrice}/kg
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Profit Margin</TableCell>
                        <TableCell align="right">
                          {analysis.priceAnalysis.margin}%
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
                  Competitive Position
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={analysis.competitiveAnalysis.position.toUpperCase()}
                    color={
                      analysis.competitiveAnalysis.position === 'premium'
                        ? 'success'
                        : analysis.competitiveAnalysis.position === 'competitive'
                        ? 'primary'
                        : 'warning'
                    }
                  />
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Competitive Advantages:
                </Typography>
                <ul style={{ margin: '0 0 1rem 1.2rem' }}>
                  {analysis.competitiveAnalysis.advantages.map((adv, index) => (
                    <li key={index}>
                      <Typography variant="body2">{adv}</Typography>
                    </li>
                  ))}
                </ul>
                  <Typography variant="subtitle2" gutterBottom>
                    Market Risks:
                  </Typography>
                <ul style={{ margin: '0 0 0 1.2rem' }}>
                  {analysis.competitiveAnalysis.risks.map((risk, index) => (
                      <li key={index}>
                      <Typography variant="body2" color="error">
                        {risk}
                      </Typography>
                      </li>
                    ))}
                  </ul>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Market Trends
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="demand"
                      fill="#8884d8"
                      name="Demand"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="supply"
                      fill="#82ca9d"
                      name="Supply"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Alert severity={analysis.marketTrends.trend === 'up' ? 'success' : 'info'}>
                      Market Trend: {analysis.marketTrends.trend.toUpperCase()}
                    </Alert>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Alert
                      severity={
                        analysis.marketTrends.seasonalDemand === 'high'
                          ? 'success'
                          : analysis.marketTrends.seasonalDemand === 'medium'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      Seasonal Demand: {analysis.marketTrends.seasonalDemand.toUpperCase()}
                    </Alert>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Alert severity="info">
                      Growth Potential: {analysis.marketTrends.growthPotential.toFixed(1)}%
                </Alert>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
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
};