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
  LinearProgress,
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
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
import FormField from '../components/FormField';

interface FinancialData {
  // Capital Costs
  pondConstruction: string;
  equipment: string;
  infrastructure: string;
  permits: string;

  // Operating Costs
  seedStock: string;
  feed: string;
  labor: string;
  electricity: string;
  maintenance: string;
  chemicals: string;
  marketing: string;

  // Production Data
  cyclesPerYear: string;
  productionPerCycle: string;
  survivalRate: string;
  sellingPrice: string;
  loanAmount: string;
  interestRate: string;
}

interface FinancialAnalysis {
  capitalCosts: {
    total: number;
    breakdown: { name: string; value: number }[];
  };
  operatingCosts: {
    total: number;
    breakdown: { name: string; value: number }[];
  };
  revenue: {
    annual: number;
    perCycle: number;
  };
  profitability: {
  grossProfit: number;
  netProfit: number;
    roi: number;
  paybackPeriod: number;
  breakEvenPoint: number;
  };
  cashFlow: {
    month: string;
    income: number;
    expenses: number;
    balance: number;
  }[];
  recommendations: string[];
}

const initialFormData: FinancialData = {
  pondConstruction: '',
  equipment: '',
  infrastructure: '',
  permits: '',
  seedStock: '',
  feed: '',
  labor: '',
  electricity: '',
  maintenance: '',
  chemicals: '',
  marketing: '',
  cyclesPerYear: '',
  productionPerCycle: '',
  survivalRate: '',
  sellingPrice: '',
  loanAmount: '',
  interestRate: '',
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ProfitabilityCalculator() {
  const [formData, setFormData] = useState<FinancialData>(initialFormData);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field: keyof FinancialData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateFinancials = () => {
    // Parse input values
    const capitalCosts = {
      pondConstruction: parseFloat(formData.pondConstruction),
      equipment: parseFloat(formData.equipment),
      infrastructure: parseFloat(formData.infrastructure),
      permits: parseFloat(formData.permits),
    };

    const operatingCosts = {
      seedStock: parseFloat(formData.seedStock),
      feed: parseFloat(formData.feed),
      labor: parseFloat(formData.labor),
      electricity: parseFloat(formData.electricity),
      maintenance: parseFloat(formData.maintenance),
      chemicals: parseFloat(formData.chemicals),
      marketing: parseFloat(formData.marketing),
    };

    // Calculate total costs
    const totalCapitalCosts = Object.values(capitalCosts).reduce((a, b) => a + b, 0);
    const totalOperatingCosts = Object.values(operatingCosts).reduce((a, b) => a + b, 0);

    // Calculate revenue
    const cyclesPerYear = parseFloat(formData.cyclesPerYear);
    const productionPerCycle = parseFloat(formData.productionPerCycle);
    const survivalRate = parseFloat(formData.survivalRate) / 100;
    const sellingPrice = parseFloat(formData.sellingPrice);

    const revenuePerCycle = productionPerCycle * survivalRate * sellingPrice;
    const annualRevenue = revenuePerCycle * cyclesPerYear;

    // Calculate loan payments if applicable
    const loanAmount = parseFloat(formData.loanAmount) || 0;
    const interestRate = (parseFloat(formData.interestRate) || 0) / 100;
    const annualLoanPayment = loanAmount > 0 
      ? (loanAmount * interestRate * Math.pow(1 + interestRate, 5)) / (Math.pow(1 + interestRate, 5) - 1)
      : 0;

    // Calculate profitability metrics
    const annualOperatingCosts = totalOperatingCosts * cyclesPerYear;
    const grossProfit = annualRevenue - annualOperatingCosts;
    const netProfit = grossProfit - annualLoanPayment;
    const totalInvestment = totalCapitalCosts + loanAmount;
    const roi = (netProfit / totalInvestment) * 100;
    const paybackPeriod = totalInvestment / netProfit;
    const breakEvenPoint = totalOperatingCosts / (sellingPrice - (totalOperatingCosts / productionPerCycle));

    // Generate cash flow projection
    const cashFlow = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2024, i).toLocaleString('default', { month: 'short' });
      const cycleIncome = (annualRevenue / cyclesPerYear) * (i % (12 / cyclesPerYear) === 0 ? 1 : 0);
      const cycleExpenses = (annualOperatingCosts / cyclesPerYear) * (i % (12 / cyclesPerYear) === 0 ? 1 : 0);
      return {
        month,
        income: cycleIncome,
        expenses: cycleExpenses + (annualLoanPayment / 12),
        balance: cycleIncome - (cycleExpenses + (annualLoanPayment / 12)),
      };
    });

    // Generate recommendations
    const recommendations = [];
    if (roi < 15) {
      recommendations.push('Consider ways to reduce operating costs');
      recommendations.push('Explore higher-value markets or products');
    }
    if (paybackPeriod > 3) {
      recommendations.push('Look for opportunities to increase production efficiency');
      recommendations.push('Evaluate financing options to reduce debt burden');
    }
    if (operatingCosts.feed / totalOperatingCosts > 0.5) {
      recommendations.push('Optimize feed management to reduce costs');
      recommendations.push('Consider alternative feed sources');
    }

    const analysis: FinancialAnalysis = {
      capitalCosts: {
        total: totalCapitalCosts,
        breakdown: Object.entries(capitalCosts).map(([name, value]) => ({
          name: name.replace(/([A-Z])/g, ' $1').trim(),
          value,
        })),
      },
      operatingCosts: {
        total: totalOperatingCosts,
        breakdown: Object.entries(operatingCosts).map(([name, value]) => ({
          name: name.replace(/([A-Z])/g, ' $1').trim(),
          value,
        })),
      },
      revenue: {
        annual: annualRevenue,
        perCycle: revenuePerCycle,
      },
      profitability: {
        grossProfit,
        netProfit,
        roi,
        paybackPeriod,
        breakEvenPoint,
      },
      cashFlow,
      recommendations,
    };

    setAnalysis(analysis);
    setShowResults(true);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
        Profitability Calculator
      </Typography>
        <Typography color="text.secondary" paragraph>
          Calculate and analyze the financial aspects of your aquaculture operation
      </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Capital Costs
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Pond Construction ($)"
                value={formData.pondConstruction}
                onChange={handleChange('pondConstruction')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Equipment ($)"
                value={formData.equipment}
                onChange={handleChange('equipment')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Infrastructure ($)"
                value={formData.infrastructure}
                onChange={handleChange('infrastructure')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Permits & Licenses ($)"
                value={formData.permits}
                onChange={handleChange('permits')}
                type="number"
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Operating Costs (Per Cycle)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Seed Stock ($)"
                value={formData.seedStock}
                onChange={handleChange('seedStock')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Feed ($)"
                value={formData.feed}
                onChange={handleChange('feed')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Labor ($)"
                value={formData.labor}
                onChange={handleChange('labor')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Electricity ($)"
                value={formData.electricity}
                onChange={handleChange('electricity')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Maintenance ($)"
                value={formData.maintenance}
                onChange={handleChange('maintenance')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Chemicals ($)"
                value={formData.chemicals}
                onChange={handleChange('chemicals')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Marketing ($)"
                value={formData.marketing}
                onChange={handleChange('marketing')}
                type="number"
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Production Data
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Cycles per Year"
                value={formData.cyclesPerYear}
                onChange={handleChange('cyclesPerYear')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Production per Cycle (kg)"
                value={formData.productionPerCycle}
                onChange={handleChange('productionPerCycle')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Survival Rate (%)"
                value={formData.survivalRate}
                onChange={handleChange('survivalRate')}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormField
                label="Selling Price ($/kg)"
                value={formData.sellingPrice}
                onChange={handleChange('sellingPrice')}
                type="number"
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Financing
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Loan Amount ($)"
                value={formData.loanAmount}
                onChange={handleChange('loanAmount')}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Interest Rate (%)"
                value={formData.interestRate}
                onChange={handleChange('interestRate')}
                type="number"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
            onClick={calculateFinancials}
            disabled={Object.values(formData).some((v) => !v)}
            >
              Calculate Profitability
            </Button>
          </Box>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          💰 Aquaculture Profitability Calculator: Complete Guide to Financial Success
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on profitability in aquaculture! Understanding and optimizing your farm's financial performance is crucial for long-term success. In this detailed guide, we'll explore everything you need to know about maximizing profits while maintaining sustainable operations. 📈
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Profitability Analysis Essential?
        </Typography>
        <Typography variant="body1" paragraph>
          Profitability analysis helps you understand your operation's financial health, identify areas for improvement, and make data-driven decisions. It's essential for securing investments, planning expansions, and ensuring sustainable growth.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Regular Profitability Assessment
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better decision making</li>
            <li>Cost optimization</li>
            <li>Revenue maximization</li>
            <li>Investment planning</li>
            <li>Risk management</li>
            <li>Sustainable growth</li>
            <li>Competitive advantage</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Financial Metrics
        </Typography>
        <Typography variant="body1" paragraph>
          Essential metrics to track:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Gross Margin:</strong> Revenue minus direct costs</li>
            <li><strong>Operating Costs:</strong> Day-to-day expenses</li>
            <li><strong>Return on Investment:</strong> Profit relative to investment</li>
            <li><strong>Break-even Point:</strong> Production level for profit</li>
            <li><strong>Cash Flow:</strong> Money movement timing</li>
            <li><strong>Net Profit:</strong> Final earnings after all costs</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Conduct Profitability Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for financial assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Monthly reviews</li>
            <li>Harvest periods</li>
            <li>Investment decisions</li>
            <li>Market changes</li>
            <li>System upgrades</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Profitability Analysis
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Data Collection:</strong> Gather all financial information</li>
            <li><strong>Cost Analysis:</strong> Break down expenses</li>
            <li><strong>Revenue Projection:</strong> Estimate income</li>
            <li><strong>Margin Calculation:</strong> Use our calculator above</li>
            <li><strong>Benchmark Comparison:</strong> Industry standards</li>
            <li><strong>Strategy Development:</strong> Optimization plan</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Profitability Challenges
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>High feed costs</li>
            <li>Energy expenses</li>
            <li>Labor management</li>
            <li>Market volatility</li>
            <li>Disease outbreaks</li>
            <li>Equipment maintenance</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Tips for Profit Optimization
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Cost Control:</strong> Focus on major expenses
          2. <strong>Efficiency Improvement:</strong> Optimize operations
          3. <strong>Quality Management:</strong> Premium pricing
          4. <strong>Risk Mitigation:</strong> Diversify products
          5. <strong>Market Research:</strong> Stay competitive
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Financial Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective profitability management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-30% higher profit margins</li>
            <li>Better investment returns</li>
            <li>Sustainable growth</li>
            <li>Improved stakeholder confidence</li>
            <li>Competitive advantage</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: What's the typical profit margin in aquaculture?</strong>
          <Typography paragraph>
            A: It varies by species and system, typically 15-40%. Use our calculator for specific projections.
          </Typography>

          <strong>Q: How can I improve profitability?</strong>
          <Typography paragraph>
            A: Focus on feed efficiency, energy costs, and optimal stocking. Our calculator helps identify key areas.
          </Typography>

          <strong>Q: When will I break even?</strong>
          <Typography paragraph>
            A: Break-even typically occurs within 2-3 production cycles. Use our calculator for specific analysis.
          </Typography>

          <strong>Q: How do I reduce operational costs?</strong>
          <Typography paragraph>
            A: Optimize feed management, energy efficiency, and labor productivity. Our calculator provides targeted recommendations.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Profitability management is crucial for sustainable aquaculture operations. Use our profitability calculator above to analyze your financial performance and identify opportunities for improvement. Follow the guidelines in this guide to implement effective financial management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Financial Management Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      {showResults && analysis && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
          <Typography variant="h6" gutterBottom>
                  Cost Breakdown
          </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.operatingCosts.breakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {analysis.operatingCosts.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
          <Typography variant="h6" gutterBottom>
                  Cash Flow Projection
          </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analysis.cashFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <RechartsLegend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#82ca9d"
                        name="Income"
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ff7300"
                        name="Expenses"
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#8884d8"
                        name="Balance"
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
                  Financial Metrics
          </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Capital Costs</TableCell>
                        <TableCell align="right">
                          ${analysis.capitalCosts.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Operating Costs per Cycle</TableCell>
                        <TableCell align="right">
                          ${analysis.operatingCosts.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Annual Revenue</TableCell>
                        <TableCell align="right">
                          ${analysis.revenue.annual.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gross Profit</TableCell>
                        <TableCell align="right">
                          ${analysis.profitability.grossProfit.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Net Profit</TableCell>
                        <TableCell align="right">
                          ${analysis.profitability.netProfit.toLocaleString()}
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
                  Performance Indicators
          </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Return on Investment (ROI)
              </Typography>
                  <Alert
                    severity={
                      analysis.profitability.roi > 20
                        ? 'success'
                        : analysis.profitability.roi > 10
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {analysis.profitability.roi.toFixed(1)}%
                  </Alert>
            </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payback Period
          </Typography>
                  <Alert
                    severity={
                      analysis.profitability.paybackPeriod < 2
                      ? 'success'
                        : analysis.profitability.paybackPeriod < 4
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {analysis.profitability.paybackPeriod.toFixed(1)} years
                  </Alert>
            </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Break-even Point
          </Typography>
                  <Alert severity="info">
                    {analysis.profitability.breakEvenPoint.toFixed(0)} kg
                  </Alert>
            </Box>
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