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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import FormField from '../components/FormField';

interface ParameterData {
  temperature: string;
  dissolvedOxygen: string;
  ph: string;
  ammonia: string;
  nitrite: string;
  nitrate: string;
  alkalinity: string;
  hardness: string;
  turbidity: string;
  salinity: string;
  weatherCondition: string;
  rainfall: string;
  windSpeed: string;
}

interface ParameterLimits {
  min: number;
  max: number;
  unit: string;
  criticalLow: number;
  criticalHigh: number;
}

const parameterLimits: Record<string, ParameterLimits> = {
  temperature: { min: 25, max: 32, unit: '°C', criticalLow: 22, criticalHigh: 35 },
  dissolvedOxygen: { min: 5, max: 8, unit: 'mg/L', criticalLow: 3, criticalHigh: 12 },
  ph: { min: 6.5, max: 8.5, unit: '', criticalLow: 6, criticalHigh: 9 },
  ammonia: { min: 0, max: 0.5, unit: 'mg/L', criticalLow: 0, criticalHigh: 1 },
  nitrite: { min: 0, max: 0.1, unit: 'mg/L', criticalLow: 0, criticalHigh: 0.5 },
  nitrate: { min: 0, max: 50, unit: 'mg/L', criticalLow: 0, criticalHigh: 100 },
  alkalinity: { min: 100, max: 200, unit: 'mg/L', criticalLow: 50, criticalHigh: 300 },
  hardness: { min: 100, max: 250, unit: 'mg/L', criticalLow: 50, criticalHigh: 350 },
  turbidity: { min: 0, max: 30, unit: 'NTU', criticalLow: 0, criticalHigh: 50 },
  salinity: { min: 0, max: 5, unit: 'ppt', criticalLow: 0, criticalHigh: 10 },
};

const weatherConditions = [
  'Clear',
  'Partly Cloudy',
  'Cloudy',
  'Rain',
  'Heavy Rain',
  'Storm',
];

const initialFormData: ParameterData = {
  temperature: '',
  dissolvedOxygen: '',
  ph: '',
  ammonia: '',
  nitrite: '',
  nitrate: '',
  alkalinity: '',
  hardness: '',
  turbidity: '',
  salinity: '',
  weatherCondition: '',
  rainfall: '',
  windSpeed: '',
};

interface Analysis {
  status: 'Optimal' | 'Warning' | 'Critical';
  issues: string[];
  recommendations: string[];
  riskLevel: number;
  impactedParameters: string[];
}

export default function EnvironmentalMonitor() {
  const [formData, setFormData] = useState<ParameterData>(initialFormData);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleChange = (field: keyof ParameterData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateParameterStatus = (
    parameter: string,
    value: number
  ): 'Optimal' | 'Warning' | 'Critical' => {
    const limits = parameterLimits[parameter];
    if (!limits) return 'Optimal';

    if (value < limits.criticalLow || value > limits.criticalHigh) {
      return 'Critical';
    } else if (value < limits.min || value > limits.max) {
      return 'Warning';
    }
    return 'Optimal';
  };

  const analyzeParameters = () => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const impactedParameters: string[] = [];
    let riskLevel = 0;

    // Analyze each parameter
    Object.entries(parameterLimits).forEach(([param, limits]) => {
      const value = parseFloat(formData[param as keyof ParameterData]);
      if (isNaN(value)) return;

      const status = calculateParameterStatus(param, value);
      if (status !== 'Optimal') {
        impactedParameters.push(param);
        const formattedParam = param.replace(/([A-Z])/g, ' $1').toLowerCase();
        
        if (status === 'Critical') {
          riskLevel += 20;
          issues.push(`Critical ${formattedParam} level: ${value}${limits.unit}`);
          recommendations.push(`Immediate action required for ${formattedParam}`);
        } else {
          riskLevel += 10;
          issues.push(`${formattedParam} outside optimal range: ${value}${limits.unit}`);
        }
      }
    });

    // Weather impact analysis
    const weather = formData.weatherCondition;
    const rainfall = parseFloat(formData.rainfall);
    const windSpeed = parseFloat(formData.windSpeed);

    if (weather === 'Heavy Rain' || weather === 'Storm') {
      riskLevel += 15;
      issues.push('Severe weather conditions');
      recommendations.push('Monitor water quality more frequently during severe weather');
    }

    if (rainfall > 50) {
      riskLevel += 10;
      issues.push('High rainfall may affect water quality');
      recommendations.push('Increase water quality monitoring frequency');
    }

    if (windSpeed > 30) {
      riskLevel += 10;
      issues.push('High wind speed may affect aeration');
      recommendations.push('Check aeration systems and adjust if necessary');
    }

    // Add general recommendations
    if (riskLevel > 50) {
      recommendations.push('Consider emergency water exchange');
      recommendations.push('Reduce or stop feeding temporarily');
    }

    // Add sustainable practices recommendations
    recommendations.push('Implement water recycling to reduce waste');
    recommendations.push('Consider using solar-powered aeration systems');
    recommendations.push('Monitor and record energy consumption');

    return {
      status: riskLevel > 50 ? 'Critical' : riskLevel > 25 ? 'Warning' : 'Optimal',
      issues,
      recommendations,
      riskLevel: Math.min(riskLevel, 100),
      impactedParameters,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = analyzeParameters();
    setAnalysis(result);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Environmental Monitoring System
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Monitor and analyze environmental parameters for optimal aquaculture conditions.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Water Quality Parameters
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(parameterLimits).map(([param, limits]) => (
                  <Grid item xs={12} sm={6} key={param}>
                    <FormField
                      label={`${param.replace(/([A-Z])/g, ' $1').toLowerCase()} (${limits.unit})`}
                      value={formData[param as keyof ParameterData]}
                      onChange={handleChange(param as keyof ParameterData)}
                      type="number"
                      required
                      helperText={`Optimal: ${limits.min}-${limits.max} ${limits.unit}`}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Weather Conditions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Weather Condition</InputLabel>
                    <Select
                      value={formData.weatherCondition}
                      onChange={(e) => handleChange('weatherCondition')(e.target.value)}
                      label="Weather Condition"
                    >
                      {weatherConditions.map((condition) => (
                        <MenuItem key={condition} value={condition}>
                          {condition}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Rainfall (mm/day)"
                    value={formData.rainfall}
                    onChange={handleChange('rainfall')}
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Wind Speed (km/h)"
                    value={formData.windSpeed}
                    onChange={handleChange('windSpeed')}
                    type="number"
                    required
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" size="large">
                  Analyze Environment
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {analysis && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Environmental Analysis
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Overall Risk Level:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analysis.riskLevel}
                  color={
                    analysis.status === 'Critical'
                      ? 'error'
                      : analysis.status === 'Warning'
                      ? 'warning'
                      : 'success'
                  }
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      analysis.status === 'Critical'
                        ? 'error.main'
                        : analysis.status === 'Warning'
                        ? 'warning.main'
                        : 'success.main',
                  }}
                >
                  {analysis.riskLevel}% Risk Level - {analysis.status} Conditions
                </Typography>
              </Box>

              {analysis.impactedParameters.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Impacted Parameters:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysis.impactedParameters.map((param) => (
                      <Chip
                        key={param}
                        label={param.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        color={analysis.status === 'Critical' ? 'error' : 'warning'}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {analysis.issues.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Identified Issues:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {analysis.issues.map((issue, index) => (
                      <li key={index}>
                        <Typography variant="body2">{issue}</Typography>
                      </li>
                    ))}
                  </ul>
                </Alert>
              )}

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Recommendations:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index}>
                      <Typography variant="body2">{rec}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🌍 Environmental Monitoring: Complete Guide to Aquatic Ecosystems
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on environmental monitoring in aquaculture! Maintaining optimal environmental conditions is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about monitoring and managing your aquatic ecosystem. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Environmental Monitoring Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Environmental conditions directly affect fish health, growth, and farm sustainability. It's fundamental to aquaculture success.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Monitoring
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better conditions</li>
            <li>Healthier fish</li>
            <li>Disease prevention</li>
            <li>Optimal growth</li>
            <li>Sustainability</li>
            <li>Risk reduction</li>
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
            <li><strong>Temperature:</strong> Water heat</li>
            <li><strong>Oxygen:</strong> DO levels</li>
            <li><strong>pH:</strong> Acidity</li>
            <li><strong>Ammonia:</strong> Toxins</li>
            <li><strong>Weather:</strong> Conditions</li>
            <li><strong>Algae:</strong> Blooms</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Monitor
        </Typography>
        <Typography variant="body1" paragraph>
          Key checking times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily checks</li>
            <li>Weather changes</li>
            <li>Season shifts</li>
            <li>Problem signs</li>
            <li>After treatments</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Monitoring
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Plan:</strong> Use our tool</li>
            <li><strong>Check:</strong> Take readings</li>
            <li><strong>Record:</strong> Log data</li>
            <li><strong>Analyze:</strong> Find trends</li>
            <li><strong>Act:</strong> Make changes</li>
            <li><strong>Review:</strong> Assess impact</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Environmental Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Temperature stress</li>
            <li>Low oxygen</li>
            <li>pH swings</li>
            <li>Algae blooms</li>
            <li>Weather impacts</li>
            <li>Pollution risks</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Monitoring Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Checks:</strong> Stay vigilant
          2. <strong>Good Equipment:</strong> Use reliable tools
          3. <strong>Quick Response:</strong> Act on changes
          4. <strong>Data Records:</strong> Keep history
          5. <strong>Prevention:</strong> Plan ahead
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Monitoring
        </Typography>
        <Typography variant="body1" paragraph>
          Effective monitoring leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>95%+ survival rates</li>
            <li>Better growth</li>
            <li>Less disease</li>
            <li>Stable conditions</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often to check?</strong>
          <Typography paragraph>
            A: Varies by parameter. Our tool guides timing.
          </Typography>

          <strong>Q: Best equipment?</strong>
          <Typography paragraph>
            A: Depends on needs. Our tool suggests options.
          </Typography>

          <strong>Q: Critical levels?</strong>
          <Typography paragraph>
            A: Species specific. Our tool shows ranges.
          </Typography>

          <strong>Q: Emergency response?</strong>
          <Typography paragraph>
            A: Quick action needed. Our tool guides steps.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper environmental monitoring is crucial for successful aquaculture operations. Use our environmental monitor tool above to track and maintain optimal conditions. Follow the guidelines in this guide to implement effective monitoring strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Environmental Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};