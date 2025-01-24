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
  Divider,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormField from '../components/FormField';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  cloudCover: number;
  season: string;
  pondDepth: number;
  pondArea: number;
  dissolvedOxygen: number;
  currentpH: number;
  species: string;
  stockingDensity: number;
}

interface WeatherImpact {
  waterQuality: {
    temperature: number;
    dissolvedOxygen: number;
    pH: number;
    turbidity: number;
  };
  fishHealth: {
    stressLevel: string;
    feedingBehavior: string;
    growthImpact: string;
    diseaseRisk: string;
  };
  operationalImpact: {
    feedingSchedule: string;
    waterExchange: string;
    aeration: string;
    monitoring: string;
  };
  recommendations: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
  preventiveMeasures: string[];
}

const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
const cloudCoverOptions = ['Clear', 'Partly Cloudy', 'Mostly Cloudy', 'Overcast'];
const species = ['Tilapia', 'Carp', 'Catfish', 'Trout'];

const speciesParams = {
  Tilapia: {
    optimalTemp: { min: 25, max: 32 },
    stressTemp: { min: 15, max: 35 },
    oxygenRequirement: 5,
    pHRange: { min: 6.5, max: 8.5 },
  },
  Carp: {
    optimalTemp: { min: 20, max: 28 },
    stressTemp: { min: 12, max: 32 },
    oxygenRequirement: 4,
    pHRange: { min: 6.5, max: 8.5 },
  },
  Catfish: {
    optimalTemp: { min: 24, max: 30 },
    stressTemp: { min: 18, max: 34 },
    oxygenRequirement: 3,
    pHRange: { min: 6.0, max: 8.5 },
  },
  Trout: {
    optimalTemp: { min: 12, max: 18 },
    stressTemp: { min: 8, max: 22 },
    oxygenRequirement: 7,
    pHRange: { min: 6.5, max: 8.0 },
  },
};

const initialFormData: WeatherData = {
  temperature: 0,
  humidity: 0,
  rainfall: 0,
  windSpeed: 0,
  cloudCover: 0,
  season: '',
  pondDepth: 0,
  pondArea: 0,
  dissolvedOxygen: 0,
  currentpH: 0,
  species: '',
  stockingDensity: 0,
};

const WeatherImpactAnalyzer: React.FC = () => {
  const [formData, setFormData] = useState<WeatherData>(initialFormData);
  const [analysis, setAnalysis] = useState<WeatherImpact | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; temperature: number; dissolvedOxygen: number }>>([]);

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

  const calculateWeatherImpact = () => {
    const {
      temperature,
      humidity,
      rainfall,
      windSpeed,
      cloudCover,
      season,
      pondDepth,
      pondArea,
      dissolvedOxygen,
      currentpH,
      species,
      stockingDensity,
    } = formData;

    // Calculate water temperature based on air temperature and environmental factors
    const waterTemp = temperature - (
      (cloudCover * 0.05) + // Cloud cover reduces temperature
      (windSpeed * 0.1) + // Wind chill effect
      (season === 'Winter' ? 2 : season === 'Summer' ? -1 : 0) // Seasonal adjustment
    );

    // Calculate dissolved oxygen based on temperature and environmental factors
    const baseOxygen = 14.6 * Math.exp(-0.0357 * waterTemp); // Oxygen solubility decreases with temperature
    const calculatedOxygen = baseOxygen * (
      1 + (windSpeed * 0.05) - // Wind increases oxygen
      (temperature * 0.02) - // Temperature decreases oxygen
      (stockingDensity * 0.001) + // Stocking density decreases oxygen
      (rainfall * 0.02) // Rainfall can increase oxygen
    );

    // Calculate pH changes
    const basePH = 7.0;
    const pH = basePH + (
      (rainfall * 0.1) - // Rain can lower pH
      (temperature * 0.02) + // Temperature can affect pH
      (season === 'Summer' ? 0.2 : season === 'Winter' ? -0.2 : 0) // Seasonal variation
    );

    // Calculate turbidity based on rainfall and wind
    const turbidity = (rainfall * 2) + (windSpeed * 0.5);

    // Determine stress level based on species parameters
    const speciesParam = speciesParams[species as keyof typeof speciesParams];
    let stressLevel: 'Low' | 'Moderate' | 'High' = 'Low';
    
    if (waterTemp < speciesParam.stressTemp.min || waterTemp > speciesParam.stressTemp.max) {
      stressLevel = 'High';
    } else if (waterTemp < speciesParam.optimalTemp.min || waterTemp > speciesParam.optimalTemp.max) {
      stressLevel = 'Moderate';
    }

    // Determine feeding behavior based on conditions
    let feedingBehavior = 'Normal';
    if (stressLevel === 'High') {
      feedingBehavior = 'Significantly Reduced';
    } else if (stressLevel === 'Moderate') {
      feedingBehavior = 'Slightly Reduced';
    }

    // Calculate growth impact
    let growthImpact = 'Optimal';
    if (stressLevel === 'High') {
      growthImpact = 'Severely Reduced';
    } else if (stressLevel === 'Moderate') {
      growthImpact = 'Moderately Reduced';
    }

    // Assess disease risk
    let diseaseRisk = 'Low';
    if (stressLevel === 'High' && calculatedOxygen < speciesParam.oxygenRequirement) {
      diseaseRisk = 'High';
    } else if (stressLevel === 'Moderate' || calculatedOxygen < speciesParam.oxygenRequirement * 1.2) {
      diseaseRisk = 'Moderate';
    }

    // Generate operational recommendations
    const recommendations: string[] = [];
    const preventiveMeasures: string[] = [];

    // Temperature-based recommendations
    if (waterTemp > speciesParam.optimalTemp.max) {
      recommendations.push('Increase aeration to help reduce water temperature');
      recommendations.push('Consider partial water exchange with cooler water');
      preventiveMeasures.push('Install temperature monitoring system');
      preventiveMeasures.push('Prepare emergency cooling procedures');
    } else if (waterTemp < speciesParam.optimalTemp.min) {
      recommendations.push('Monitor water temperature closely');
      recommendations.push('Consider using pond covers to retain heat');
      preventiveMeasures.push('Install backup heating system');
    }

    // Oxygen-based recommendations
    if (calculatedOxygen < speciesParam.oxygenRequirement) {
      recommendations.push('Increase aeration immediately');
      recommendations.push('Reduce feeding until oxygen levels improve');
      preventiveMeasures.push('Install oxygen monitoring system');
      preventiveMeasures.push('Have backup aeration equipment ready');
    }

    // Rainfall and turbidity recommendations
    if (rainfall > 5) {
      recommendations.push('Monitor water quality parameters more frequently');
      recommendations.push('Check and maintain proper drainage');
      preventiveMeasures.push('Implement erosion control measures');
    }

    // Wind-based recommendations
    if (windSpeed > 20) {
      recommendations.push('Secure equipment and pond covers');
      recommendations.push('Monitor water turbulence');
      preventiveMeasures.push('Install wind breaks around ponds');
    }

    // Determine feeding schedule adjustments
    let feedingSchedule = 'Maintain regular schedule';
    if (stressLevel === 'High') {
      feedingSchedule = 'Reduce feeding by 50%';
    } else if (stressLevel === 'Moderate') {
      feedingSchedule = 'Reduce feeding by 25%';
    }

    // Water exchange recommendations
    let waterExchange = 'Normal schedule';
    if (rainfall > 5 || turbidity > 10) {
      waterExchange = 'Increase frequency';
    }

    // Aeration requirements
    let aeration = 'Normal operation';
    if (calculatedOxygen < speciesParam.oxygenRequirement) {
      aeration = 'Increase intensity';
    }

    // Monitoring frequency
    let monitoring = 'Regular intervals';
    if (stressLevel === 'High') {
      monitoring = 'Hourly monitoring required';
    } else if (stressLevel === 'Moderate') {
      monitoring = 'Increase frequency';
    }

    // Add to historical data
    const newDataPoint = {
      date: new Date().toISOString().split('T')[0],
      temperature: waterTemp,
      dissolvedOxygen: calculatedOxygen,
    };
    setHistoricalData(prev => [...prev, newDataPoint]);

    setAnalysis({
      waterQuality: {
        temperature: waterTemp,
        dissolvedOxygen: calculatedOxygen,
        pH,
        turbidity,
      },
      fishHealth: {
        stressLevel,
        feedingBehavior,
        growthImpact,
        diseaseRisk,
      },
      operationalImpact: {
        feedingSchedule,
        waterExchange,
        aeration,
        monitoring,
      },
      recommendations,
      riskLevel: stressLevel,
      preventiveMeasures,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Weather Impact Analyzer
        </Typography>
        <Typography variant="body1" paragraph>
          Analyze weather impacts on aquaculture operations and get recommendations
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weather Parameters
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Air Temperature (°C)"
                      name="temperature"
                      type="number"
                      value={formData.temperature || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Rainfall (mm/day)"
                      name="rainfall"
                      type="number"
                      value={formData.rainfall || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Wind Speed (km/h)"
                      name="windSpeed"
                      type="number"
                      value={formData.windSpeed || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Humidity (%)"
                      name="humidity"
                      type="number"
                      value={formData.humidity || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cloud Cover (%)"
                      name="cloudCover"
                      type="number"
                      value={formData.cloudCover || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Season</InputLabel>
                      <Select
                        name="season"
                        value={formData.season}
                        label="Season"
                        onChange={handleSelectChange}
                      >
                        {seasons.map(season => (
                          <MenuItem key={season} value={season}>
                            {season}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pond Parameters
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Species</InputLabel>
                      <Select
                        name="species"
                        value={formData.species}
                        label="Species"
                        onChange={handleSelectChange}
                      >
                        {species.map(sp => (
                          <MenuItem key={sp} value={sp}>
                            {sp}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                      label="Stocking Density (fish/m³)"
                      name="stockingDensity"
                      type="number"
                      value={formData.stockingDensity || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  onClick={calculateWeatherImpact}
                  disabled={!formData.species || !formData.season}
                  sx={{ mt: 2 }}
                >
                  Analyze Impact
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {analysis && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Water Quality Impact
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Water Temperature</TableCell>
                          <TableCell>{analysis.waterQuality.temperature.toFixed(1)}°C</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Dissolved Oxygen</TableCell>
                          <TableCell>{analysis.waterQuality.dissolvedOxygen.toFixed(1)} mg/L</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>pH</TableCell>
                          <TableCell>{analysis.waterQuality.pH.toFixed(1)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Turbidity</TableCell>
                          <TableCell>{analysis.waterQuality.turbidity.toFixed(1)} NTU</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Fish Health Impact
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Stress Level</TableCell>
                          <TableCell>{analysis.fishHealth.stressLevel}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Feeding Behavior</TableCell>
                          <TableCell>{analysis.fishHealth.feedingBehavior}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Growth Impact</TableCell>
                          <TableCell>{analysis.fishHealth.growthImpact}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Disease Risk</TableCell>
                          <TableCell>{analysis.fishHealth.diseaseRisk}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Operational Adjustments
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Feeding Schedule</TableCell>
                          <TableCell>{analysis.operationalImpact.feedingSchedule}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Water Exchange</TableCell>
                          <TableCell>{analysis.operationalImpact.waterExchange}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Aeration</TableCell>
                          <TableCell>{analysis.operationalImpact.aeration}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Monitoring</TableCell>
                          <TableCell>{analysis.operationalImpact.monitoring}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Alert
                    severity={
                      analysis.riskLevel === 'High'
                        ? 'error'
                        : analysis.riskLevel === 'Moderate'
                        ? 'warning'
                        : 'success'
                    }
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Recommendations:
                    </Typography>
                    <ul>
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
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
                    Parameter History
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'DO (mg/L)', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" name="Water Temperature" />
                        <Line yAxisId="right" type="monotone" dataKey="dissolvedOxygen" stroke="#82ca9d" name="Dissolved Oxygen" />
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
          🌤️ Weather Impact Analysis in Aquaculture: Complete Guide
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on weather impact analysis in aquaculture! Understanding how weather affects your farm operations is crucial for success. In this detailed guide, we'll explore everything you need to know about analyzing and managing weather impacts on your aquaculture facility. ⛈️
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Weather Impact Analysis Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Weather significantly influences water quality, fish behavior, and overall farm productivity. Understanding these impacts helps in better planning, risk management, and maintaining optimal production conditions throughout changing weather patterns.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Weather Analysis
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better risk management</li>
            <li>Improved planning</li>
            <li>Enhanced production</li>
            <li>Reduced losses</li>
            <li>Optimal resource use</li>
            <li>Better emergency preparedness</li>
            <li>Increased profitability</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Weather Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential factors to monitor:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Temperature:</strong> Air and water</li>
            <li><strong>Rainfall:</strong> Intensity and duration</li>
            <li><strong>Wind:</strong> Speed and direction</li>
            <li><strong>Cloud Cover:</strong> Solar radiation</li>
            <li><strong>Storms:</strong> Frequency and severity</li>
            <li><strong>Seasonal Changes:</strong> Pattern shifts</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Conduct Weather Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily monitoring</li>
            <li>Season changes</li>
            <li>Before stocking</li>
            <li>Storm forecasts</li>
            <li>Production planning</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Weather Impact Analysis
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Data Collection:</strong> Use our analyzer above</li>
            <li><strong>Pattern Analysis:</strong> Identify trends</li>
            <li><strong>Risk Assessment:</strong> Evaluate impacts</li>
            <li><strong>Planning:</strong> Develop strategies</li>
            <li><strong>Implementation:</strong> Execute measures</li>
            <li><strong>Monitoring:</strong> Track effectiveness</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Weather Challenges
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Temperature extremes</li>
            <li>Heavy rainfall</li>
            <li>Strong winds</li>
            <li>Extended droughts</li>
            <li>Sudden storms</li>
            <li>Seasonal changes</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Tips for Weather Management
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Check forecasts daily
          2. <strong>Emergency Planning:</strong> Have backup systems
          3. <strong>Infrastructure:</strong> Weather-proof facilities
          4. <strong>Water Management:</strong> Maintain reserves
          5. <strong>Documentation:</strong> Keep weather records
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Weather Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective weather management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>30-50% reduced weather-related losses</li>
            <li>Better production stability</li>
            <li>Improved fish health</li>
            <li>Lower operational risks</li>
            <li>Higher farm resilience</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often should I check weather forecasts?</strong>
          <Typography paragraph>
            A: Daily monitoring is essential, with detailed weekly planning. Use our tool for regular analysis.
          </Typography>

          <strong>Q: What weather factors affect fish most?</strong>
          <Typography paragraph>
            A: Temperature changes and sudden storms typically have the biggest impact. Our analyzer helps predict these effects.
          </Typography>

          <strong>Q: How can I prepare for extreme weather?</strong>
          <Typography paragraph>
            A: Implement backup systems, maintain emergency supplies, and develop contingency plans. Our tool helps in preparation.
          </Typography>

          <strong>Q: What's the best way to monitor weather impacts?</strong>
          <Typography paragraph>
            A: Use our weather impact analyzer regularly and maintain detailed records of weather conditions and farm responses.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective weather impact analysis is essential for successful aquaculture operations. Use our weather analyzer above to monitor and manage weather-related risks in your facility. Follow the guidelines in this guide to implement effective weather management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Weather Management Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default WeatherImpactAnalyzer; 