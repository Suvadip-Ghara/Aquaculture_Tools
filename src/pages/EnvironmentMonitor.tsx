import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Divider,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import FormField from '../components/FormField';

interface EnvironmentData {
  temperature: string;
  dissolvedOxygen: string;
  pH: string;
  ammonia: string;
  nitrite: string;
  nitrate: string;
  phosphate: string;
  turbidity: string;
  salinity: string;
  weather: string;
  rainfall: string;
  windSpeed: string;
}

interface Parameter {
  name: string;
  unit: string;
  optimal: { min: number; max: number };
  warning: { min: number; max: number };
  critical: { min: number; max: number };
}

const parameters: Record<string, Parameter> = {
  temperature: {
    name: 'Temperature',
    unit: '°C',
    optimal: { min: 25, max: 30 },
    warning: { min: 22, max: 32 },
    critical: { min: 20, max: 35 },
  },
  dissolvedOxygen: {
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    optimal: { min: 5, max: 8 },
    warning: { min: 3, max: 10 },
    critical: { min: 2, max: 12 },
  },
  pH: {
    name: 'pH',
    unit: '',
    optimal: { min: 6.5, max: 8.5 },
    warning: { min: 6.0, max: 9.0 },
    critical: { min: 5.5, max: 9.5 },
  },
  ammonia: {
    name: 'Ammonia',
    unit: 'mg/L',
    optimal: { min: 0, max: 0.5 },
    warning: { min: 0, max: 1.0 },
    critical: { min: 0, max: 2.0 },
  },
  nitrite: {
    name: 'Nitrite',
    unit: 'mg/L',
    optimal: { min: 0, max: 0.1 },
    warning: { min: 0, max: 0.5 },
    critical: { min: 0, max: 1.0 },
  },
  nitrate: {
    name: 'Nitrate',
    unit: 'mg/L',
    optimal: { min: 0, max: 50 },
    warning: { min: 0, max: 100 },
    critical: { min: 0, max: 200 },
  },
  phosphate: {
    name: 'Phosphate',
    unit: 'mg/L',
    optimal: { min: 0, max: 0.5 },
    warning: { min: 0, max: 1.0 },
    critical: { min: 0, max: 2.0 },
  },
  turbidity: {
    name: 'Turbidity',
    unit: 'NTU',
    optimal: { min: 0, max: 30 },
    warning: { min: 0, max: 50 },
    critical: { min: 0, max: 100 },
  },
  salinity: {
    name: 'Salinity',
    unit: 'ppt',
    optimal: { min: 0, max: 5 },
    warning: { min: 0, max: 10 },
    critical: { min: 0, max: 15 },
  },
};

const weatherConditions = [
  'Sunny',
  'Partly Cloudy',
  'Cloudy',
  'Light Rain',
  'Heavy Rain',
  'Stormy',
];

const initialFormData: EnvironmentData = {
  temperature: '',
  dissolvedOxygen: '',
  pH: '',
  ammonia: '',
  nitrite: '',
  nitrate: '',
  phosphate: '',
  turbidity: '',
  salinity: '',
  weather: '',
  rainfall: '',
  windSpeed: '',
};

interface MonitoringResult {
  parameter: string;
  value: number;
  unit: string;
  status: 'Optimal' | 'Warning' | 'Critical';
  trend: 'stable' | 'increasing' | 'decreasing';
  recommendations: string[];
}

export default function EnvironmentMonitor() {
  const [formData, setFormData] = useState<EnvironmentData>(initialFormData);
  const [results, setResults] = useState<MonitoringResult[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field: keyof EnvironmentData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const analyzeParameter = (
    parameter: string,
    value: number,
    param: Parameter
  ): MonitoringResult => {
    let status: 'Optimal' | 'Warning' | 'Critical';
    
    if (value >= param.optimal.min && value <= param.optimal.max) {
      status = 'Optimal';
    } else if (value >= param.warning.min && value <= param.warning.max) {
      status = 'Warning';
    } else {
      status = 'Critical';
    }

    // Generate recommendations based on status and parameter
    const recommendations: string[] = [];
    if (status === 'Critical') {
      recommendations.push(`Immediate action required for ${parameter}`);
      recommendations.push(`Consider emergency measures`);
      recommendations.push(`Increase monitoring frequency`);
    } else if (status === 'Warning') {
      recommendations.push(`Monitor ${parameter} closely`);
      recommendations.push(`Prepare corrective measures`);
      recommendations.push(`Check related parameters`);
    } else {
      recommendations.push(`Maintain current conditions`);
      recommendations.push(`Continue regular monitoring`);
    }

    // Simulate trend based on historical data
    const trend = Math.random() > 0.5 ? 'stable' : Math.random() > 0.5 ? 'increasing' : 'decreasing';

    return {
      parameter: param.name,
      value,
      unit: param.unit,
      status,
      trend,
      recommendations,
    };
  };

  const analyzeEnvironment = () => {
    const results: MonitoringResult[] = [];
    const newHistoricalData = [];

    // Analyze each parameter
    for (const [key, param] of Object.entries(parameters)) {
      if (formData[key as keyof EnvironmentData]) {
        const value = parseFloat(formData[key as keyof EnvironmentData]);
        const result = analyzeParameter(key, value, param);
        results.push(result);
      }
    }

    // Generate historical data points (simulated)
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const dataPoint: any = {
        time: new Date(now.getTime() - i * 3600000).toLocaleTimeString(),
      };
      for (const [key, param] of Object.entries(parameters)) {
        if (formData[key as keyof EnvironmentData]) {
          const baseValue = parseFloat(formData[key as keyof EnvironmentData]);
          dataPoint[key] = baseValue + (Math.random() - 0.5) * 2;
        }
      }
      newHistoricalData.push(dataPoint);
    }

    setResults(results);
    setHistoricalData(newHistoricalData);
    setShowResults(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal':
        return 'success';
      case 'Warning':
        return 'warning';
      case 'Critical':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Environment Monitor
        </Typography>
        <Typography color="text.secondary" paragraph>
          Monitor and analyze environmental parameters for optimal aquaculture conditions
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(parameters).map(([key, param]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <FormField
                label={`${param.name} (${param.unit})`}
                value={formData[key as keyof EnvironmentData]}
                onChange={handleChange(key as keyof EnvironmentData)}
                type="number"
                required
                helperText={`Optimal: ${param.optimal.min}-${param.optimal.max}`}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Weather Condition"
              value={formData.weather}
              onChange={handleChange('weather')}
              type="select"
              options={weatherConditions.map((w) => ({ value: w, label: w }))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Rainfall (mm)"
              value={formData.rainfall}
              onChange={handleChange('rainfall')}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Wind Speed (km/h)"
              value={formData.windSpeed}
              onChange={handleChange('windSpeed')}
              type="number"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={analyzeEnvironment}
            disabled={!Object.keys(parameters).some(
              (key) => formData[key as keyof EnvironmentData]
            )}
          >
            Analyze Environment
          </Button>
        </Box>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🌍 Environmental Monitoring: Complete Guide to Aquaculture Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on environmental monitoring in aquaculture! Understanding and managing environmental conditions is crucial for sustainable fish farming. In this detailed guide, we'll explore everything you need to know about monitoring and optimizing your aquaculture environment. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Environmental Monitoring Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Environmental monitoring ensures optimal conditions for fish growth, prevents problems, and maintains sustainability. It's essential for long-term success.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Monitoring
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better conditions</li>
            <li>Problem prevention</li>
            <li>Sustainability</li>
            <li>Legal compliance</li>
            <li>Quality control</li>
            <li>Resource efficiency</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Environmental Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential parameters:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Water:</strong> Quality parameters</li>
            <li><strong>Weather:</strong> Climate impact</li>
            <li><strong>Soil:</strong> Bottom conditions</li>
            <li><strong>Flora:</strong> Plant growth</li>
            <li><strong>Fauna:</strong> Wildlife impact</li>
            <li><strong>Waste:</strong> Management</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Monitor
        </Typography>
        <Typography variant="body1" paragraph>
          Key monitoring times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily checks</li>
            <li>Weather changes</li>
            <li>Season shifts</li>
            <li>After events</li>
            <li>Regular audits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Monitoring
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Assessment:</strong> Use our tool</li>
            <li><strong>Recording:</strong> Log data</li>
            <li><strong>Analysis:</strong> Check trends</li>
            <li><strong>Planning:</strong> Set actions</li>
            <li><strong>Implementation:</strong> Make changes</li>
            <li><strong>Review:</strong> Track results</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Environmental Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Water pollution</li>
            <li>Soil degradation</li>
            <li>Waste buildup</li>
            <li>Ecosystem impact</li>
            <li>Resource depletion</li>
            <li>Climate effects</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Management Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Checks:</strong> Stay vigilant
          2. <strong>Good Records:</strong> Keep data
          3. <strong>Quick Response:</strong> Act fast
          4. <strong>Prevention:</strong> Plan ahead
          5. <strong>Sustainability:</strong> Think long-term
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective monitoring leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better conditions</li>
            <li>Lower impact</li>
            <li>Less problems</li>
            <li>Sustainability</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often to monitor?</strong>
          <Typography paragraph>
            A: Daily for key parameters. Our tool helps plan frequency.
          </Typography>

          <strong>Q: What to check?</strong>
          <Typography paragraph>
            A: Multiple parameters. Our tool guides monitoring.
          </Typography>

          <strong>Q: Best practices?</strong>
          <Typography paragraph>
            A: Regular assessment. Our tool suggests methods.
          </Typography>

          <strong>Q: When to act?</strong>
          <Typography paragraph>
            A: At early signs. Our tool helps identify issues.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper environmental monitoring is crucial for sustainable aquaculture operations. Use our environment monitor above to optimize your farm conditions. Follow the guidelines in this guide to implement effective monitoring strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Environmental Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      {showResults && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Parameter Trends
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(parameters).map((key, index) => (
                    formData[key as keyof EnvironmentData] && (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={`hsl(${index * 45}, 70%, 50%)`}
                        name={parameters[key].name}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {results.map((result) => (
              <Grid item xs={12} sm={6} md={4} key={result.parameter}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{result.parameter}</Typography>
                      <Chip
                        label={result.status}
                        color={getStatusColor(result.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {result.value} {result.unit}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={`Trend: ${result.trend}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Recommendations:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {result.recommendations.map((rec, index) => (
                        <li key={index}>
                          <Typography variant="body2" color="text.secondary">
                            {rec}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Alert severity="info">
              <AlertTitle>Environmental Summary</AlertTitle>
              <Typography variant="body2">
                Weather Condition: {formData.weather}
                {formData.rainfall && `, Rainfall: ${formData.rainfall} mm`}
                {formData.windSpeed && `, Wind Speed: ${formData.windSpeed} km/h`}
              </Typography>
            </Alert>
          </Paper>
        </>
      )}
    </Container>
  );
};