import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  Tooltip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

interface WaterQualityData {
  temperature: number;
  dissolvedOxygen: number;
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  alkalinity: number;
  hardness: number;
  turbidity: number;
  species: string;
  timestamp: string;
}

interface ParameterRange {
  min: number;
  max: number;
  unit: string;
  optimal: { min: number; max: number };
}

const speciesParameters: Record<string, Record<string, ParameterRange>> = {
  tilapia: {
    temperature: { min: 20, max: 35, unit: '°C', optimal: { min: 25, max: 32 } },
    dissolvedOxygen: { min: 3, max: 8, unit: 'mg/L', optimal: { min: 5, max: 7 } },
    ph: { min: 6, max: 9, unit: 'pH', optimal: { min: 6.5, max: 8.5 } },
    ammonia: { min: 0, max: 2, unit: 'mg/L', optimal: { min: 0, max: 0.5 } },
    nitrite: { min: 0, max: 1, unit: 'mg/L', optimal: { min: 0, max: 0.3 } },
    nitrate: { min: 0, max: 100, unit: 'mg/L', optimal: { min: 0, max: 50 } },
    alkalinity: { min: 50, max: 200, unit: 'mg/L', optimal: { min: 100, max: 150 } },
    hardness: { min: 50, max: 200, unit: 'mg/L', optimal: { min: 100, max: 150 } },
    turbidity: { min: 0, max: 50, unit: 'NTU', optimal: { min: 5, max: 25 } },
  },
  carp: {
    temperature: { min: 15, max: 32, unit: '°C', optimal: { min: 20, max: 28 } },
    dissolvedOxygen: { min: 4, max: 8, unit: 'mg/L', optimal: { min: 5, max: 7 } },
    ph: { min: 6.5, max: 9, unit: 'pH', optimal: { min: 7, max: 8.5 } },
    ammonia: { min: 0, max: 1.5, unit: 'mg/L', optimal: { min: 0, max: 0.4 } },
    nitrite: { min: 0, max: 0.8, unit: 'mg/L', optimal: { min: 0, max: 0.2 } },
    nitrate: { min: 0, max: 80, unit: 'mg/L', optimal: { min: 0, max: 40 } },
    alkalinity: { min: 60, max: 200, unit: 'mg/L', optimal: { min: 100, max: 150 } },
    hardness: { min: 60, max: 200, unit: 'mg/L', optimal: { min: 100, max: 150 } },
    turbidity: { min: 0, max: 40, unit: 'NTU', optimal: { min: 5, max: 20 } },
  },
  catfish: {
    temperature: { min: 18, max: 32, unit: '°C', optimal: { min: 24, max: 30 } },
    dissolvedOxygen: { min: 3, max: 8, unit: 'mg/L', optimal: { min: 5, max: 7 } },
    ph: { min: 6, max: 8.5, unit: 'pH', optimal: { min: 6.5, max: 7.5 } },
    ammonia: { min: 0, max: 2, unit: 'mg/L', optimal: { min: 0, max: 0.5 } },
    nitrite: { min: 0, max: 1, unit: 'mg/L', optimal: { min: 0, max: 0.3 } },
    nitrate: { min: 0, max: 100, unit: 'mg/L', optimal: { min: 0, max: 50 } },
    alkalinity: { min: 50, max: 180, unit: 'mg/L', optimal: { min: 80, max: 140 } },
    hardness: { min: 50, max: 180, unit: 'mg/L', optimal: { min: 80, max: 140 } },
    turbidity: { min: 0, max: 50, unit: 'NTU', optimal: { min: 5, max: 25 } },
  },
};

const initialFormData: WaterQualityData = {
  temperature: 0,
  dissolvedOxygen: 0,
  ph: 0,
  ammonia: 0,
  nitrite: 0,
  nitrate: 0,
  alkalinity: 0,
  hardness: 0,
  turbidity: 0,
  species: '',
  timestamp: new Date().toISOString(),
};

const WaterQuality: React.FC = () => {
  const [formData, setFormData] = useState<WaterQualityData>(initialFormData);
  const [history, setHistory] = useState<WaterQualityData[]>([]);
  const [selectedParameter, setSelectedParameter] = useState<string>('temperature');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value),
      timestamp: new Date().toISOString(),
    }));
  };

  const handleSpeciesChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      species: event.target.value,
    }));
  };

  const handleParameterChange = (event: SelectChangeEvent) => {
    setSelectedParameter(event.target.value);
  };

  const addRecord = () => {
    if (!formData.species) return;
    setHistory(prev => [...prev, formData]);
    setFormData(initialFormData);
  };

  const getParameterStatus = (value: number, parameter: string, species: string): 'success' | 'warning' | 'error' => {
    const ranges = speciesParameters[species][parameter];
    if (!ranges) return 'error';

    if (value >= ranges.optimal.min && value <= ranges.optimal.max) return 'success';
    if (value >= ranges.min && value <= ranges.max) return 'warning';
    return 'error';
  };

  const generateRecommendations = (): string[] => {
    if (!formData.species) return [];
    const recommendations: string[] = [];
    const params = speciesParameters[formData.species];

    Object.entries(formData).forEach(([key, value]) => {
      if (key in params) {
        const range = params[key as keyof typeof params];
        if (value < range.optimal.min) {
          recommendations.push(`${key} is too low. Increase to ${range.optimal.min}-${range.optimal.max} ${range.unit}`);
        } else if (value > range.optimal.max) {
          recommendations.push(`${key} is too high. Decrease to ${range.optimal.min}-${range.optimal.max} ${range.unit}`);
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('All parameters are within optimal ranges');
    }

    return recommendations;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Water Quality Monitor
        </Typography>
        <Typography variant="body1" paragraph>
          Monitor and analyze water quality parameters for optimal fish health
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Input Parameters
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Species</InputLabel>
                      <Select
                        value={formData.species}
                        label="Species"
                        onChange={handleSpeciesChange}
                      >
                        <MenuItem value="tilapia">Tilapia</MenuItem>
                        <MenuItem value="carp">Carp</MenuItem>
                        <MenuItem value="catfish">Catfish</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {formData.species && Object.entries(speciesParameters[formData.species]).map(([param, range]) => (
                    <Grid item xs={12} key={param}>
                      <TextField
                        fullWidth
                        label={`${param.charAt(0).toUpperCase() + param.slice(1)} (${range.unit})`}
                        name={param}
                        type="number"
                        value={formData[param as keyof WaterQualityData] || ''}
                        onChange={handleInputChange}
                        InputProps={{
                          inputProps: { min: range.min, max: range.max, step: 0.1 }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Button
                  variant="contained"
                  onClick={addRecord}
                  disabled={!formData.species}
                  sx={{ mt: 2 }}
                >
                  Add Record
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Parameter Analysis
                </Typography>
                {formData.species && (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Parameter</TableCell>
                            <TableCell>Current</TableCell>
                            <TableCell>Optimal Range</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(speciesParameters[formData.species]).map(([param, range]) => (
                            <TableRow key={param}>
                              <TableCell>{param}</TableCell>
                              <TableCell>
                                {formData[param as keyof WaterQualityData]} {range.unit}
                              </TableCell>
                              <TableCell>
                                {range.optimal.min}-{range.optimal.max} {range.unit}
                              </TableCell>
                              <TableCell>
                                <Alert
                                  severity={getParameterStatus(
                                    formData[param as keyof WaterQualityData] as number,
                                    param,
                                    formData.species
                                  )}
                                  sx={{ py: 0 }}
                                >
                                  {getParameterStatus(
                                    formData[param as keyof WaterQualityData] as number,
                                    param,
                                    formData.species
                                  )}
                                </Alert>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Recommendations:
                      </Typography>
                      <ul>
                        {generateRecommendations().map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {history.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Parameter History
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Parameter</InputLabel>
                        <Select
                          value={selectedParameter}
                          label="Parameter"
                          onChange={handleParameterChange}
                        >
                          {Object.keys(speciesParameters[history[0].species]).map(param => (
                            <MenuItem key={param} value={param}>
                              {param.charAt(0).toUpperCase() + param.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ height: 300 }}>
                      <ResponsiveContainer>
                        <LineChart data={history}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                          />
                          <YAxis />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey={selectedParameter}
                            stroke="#8884d8"
                            name={selectedParameter}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          💧 Water Quality: Complete Guide to Aquatic Health
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on water quality in aquaculture! Maintaining optimal water conditions is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about managing and monitoring water quality. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Water Quality Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Water quality directly affects fish health, growth, and survival. It's the foundation of successful aquaculture.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Quality
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
            <li><strong>Oxygen:</strong> Dissolved levels</li>
            <li><strong>pH:</strong> Acid balance</li>
            <li><strong>Temperature:</strong> Heat level</li>
            <li><strong>Ammonia:</strong> Waste products</li>
            <li><strong>Nitrite:</strong> Toxic compounds</li>
            <li><strong>Alkalinity:</strong> Buffer capacity</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Check Quality
        </Typography>
        <Typography variant="body1" paragraph>
          Key monitoring times:
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
          📝 Step-by-Step Testing
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
          💡 Expert Water Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Tests:</strong> Stay vigilant
          2. <strong>Good Records:</strong> Track changes
          3. <strong>Quick Action:</strong> Address issues
          4. <strong>Prevention:</strong> Maintain stability
          5. <strong>Equipment:</strong> Keep calibrated
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Quality
        </Typography>
        <Typography variant="body1" paragraph>
          Proper management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>90%+ survival</li>
            <li>Optimal growth</li>
            <li>Less disease</li>
            <li>Better FCR</li>
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

          <strong>Q: Problem signs?</strong>
          <Typography paragraph>
            A: Multiple indicators. Our tool helps identify.
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
          Proper water quality management is crucial for successful aquaculture operations. Use our water quality tool above to monitor and maintain optimal conditions. Follow the guidelines in this guide to implement effective water management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Water Quality Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default WaterQuality; 