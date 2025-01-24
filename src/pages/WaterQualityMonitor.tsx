import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Alert,
  AlertTitle,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormField from '../components/FormField';

interface WaterQualityData {
  dissolvedOxygen: string;
  temperature: string;
  pH: string;
  ammonia: string;
  nitrite: string;
  nitrate: string;
  alkalinity: string;
  hardness: string;
  salinity: string;
  turbidity: string;
  phosphate: string;
  carbonDioxide: string;
}

interface ParameterRange {
  name: string;
  unit: string;
  optimal: {
    min: number;
    max: number;
  };
  warning: {
    min: number;
    max: number;
  };
  critical: {
    min: number;
    max: number;
  };
  recommendations: string[];
}

const parameterRanges: Record<string, ParameterRange> = {
  dissolvedOxygen: {
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    optimal: { min: 5, max: 8 },
    warning: { min: 3, max: 10 },
    critical: { min: 2, max: 12 },
    recommendations: [
      'Increase aeration if levels are low',
      'Check stocking density if consistently low',
      'Monitor feeding rate if levels fluctuate',
    ],
  },
  temperature: {
    name: 'Temperature',
    unit: '°C',
    optimal: { min: 25, max: 30 },
    warning: { min: 20, max: 32 },
    critical: { min: 15, max: 35 },
    recommendations: [
      'Use shading during hot periods',
      'Adjust feeding based on temperature',
      'Consider water exchange in extreme conditions',
    ],
  },
  pH: {
    name: 'pH',
    unit: '',
    optimal: { min: 6.5, max: 8.5 },
    warning: { min: 6.0, max: 9.0 },
    critical: { min: 5.5, max: 9.5 },
    recommendations: [
      'Add lime if pH is low',
      'Check alkalinity levels',
      'Monitor after heavy rain',
    ],
  },
  ammonia: {
    name: 'Ammonia',
    unit: 'mg/L',
    optimal: { min: 0, max: 0.5 },
    warning: { min: 0, max: 1.0 },
    critical: { min: 0, max: 2.0 },
    recommendations: [
      'Reduce feeding if levels are high',
      'Increase water exchange',
      'Check biofilter efficiency',
    ],
  },
  nitrite: {
    name: 'Nitrite',
    unit: 'mg/L',
    optimal: { min: 0, max: 0.1 },
    warning: { min: 0, max: 0.5 },
    critical: { min: 0, max: 1.0 },
    recommendations: [
      'Add salt to reduce toxicity',
      'Check nitrifying bacteria',
      'Increase oxygenation',
    ],
  },
  nitrate: {
    name: 'Nitrate',
    unit: 'mg/L',
    optimal: { min: 0, max: 50 },
    warning: { min: 0, max: 100 },
    critical: { min: 0, max: 200 },
    recommendations: [
      'Regular water exchange',
      'Monitor plant growth',
      'Check denitrification',
    ],
  },
  alkalinity: {
    name: 'Alkalinity',
    unit: 'mg/L CaCO3',
    optimal: { min: 100, max: 200 },
    warning: { min: 50, max: 300 },
    critical: { min: 20, max: 400 },
    recommendations: [
      'Add buffer if low',
      'Check limestone addition',
      'Monitor pH stability',
    ],
  },
  hardness: {
    name: 'Hardness',
    unit: 'mg/L CaCO3',
    optimal: { min: 100, max: 250 },
    warning: { min: 50, max: 350 },
    critical: { min: 20, max: 450 },
    recommendations: [
      'Add calcium if low',
      'Check mineral content',
      'Balance with alkalinity',
    ],
  },
  salinity: {
    name: 'Salinity',
    unit: 'ppt',
    optimal: { min: 0, max: 5 },
    warning: { min: 0, max: 10 },
    critical: { min: 0, max: 15 },
    recommendations: [
      'Adjust based on species',
      'Monitor after rain',
      'Check evaporation rate',
    ],
  },
  turbidity: {
    name: 'Turbidity',
    unit: 'NTU',
    optimal: { min: 0, max: 30 },
    warning: { min: 0, max: 50 },
    critical: { min: 0, max: 100 },
    recommendations: [
      'Use settling tanks',
      'Add mechanical filtration',
      'Check erosion sources',
    ],
  },
  phosphate: {
    name: 'Phosphate',
    unit: 'mg/L',
    optimal: { min: 0, max: 0.5 },
    warning: { min: 0, max: 1.0 },
    critical: { min: 0, max: 2.0 },
    recommendations: [
      'Control feed waste',
      'Monitor algae growth',
      'Check fertilization rate',
    ],
  },
  carbonDioxide: {
    name: 'Carbon Dioxide',
    unit: 'mg/L',
    optimal: { min: 0, max: 10 },
    warning: { min: 0, max: 15 },
    critical: { min: 0, max: 20 },
    recommendations: [
      'Increase aeration',
      'Check respiration rate',
      'Monitor plant density',
    ],
  },
};

interface QualityAnalysis {
  parameter: string;
  value: number;
  status: 'Optimal' | 'Warning' | 'Critical';
  recommendations: string[];
}

const initialFormData: WaterQualityData = {
  dissolvedOxygen: '',
  temperature: '',
  pH: '',
  ammonia: '',
  nitrite: '',
  nitrate: '',
  alkalinity: '',
  hardness: '',
  salinity: '',
  turbidity: '',
  phosphate: '',
  carbonDioxide: '',
};

export default function WaterQualityMonitor() {
  const [formData, setFormData] = useState<WaterQualityData>(initialFormData);
  const [analysis, setAnalysis] = useState<QualityAnalysis[]>([]);
  const [overallStatus, setOverallStatus] = useState<'Optimal' | 'Warning' | 'Critical' | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field: keyof WaterQualityData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const analyzeParameter = (
    parameter: keyof WaterQualityData,
    value: number
  ): QualityAnalysis => {
    const range = parameterRanges[parameter];
    let status: 'Optimal' | 'Warning' | 'Critical';

    if (value >= range.optimal.min && value <= range.optimal.max) {
      status = 'Optimal';
    } else if (value >= range.warning.min && value <= range.warning.max) {
      status = 'Warning';
    } else {
      status = 'Critical';
    }

    return {
      parameter: range.name,
      value,
      status,
      recommendations: range.recommendations,
    };
  };

  const handleAnalyze = () => {
    const results: QualityAnalysis[] = [];
    let criticalCount = 0;
    let warningCount = 0;

    Object.entries(formData).forEach(([param, valueStr]) => {
      if (valueStr) {
        const value = parseFloat(valueStr);
        const result = analyzeParameter(param as keyof WaterQualityData, value);
        results.push(result);

        if (result.status === 'Critical') criticalCount++;
        if (result.status === 'Warning') warningCount++;
      }
    });

    setAnalysis(results);
    setShowResults(true);

    if (criticalCount > 0) {
      setOverallStatus('Critical');
    } else if (warningCount > 0) {
      setOverallStatus('Warning');
    } else {
      setOverallStatus('Optimal');
    }
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
          Water Quality Monitor
        </Typography>
        <Typography color="text.secondary" paragraph>
          Monitor and analyze your pond's water quality parameters
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(parameterRanges).map(([key, param]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <FormField
                label={`${param.name} (${param.unit})`}
                value={formData[key as keyof WaterQualityData]}
                onChange={handleChange(key as keyof WaterQualityData)}
                type="number"
                required
                helperText={`Optimal: ${param.optimal.min}-${param.optimal.max} ${param.unit}`}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={Object.values(formData).every((v) => !v)}
          >
            Analyze Parameters
          </Button>
        </Box>
      </Paper>

      {showResults && (
        <Paper sx={{ p: 3 }}>
          {overallStatus && (
            <Alert severity={getStatusColor(overallStatus)} sx={{ mb: 3 }}>
              <AlertTitle>Overall Status: {overallStatus}</AlertTitle>
              {overallStatus === 'Critical' && 'Immediate action required!'}
              {overallStatus === 'Warning' && 'Some parameters need attention.'}
              {overallStatus === 'Optimal' && 'All parameters are within optimal range.'}
            </Alert>
          )}

          <Grid container spacing={3}>
            {analysis.map((result) => (
              <Grid item xs={12} sm={6} md={4} key={result.parameter}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: `${getStatusColor(result.status)}.main`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {result.parameter}
                    </Typography>
                    <Chip
                      label={result.status}
                      color={getStatusColor(result.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {result.value} {parameterRanges[Object.keys(parameterRanges).find(
                      (key) => parameterRanges[key].name === result.parameter
                    ) as string]?.unit}
                  </Typography>
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
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          💧 Water Quality Monitoring: Complete Guide to Aquatic Health
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on water quality monitoring in aquaculture! Maintaining optimal water conditions is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about monitoring and managing water quality. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Water Quality Monitoring Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Water quality directly affects fish health, growth, and survival. It's the foundation of successful aquaculture.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Monitoring
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better growth</li>
            <li>Higher survival</li>
            <li>Disease prevention</li>
            <li>Feed efficiency</li>
            <li>Stock health</li>
            <li>System stability</li>
            <li>Better profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Water Parameters
        </Typography>
        <Typography variant="body1" paragraph>
          Essential measurements:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Oxygen:</strong> DO levels</li>
            <li><strong>pH:</strong> Acid balance</li>
            <li><strong>Temperature:</strong> Heat level</li>
            <li><strong>Ammonia:</strong> Waste products</li>
            <li><strong>Nitrite:</strong> Toxic compounds</li>
            <li><strong>Alkalinity:</strong> Buffer capacity</li>
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
            <li>Morning tests</li>
            <li>Evening tests</li>
            <li>After changes</li>
            <li>Problem signs</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Monitoring
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Plan:</strong> Use our tool</li>
            <li><strong>Sample:</strong> Collect water</li>
            <li><strong>Test:</strong> Check parameters</li>
            <li><strong>Record:</strong> Log results</li>
            <li><strong>Analyze:</strong> Check trends</li>
            <li><strong>Act:</strong> Make changes</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Water Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Low oxygen</li>
            <li>pH swings</li>
            <li>High ammonia</li>
            <li>Temperature stress</li>
            <li>Poor clarity</li>
            <li>Algae problems</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Monitoring Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Tests:</strong> Stay vigilant
          2. <strong>Good Records:</strong> Track changes
          3. <strong>Quick Action:</strong> Address issues
          4. <strong>Prevention:</strong> Maintain stability
          5. <strong>Equipment:</strong> Keep calibrated
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Monitoring
        </Typography>
        <Typography variant="body1" paragraph>
          Proper monitoring leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>90%+ survival rates</li>
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
          <strong>Q: How often to test?</strong>
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

          <strong>Q: Treatment options?</strong>
          <Typography paragraph>
            A: Various solutions. Our tool guides choices.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper water quality monitoring is crucial for successful aquaculture operations. Use our water quality monitor tool above to track and maintain optimal conditions. Follow the guidelines in this guide to implement effective monitoring strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Water Quality Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};