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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
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

interface PredictionData {
  species: string;
  temperature: string;
  pH: string;  // Consistently use pH
  dissolvedOxygen: string;
  ammonia: string;
  nitrite: string;
  nitrate: string;
  alkalinity: string;
  hardness: string;
  turbidity: string;
  salinity: string;
  feedingRate: string;
  stockingDensity: string;
  waterExchangeRate: string;
  sunlight: string;
  rainfall: string;
  pondSize: string;
  fishBiomass: string;
  aerationHours: string;
  cloudCover: string;
  season: string;
}

interface PredictionResult {
  parameter: string;
  current: number;
  predicted: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  risk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface ChartData {
  time: string;
  temperature: number;
  dissolvedOxygen: number;
  pH: number;
  ammonia: number;
}

const initialFormData: PredictionData = {
  temperature: '',
  pH: '',
  dissolvedOxygen: '',
  ammonia: '',
  nitrite: '',
  nitrate: '',
  alkalinity: '',
  hardness: '',
  turbidity: '',
  salinity: '',
  feedingRate: '',
  stockingDensity: '',
  waterExchangeRate: '',
  sunlight: '',
  rainfall: '',
  species: '',
  pondSize: '',
  fishBiomass: '',
  aerationHours: '',
  cloudCover: '',
  season: '',
};

const speciesParameters = {
  tilapia: {
    tempRange: { min: 25, max: 32 },
    pHRange: { min: 6.5, max: 8.5 },
    doRange: { min: 4, max: 8 },
    ammoniaMax: 0.5,
  },
  carp: {
    tempRange: { min: 20, max: 28 },
    pHRange: { min: 6.5, max: 8.5 },
    doRange: { min: 5, max: 8 },
    ammoniaMax: 0.4,
  },
  catfish: {
    tempRange: { min: 24, max: 30 },
    pHRange: { min: 6.5, max: 7.5 },
    doRange: { min: 3, max: 7 },
    ammoniaMax: 0.5,
  },
};

const WaterQualityPredictor: React.FC = () => {
  const [formData, setFormData] = useState<PredictionData>(initialFormData);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof PredictionData) => (value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: String(value) }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const predictTemperature = (current: number, sunlight: number, rainfall: number): number[] => {
    const predictions: number[] = [];
    for (let i = 0; i < 48; i++) {
      const hourOfDay = i % 24;
      const sunlightEffect = hourOfDay >= 6 && hourOfDay <= 18 ? sunlight * 0.1 : -0.05;
      const rainfallEffect = rainfall > 0 ? -rainfall * 0.2 : 0;
      const newTemp = current + sunlightEffect + rainfallEffect + Math.random() * 0.2 - 0.1;
      predictions.push(Number(newTemp.toFixed(1)));
    }
    return predictions;
  };

  const predictDissolvedOxygen = (
    temp: number,
    feedingRate: number,
    stockingDensity: number
  ): number[] => {
    const predictions: number[] = [];
    for (let i = 0; i < 48; i++) {
      const hourOfDay = i % 24;
      const tempEffect = -0.1 * (temp - 25);
      const feedingEffect = -0.2 * feedingRate;
      const densityEffect = -0.1 * stockingDensity;
      const photoEffect = hourOfDay >= 6 && hourOfDay <= 18 ? 0.5 : -0.3;
      const newDO =
        6 + tempEffect + feedingEffect + densityEffect + photoEffect + Math.random() * 0.2 - 0.1;
      predictions.push(Number(newDO.toFixed(1)));
    }
    return predictions;
  };

  const predictPH = (current: number, feedingRate: number, rainfall: number): number[] => {
    const predictions: number[] = [];
    for (let i = 0; i < 48; i++) {
      const feedingEffect = -0.05 * feedingRate;
      const rainfallEffect = rainfall > 0 ? -rainfall * 0.1 : 0;
      const newPH = current + feedingEffect + rainfallEffect + Math.random() * 0.2 - 0.1;
      predictions.push(Number(newPH.toFixed(1)));
    }
    return predictions;
  };

  const predictAmmonia = (
    temp: number,
    feedingRate: number,
    waterExchange: number
  ): number[] => {
    const predictions: number[] = [];
    for (let i = 0; i < 48; i++) {
      const tempEffect = 0.01 * (temp - 25);
      const feedingEffect = 0.02 * feedingRate;
      const exchangeEffect = -0.05 * waterExchange;
      const newAmmonia =
        0.5 + tempEffect + feedingEffect + exchangeEffect + Math.random() * 0.1 - 0.05;
      predictions.push(Number(Math.max(0, newAmmonia).toFixed(2)));
    }
    return predictions;
  };

  const generatePredictions = () => {
    const temp = parseFloat(formData.temperature);
    const do_ = parseFloat(formData.dissolvedOxygen);
    const pH = parseFloat(formData.pH);
    const ammonia = parseFloat(formData.ammonia);
    const feeding = parseFloat(formData.feedingRate);
    const density = parseFloat(formData.stockingDensity);
    const exchange = parseFloat(formData.waterExchangeRate);
    const sun = parseFloat(formData.sunlight);
    const rain = parseFloat(formData.rainfall);

    const tempPredictions = predictTemperature(temp, sun, rain);
    const doPredictions = predictDissolvedOxygen(temp, feeding, density);
    const phPredictions = predictPH(pH, feeding, rain);
    const ammoniaPredictions = predictAmmonia(temp, feeding, exchange);

    const chartData: ChartData[] = Array.from({ length: 48 }, (_, i) => ({
      time: `${i}h`,
      temperature: tempPredictions[i],
      dissolvedOxygen: doPredictions[i],
      pH: phPredictions[i],
      ammonia: ammoniaPredictions[i],
    }));

    const results: PredictionResult[] = [
      {
        parameter: 'Temperature',
        current: temp,
        predicted: tempPredictions[47],
        trend: tempPredictions[47] > temp ? 'increasing' : 'decreasing',
        risk: getRiskLevel(tempPredictions[47], 20, 25, 30),
        recommendations: getTemperatureRecommendations(tempPredictions[47]),
      },
      {
        parameter: 'Dissolved Oxygen',
        current: do_,
        predicted: doPredictions[47],
        trend: doPredictions[47] > do_ ? 'increasing' : 'decreasing',
        risk: getRiskLevel(doPredictions[47], 4, 5, 8),
        recommendations: getDORecommendations(doPredictions[47]),
      },
      {
        parameter: 'pH',
        current: ph,
        predicted: phPredictions[47],
        trend: phPredictions[47] > ph ? 'increasing' : 'decreasing',
        risk: getRiskLevel(phPredictions[47], 6.5, 7, 8.5),
        recommendations: getPHRecommendations(phPredictions[47]),
      },
      {
        parameter: 'Ammonia',
        current: ammonia,
        predicted: ammoniaPredictions[47],
        trend: ammoniaPredictions[47] > ammonia ? 'increasing' : 'decreasing',
        risk: getRiskLevel(ammoniaPredictions[47], 0, 0.5, 1),
        recommendations: getAmmoniaRecommendations(ammoniaPredictions[47]),
      },
    ];

    setPredictions(results);
    setChartData(chartData);
    setShowResults(true);
  };

  const getRiskLevel = (value: number, low: number, medium: number, high: number): 'low' | 'medium' | 'high' => {
    if (value <= low || value >= high) return 'high';
    if (value < medium) return 'medium';
    return 'low';
  };

  const getTemperatureRecommendations = (temp: number): string[] => {
    if (temp > 30) {
      return [
        'Increase water exchange rate',
        'Add shading to reduce sunlight exposure',
        'Consider reducing feeding rate',
      ];
    }
    if (temp < 20) {
      return [
        'Add heating if available',
        'Reduce water exchange rate',
        'Monitor fish behavior closely',
      ];
    }
    return ['Maintain current management practices', 'Continue regular monitoring'];
  };

  const getDORecommendations = (do_: number): string[] => {
    if (do_ < 4) {
      return [
        'Increase aeration immediately',
        'Reduce feeding rate',
        'Consider emergency water exchange',
      ];
    }
    if (do_ < 5) {
      return [
        'Increase aeration',
        'Monitor fish behavior',
        'Check aeration system efficiency',
      ];
    }
    return ['Maintain current aeration levels', 'Continue regular monitoring'];
  };

  const getPHRecommendations = (ph: number): string[] => {
    if (ph < 6.5 || ph > 8.5) {
      return [
        'Apply pH buffer as needed',
        'Check alkalinity levels',
        'Increase water exchange rate',
      ];
    }
    if (ph < 7 || ph > 8) {
      return [
        'Monitor more frequently',
        'Prepare pH adjustment if trend continues',
        'Check feeding rate',
      ];
    }
    return ['Maintain current management practices', 'Continue regular monitoring'];
  };

  const getAmmoniaRecommendations = (ammonia: number): string[] => {
    if (ammonia > 1) {
      return [
        'Stop feeding immediately',
        'Increase water exchange rate',
        'Add zeolite if available',
      ];
    }
    if (ammonia > 0.5) {
      return [
        'Reduce feeding rate',
        'Increase aeration',
        'Monitor biofilter performance',
      ];
    }
    return ['Maintain current management practices', 'Continue regular monitoring'];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Water Quality Predictor
      </Typography>
      <Typography variant="body1" paragraph>
        Predict water quality changes over the next 48 hours based on current conditions and management practices
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Species</InputLabel>
                    <Select
                      name="species"
                      value={formData.species}
                      label="Species"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="tilapia">Tilapia</MenuItem>
                      <MenuItem value="carp">Carp</MenuItem>
                      <MenuItem value="catfish">Catfish</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Water Temperature (°C)"
                    value={formData.temperature}
                    onChange={handleInputChange('temperature')}
                    required
                    helperText="Current water temperature"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="pH Level"
                    value={formData.pH}
                    onChange={handleInputChange('pH')}
                    required
                    helperText="Current pH level (6.5-8.5)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Dissolved Oxygen (mg/L)"
                    value={formData.dissolvedOxygen}
                    onChange={handleInputChange('dissolvedOxygen')}
                    required
                    helperText="Current dissolved oxygen level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Ammonia Level (mg/L)"
                    value={formData.ammonia}
                    onChange={handleInputChange('ammonia')}
                    required
                    helperText="Current ammonia concentration"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Nitrite Level (mg/L)"
                    value={formData.nitrite}
                    onChange={handleInputChange('nitrite')}
                    required
                    helperText="Current nitrite concentration"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Nitrate Level (mg/L)"
                    value={formData.nitrate}
                    onChange={handleInputChange('nitrate')}
                    required
                    helperText="Current nitrate concentration"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Alkalinity (mg/L)"
                    value={formData.alkalinity}
                    onChange={handleInputChange('alkalinity')}
                    required
                    helperText="Current alkalinity level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Hardness (mg/L)"
                    value={formData.hardness}
                    onChange={handleInputChange('hardness')}
                    required
                    helperText="Current hardness level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Turbidity (NTU)"
                    value={formData.turbidity}
                    onChange={handleInputChange('turbidity')}
                    required
                    helperText="Current turbidity level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    type="number"
                    label="Salinity (ppt)"
                    value={formData.salinity}
                    onChange={handleInputChange('salinity')}
                    required
                    helperText="Current salinity level"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Management Factors
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Pond Size (m²)"
                    value={formData.pondSize}
                    onChange={handleInputChange('pondSize')}
                    type="number"
                    required
                    helperText="Surface area of the pond"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Fish Biomass (kg)"
                    value={formData.fishBiomass}
                    onChange={handleInputChange('fishBiomass')}
                    type="number"
                    required
                    helperText="Total weight of fish"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Daily Feeding Rate (kg)"
                    value={formData.feedingRate}
                    onChange={handleInputChange('feedingRate')}
                    type="number"
                    required
                    helperText="Amount of feed per day"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Water Exchange Rate (%/day)"
                    value={formData.waterExchangeRate}
                    onChange={handleInputChange('waterExchangeRate')}
                    type="number"
                    required
                    helperText="Daily water exchange percentage"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Aeration Hours"
                    value={formData.aerationHours}
                    onChange={handleInputChange('aerationHours')}
                    type="number"
                    required
                    helperText="Hours of aeration per day"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Cloud Cover (%)"
                    value={formData.cloudCover}
                    onChange={handleInputChange('cloudCover')}
                    type="number"
                    required
                    helperText="Percentage of cloud coverage"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Season</InputLabel>
                    <Select
                      name="season"
                      value={formData.season}
                      label="Season"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="spring">Spring</MenuItem>
                      <MenuItem value="summer">Summer</MenuItem>
                      <MenuItem value="autumn">Autumn</MenuItem>
                      <MenuItem value="winter">Winter</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={generatePredictions}
                  disabled={!formData.species || !formData.temperature || !formData.pH || !formData.dissolvedOxygen || !formData.ammonia}
                >
                  Generate Predictions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {showResults && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  48-Hour Prediction Results
                </Typography>
                
                <Alert
                  severity={
                    getRiskLevel(chartData[47].temperature, 20, 25, 30) === 'high' ? 'error' :
                    getRiskLevel(chartData[47].temperature, 20, 25, 30) === 'medium' ? 'warning' :
                    'success'
                  }
                  sx={{ mb: 2 }}
                >
                  <Typography variant="subtitle1">
                    Risk Level: {getRiskLevel(chartData[47].temperature, 20, 25, 30).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Recommendations:
                    <ul style={{ marginTop: 4, marginBottom: 0 }}>
                      {getTemperatureRecommendations(chartData[47].temperature).map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </Typography>
                </Alert>

                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#8884d8"
                        name="Temperature (°C)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Parameter</TableCell>
                        <TableCell>Current</TableCell>
                        <TableCell>Min (48h)</TableCell>
                        <TableCell>Max (48h)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Temperature (°C)</TableCell>
                        <TableCell>{chartData[0].temperature.toFixed(1)}</TableCell>
                        <TableCell>{Math.min(...chartData.map(d => d.temperature)).toFixed(1)}</TableCell>
                        <TableCell>{Math.max(...chartData.map(d => d.temperature)).toFixed(1)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>pH</TableCell>
                        <TableCell>{chartData[0].pH.toFixed(1)}</TableCell>
                        <TableCell>{Math.min(...chartData.map(d => d.pH)).toFixed(1)}</TableCell>
                        <TableCell>{Math.max(...chartData.map(d => d.pH)).toFixed(1)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>DO (mg/L)</TableCell>
                        <TableCell>{chartData[0].dissolvedOxygen.toFixed(1)}</TableCell>
                        <TableCell>{Math.min(...chartData.map(d => d.dissolvedOxygen)).toFixed(1)}</TableCell>
                        <TableCell>{Math.max(...chartData.map(d => d.dissolvedOxygen)).toFixed(1)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Ammonia (mg/L)</TableCell>
                        <TableCell>{chartData[0].ammonia.toFixed(2)}</TableCell>
                        <TableCell>{Math.min(...chartData.map(d => d.ammonia)).toFixed(2)}</TableCell>
                        <TableCell>{Math.max(...chartData.map(d => d.ammonia)).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          💧 Water Quality Prediction: Complete Guide to Aquaculture Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on water quality prediction in aquaculture! Understanding and managing water quality is fundamental to successful fish farming. In this detailed guide, we'll explore everything you need to know about predicting and maintaining optimal water conditions in your aquaculture facility. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Water Quality Prediction Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Water quality prediction helps prevent problems before they occur, optimize growth conditions, and maintain healthy fish populations. Early detection of potential issues allows for proactive management, ensuring better production outcomes.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Quality Prediction
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Problem prevention</li>
            <li>Improved fish health</li>
            <li>Better growth rates</li>
            <li>Reduced mortality</li>
            <li>Optimal feeding efficiency</li>
            <li>Lower treatment costs</li>
            <li>Increased profitability</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Water Parameters
        </Typography>
        <Typography variant="body1" paragraph>
          Essential factors to monitor:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Dissolved Oxygen:</strong> Vital for survival</li>
            <li><strong>Temperature:</strong> Growth impact</li>
            <li><strong>pH Levels:</strong> Chemical balance</li>
            <li><strong>Ammonia:</strong> Toxic buildup</li>
            <li><strong>Nitrite/Nitrate:</strong> Nitrogen cycle</li>
            <li><strong>Alkalinity:</strong> Buffer capacity</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Predict Quality
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily monitoring</li>
            <li>Before feeding</li>
            <li>Weather changes</li>
            <li>Stocking events</li>
            <li>Treatment planning</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Quality Assessment
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Data Collection:</strong> Use our predictor above</li>
            <li><strong>Trend Analysis:</strong> Study patterns</li>
            <li><strong>Risk Evaluation:</strong> Identify issues</li>
            <li><strong>Action Planning:</strong> Develop solutions</li>
            <li><strong>Implementation:</strong> Apply measures</li>
            <li><strong>Monitoring:</strong> Track results</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Quality Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Low oxygen levels</li>
            <li>Temperature fluctuations</li>
            <li>pH imbalances</li>
            <li>Ammonia spikes</li>
            <li>Algae blooms</li>
            <li>Turbidity changes</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Tips for Quality Management
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Testing:</strong> Monitor daily
          2. <strong>Data Recording:</strong> Keep detailed logs
          3. <strong>Equipment Maintenance:</strong> Calibrate regularly
          4. <strong>Emergency Planning:</strong> Have backup systems
          5. <strong>Staff Training:</strong> Ensure proper sampling
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Quality Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective quality management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>30-50% better growth rates</li>
            <li>Reduced disease incidence</li>
            <li>Improved feed conversion</li>
            <li>Lower mortality rates</li>
            <li>Higher product quality</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often should I test water quality?</strong>
          <Typography paragraph>
            A: Daily monitoring of critical parameters is essential. Use our predictor for regular assessments.
          </Typography>

          <strong>Q: What's the most important parameter?</strong>
          <Typography paragraph>
            A: Dissolved oxygen is typically most critical. Our predictor helps monitor and forecast oxygen levels.
          </Typography>

          <strong>Q: How can I improve water quality?</strong>
          <Typography paragraph>
            A: Regular water exchange, proper aeration, and good management practices. Our tool provides specific recommendations.
          </Typography>

          <strong>Q: When should I take action?</strong>
          <Typography paragraph>
            A: Take action when parameters approach critical levels. Our predictor helps identify when intervention is needed.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective water quality prediction is fundamental to successful aquaculture operations. Use our quality predictor above to monitor and manage water conditions in your facility. Follow the guidelines in this guide to implement effective water quality management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Water Quality Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default WaterQualityPredictor; 