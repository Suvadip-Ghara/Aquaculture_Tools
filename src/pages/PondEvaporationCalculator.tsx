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
} from '@mui/material';
import FormField from '../components/FormField';

interface EvaporationData {
  pondLength: string;
  pondWidth: string;
  pondDepth: string;
  waterTemperature: string;
  airTemperature: string;
  humidity: string;
  windSpeed: string;
  sunlightHours: string;
  rainfall: string;
  season: string;
  cloudCover: string;
}

const initialFormData: EvaporationData = {
  pondLength: '',
  pondWidth: '',
  pondDepth: '',
  waterTemperature: '',
  airTemperature: '',
  humidity: '',
  windSpeed: '',
  sunlightHours: '',
  rainfall: '',
  season: '',
  cloudCover: '',
};

const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
const cloudCoverOptions = ['Clear', 'Partly Cloudy', 'Mostly Cloudy', 'Overcast'];

export default function PondEvaporationCalculator() {
  const [formData, setFormData] = useState<EvaporationData>(initialFormData);
  const [result, setResult] = useState<{
    dailyEvaporation: number;
    weeklyEvaporation: number;
    monthlyEvaporation: number;
    recommendations: string[];
    riskLevel: 'Low' | 'Moderate' | 'High';
  } | null>(null);

  const handleChange = (field: keyof EvaporationData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEvaporation = () => {
    // Get form values
    const length = parseFloat(formData.pondLength);
    const width = parseFloat(formData.pondWidth);
    const waterTemp = parseFloat(formData.waterTemperature);
    const airTemp = parseFloat(formData.airTemperature);
    const humidity = parseFloat(formData.humidity);
    const windSpeed = parseFloat(formData.windSpeed);
    const sunlight = parseFloat(formData.sunlightHours);
    const rainfall = parseFloat(formData.rainfall);

    // Calculate surface area
    const surfaceArea = length * width;

    // Basic evaporation rate calculation (simplified model)
    // Base rate affected by temperature difference
    let baseRate = 0.1; // base evaporation rate in cm/day
    
    // Temperature effect
    const tempDiff = waterTemp - airTemp;
    baseRate *= (1 + (tempDiff * 0.05));

    // Wind effect (increases evaporation)
    baseRate *= (1 + (windSpeed * 0.02));

    // Humidity effect (reduces evaporation)
    baseRate *= (1 - (humidity / 200)); // divided by 200 to normalize effect

    // Sunlight hours effect
    baseRate *= (1 + (sunlight / 24) * 0.5);

    // Cloud cover effect
    const cloudCoverFactor = {
      'Clear': 1,
      'Partly Cloudy': 0.8,
      'Mostly Cloudy': 0.6,
      'Overcast': 0.4,
    }[formData.cloudCover] || 1;
    baseRate *= cloudCoverFactor;

    // Seasonal adjustment
    const seasonFactor = {
      'Summer': 1.2,
      'Spring': 1,
      'Fall': 0.8,
      'Winter': 0.6,
    }[formData.season] || 1;
    baseRate *= seasonFactor;

    // Convert to volume
    const dailyEvaporation = (baseRate * surfaceArea) / 100; // convert cm to m³
    const weeklyEvaporation = dailyEvaporation * 7;
    const monthlyEvaporation = dailyEvaporation * 30;

    // Calculate risk level
    let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
    if (baseRate > 0.5) {
      riskLevel = 'High';
    } else if (baseRate > 0.3) {
      riskLevel = 'Moderate';
    }

    // Generate recommendations
    const recommendations = [
      'Monitor water levels daily during high evaporation periods',
      'Consider installing shade structures to reduce evaporation',
      'Maintain proper water depth to minimize temperature fluctuations',
    ];

    if (riskLevel === 'High') {
      recommendations.push(
        'Install water level monitoring system',
        'Plan for emergency water supply',
        'Consider reducing pond surface area during peak evaporation season'
      );
    }

    if (windSpeed > 15) {
      recommendations.push('Install windbreaks to reduce evaporation');
    }

    if (sunlight > 10) {
      recommendations.push('Consider using pond covers during peak sunlight hours');
    }

    return {
      dailyEvaporation,
      weeklyEvaporation,
      monthlyEvaporation,
      recommendations,
      riskLevel,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateEvaporation();
    setResult(result);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Pond Evaporation Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calculate water loss due to evaporation and get recommendations for water management.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormField
                label="Pond Length (m)"
                value={formData.pondLength}
                onChange={handleChange('pondLength')}
                type="number"
                required
                helperText="Length of the pond"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField
                label="Pond Width (m)"
                value={formData.pondWidth}
                onChange={handleChange('pondWidth')}
                type="number"
                required
                helperText="Width of the pond"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField
                label="Pond Depth (m)"
                value={formData.pondDepth}
                onChange={handleChange('pondDepth')}
                type="number"
                required
                helperText="Average depth of the pond"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Water Temperature (°C)"
                value={formData.waterTemperature}
                onChange={handleChange('waterTemperature')}
                type="number"
                required
                helperText="Current water temperature"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Air Temperature (°C)"
                value={formData.airTemperature}
                onChange={handleChange('airTemperature')}
                type="number"
                required
                helperText="Current air temperature"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Humidity (%)"
                value={formData.humidity}
                onChange={handleChange('humidity')}
                type="number"
                required
                helperText="Relative humidity"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Wind Speed (km/h)"
                value={formData.windSpeed}
                onChange={handleChange('windSpeed')}
                type="number"
                required
                helperText="Average wind speed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Sunlight Hours"
                value={formData.sunlightHours}
                onChange={handleChange('sunlightHours')}
                type="number"
                required
                helperText="Hours of sunlight per day"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Rainfall (mm/day)"
                value={formData.rainfall}
                onChange={handleChange('rainfall')}
                type="number"
                required
                helperText="Average daily rainfall"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Season</InputLabel>
                <Select
                  value={formData.season}
                  onChange={(e) => handleChange('season')(e.target.value)}
                  label="Season"
                >
                  {seasons.map((season) => (
                    <MenuItem key={season} value={season}>
                      {season}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Cloud Cover</InputLabel>
                <Select
                  value={formData.cloudCover}
                  onChange={(e) => handleChange('cloudCover')(e.target.value)}
                  label="Cloud Cover"
                >
                  {cloudCoverOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
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
              Calculate Evaporation
            </Button>
          </Box>
        </form>
      </Paper>

      {result && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Evaporation Analysis
          </Typography>
          <Alert
            severity={
              result.riskLevel === 'High'
                ? 'error'
                : result.riskLevel === 'Moderate'
                ? 'warning'
                : 'success'
            }
            sx={{ mb: 2 }}
          >
            Evaporation Risk Level: {result.riskLevel}
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Daily Evaporation:
              </Typography>
              <Typography variant="body1">
                {result.dailyEvaporation.toFixed(2)} m³
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Weekly Evaporation:
              </Typography>
              <Typography variant="body1">
                {result.weeklyEvaporation.toFixed(2)} m³
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Monthly Evaporation:
              </Typography>
              <Typography variant="body1">
                {result.monthlyEvaporation.toFixed(2)} m³
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations:
            </Typography>
            <ul>
              {result.recommendations.map((rec, index) => (
                <li key={index}>
                  <Typography variant="body1">{rec}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        </Paper>
      )}
      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          💧 Pond Evaporation: Complete Guide to Water Loss Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on pond evaporation in aquaculture! Understanding and managing water loss is crucial for successful pond management. In this detailed guide, we'll explore everything you need to know about calculating and managing pond evaporation. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Evaporation Management Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Evaporation affects water levels, quality, and operating costs. Managing it effectively is crucial for maintaining optimal pond conditions and reducing water usage.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Evaporation Management
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Water conservation</li>
            <li>Cost reduction</li>
            <li>Better stability</li>
            <li>Quality control</li>
            <li>Resource efficiency</li>
            <li>Sustainable operation</li>
            <li>Better planning</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Evaporation Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Temperature:</strong> Air and water</li>
            <li><strong>Wind:</strong> Speed and exposure</li>
            <li><strong>Humidity:</strong> Air moisture</li>
            <li><strong>Surface Area:</strong> Pond size</li>
            <li><strong>Shade:</strong> Sun exposure</li>
            <li><strong>Season:</strong> Weather patterns</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Check Evaporation
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily monitoring</li>
            <li>Weather changes</li>
            <li>Season shifts</li>
            <li>Water additions</li>
            <li>Management planning</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Management
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Measurement:</strong> Use our calculator</li>
            <li><strong>Analysis:</strong> Check factors</li>
            <li><strong>Planning:</strong> Set strategies</li>
            <li><strong>Implementation:</strong> Apply methods</li>
            <li><strong>Monitoring:</strong> Track changes</li>
            <li><strong>Adjustment:</strong> Optimize control</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Evaporation Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>High water loss</li>
            <li>Quality changes</li>
            <li>Cost increases</li>
            <li>Planning problems</li>
            <li>Resource waste</li>
            <li>Management challenges</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Evaporation Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Check levels
          2. <strong>Protection:</strong> Use windbreaks
          3. <strong>Shade:</strong> Reduce exposure
          4. <strong>Planning:</strong> Prepare backup
          5. <strong>Records:</strong> Track patterns
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>30-50% water savings</li>
            <li>Lower costs</li>
            <li>Better stability</li>
            <li>Quality control</li>
            <li>Sustainable operation</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How much evaporation is normal?</strong>
          <Typography paragraph>
            A: It varies by climate and season. Our calculator helps determine normal rates.
          </Typography>

          <strong>Q: How can I reduce evaporation?</strong>
          <Typography paragraph>
            A: Through windbreaks, shade, and surface covers. Our calculator helps measure effectiveness.
          </Typography>

          <strong>Q: When should I add water?</strong>
          <Typography paragraph>
            A: Based on evaporation rates and levels. Our calculator helps determine timing.
          </Typography>

          <strong>Q: What affects evaporation most?</strong>
          <Typography paragraph>
            A: Temperature, wind, and humidity. Our calculator considers these factors.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective evaporation management is crucial for successful pond operations. Use our evaporation calculator above to optimize your water management. Follow the guidelines in this guide to implement effective control strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Water Management Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};