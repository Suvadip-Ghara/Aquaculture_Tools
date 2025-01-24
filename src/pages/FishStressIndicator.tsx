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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import FormField from '../components/FormField';

interface StressData {
  waterTemperature: string;
  dissolvedOxygen: string;
  ph: string;
  behavior: string[];
  feedingResponse: string;
  ammonia: string;
  nitrite: string;
  species: string;
  stockingDensity: string;
  waterFlow: string;
  turbidity: string;
  salinity: string;
}

interface StressAnalysis {
  stressLevel: 'Low' | 'Moderate' | 'High';
  causes: string[];
  recommendations: string[];
  riskFactors: {
    waterQuality: number;
    behavior: number;
    feeding: number;
    environmental: number;
    physiological: number;
  };
  immediateActions: string[];
  longTermActions: string[];
  monitoringPlan: string[];
  economicImpact: {
    growthReduction: number;
    mortalityRisk: number;
    treatmentCost: number;
  };
}

const speciesParameters = {
  tilapia: {
    tempRange: { min: 25, max: 32, optimal: 28 },
    doRange: { min: 3, max: 8, optimal: 5 },
    phRange: { min: 6.5, max: 8.5, optimal: 7.5 },
    ammoniaMax: 0.5,
    nitriteMax: 0.3,
    salinityRange: { min: 0, max: 15, optimal: 0 },
    description: 'Hardy species with good stress tolerance',
  },
  carp: {
    tempRange: { min: 20, max: 28, optimal: 25 },
    doRange: { min: 4, max: 8, optimal: 6 },
    phRange: { min: 6.5, max: 8.5, optimal: 7.2 },
    ammoniaMax: 0.4,
    nitriteMax: 0.2,
    salinityRange: { min: 0, max: 5, optimal: 0 },
    description: 'Adaptable to various water conditions',
  },
  catfish: {
    tempRange: { min: 24, max: 30, optimal: 27 },
    doRange: { min: 3, max: 7, optimal: 5 },
    phRange: { min: 6, max: 8.5, optimal: 7 },
    ammoniaMax: 0.5,
    nitriteMax: 0.3,
    salinityRange: { min: 0, max: 8, optimal: 0 },
    description: 'Tolerant of poor water quality',
  },
  trout: {
    tempRange: { min: 10, max: 20, optimal: 15 },
    doRange: { min: 6, max: 10, optimal: 8 },
    phRange: { min: 6.5, max: 8.5, optimal: 7.5 },
    ammoniaMax: 0.2,
    nitriteMax: 0.1,
    salinityRange: { min: 0, max: 30, optimal: 0 },
    description: 'Sensitive to water quality changes',
  },
};

const behaviorOptions = [
  { value: 'gasping', label: 'Gasping at surface', severity: 3 },
  { value: 'erratic', label: 'Erratic swimming', severity: 2 },
  { value: 'lethargy', label: 'Lethargy', severity: 3 },
  { value: 'crowding', label: 'Crowding at water inlet', severity: 2 },
  { value: 'rubbing', label: 'Rubbing against surfaces', severity: 2 },
  { value: 'color', label: 'Color changes', severity: 2 },
  { value: 'isolation', label: 'Isolation from group', severity: 1 },
  { value: 'aggression', label: 'Increased aggression', severity: 1 },
  { value: 'flashing', label: 'Flashing or scratching', severity: 2 },
  { value: 'clamped', label: 'Clamped fins', severity: 2 },
];

const feedingResponses = [
  { value: 'normal', label: 'Normal appetite', severity: 0 },
  { value: 'reduced', label: 'Reduced appetite', severity: 2 },
  { value: 'none', label: 'No appetite', severity: 3 },
  { value: 'aggressive', label: 'Aggressive feeding', severity: 1 },
];

const initialFormData: StressData = {
  waterTemperature: '',
  dissolvedOxygen: '',
  ph: '',
  behavior: [],
  feedingResponse: '',
  ammonia: '',
  nitrite: '',
  species: '',
  stockingDensity: '',
  waterFlow: '',
  turbidity: '',
  salinity: '',
};

const FishStressIndicator: React.FC = () => {
  const [formData, setFormData] = useState<StressData>(initialFormData);
  const [analysis, setAnalysis] = useState<StressAnalysis | null>(null);

  const handleChange = (field: keyof StressData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBehaviorChange = (behavior: string) => {
    setFormData((prev) => ({
      ...prev,
      behavior: prev.behavior.includes(behavior)
        ? prev.behavior.filter((b) => b !== behavior)
        : [...prev.behavior, behavior],
    }));
  };

  const calculateWaterQualityScore = (params: typeof speciesParameters.tilapia) => {
    const temp = parseFloat(formData.waterTemperature);
    const do_ = parseFloat(formData.dissolvedOxygen);
    const ph = parseFloat(formData.ph);
    const ammonia = parseFloat(formData.ammonia);
    const nitrite = parseFloat(formData.nitrite);
    const salinity = parseFloat(formData.salinity);

    let score = 100;

    // Temperature deviation from optimal
    const tempDeviation = Math.abs(temp - params.tempRange.optimal);
    const tempRange = params.tempRange.max - params.tempRange.min;
    score -= (tempDeviation / tempRange) * 30;

    // Dissolved oxygen
    if (do_ < params.doRange.min) {
      score -= 30;
    } else if (do_ < params.doRange.optimal) {
      score -= 15;
    }

    // pH deviation
    const phDeviation = Math.abs(ph - params.phRange.optimal);
    score -= phDeviation * 10;

    // Ammonia and nitrite
    score -= (ammonia / params.ammoniaMax) * 20;
    score -= (nitrite / params.nitriteMax) * 20;

    // Salinity
    const salinityDeviation = Math.abs(salinity - params.salinityRange.optimal);
    const salinityRange = params.salinityRange.max - params.salinityRange.min;
    score -= (salinityDeviation / salinityRange) * 10;

    return Math.max(0, Math.min(100, score)) / 100;
  };

  const calculateBehaviorScore = () => {
    const totalSeverity = formData.behavior.reduce((sum, behavior) => {
      const option = behaviorOptions.find(opt => opt.value === behavior);
      return sum + (option?.severity || 0);
    }, 0);
    return Math.max(0, 1 - (totalSeverity / (behaviorOptions.length * 3)));
  };

  const calculateFeedingScore = () => {
    const response = feedingResponses.find(resp => resp.value === formData.feedingResponse);
    return response ? 1 - (response.severity / 3) : 1;
  };

  const calculateEnvironmentalScore = () => {
    const density = parseFloat(formData.stockingDensity);
    const flow = parseFloat(formData.waterFlow);
    const turbidity = parseFloat(formData.turbidity);

    let score = 100;

    // Stocking density impact
    if (density > 50) score -= 30;
    else if (density > 30) score -= 15;

    // Water flow impact
    if (flow < 1) score -= 30;
    else if (flow < 2) score -= 15;

    // Turbidity impact
    if (turbidity > 50) score -= 20;
    else if (turbidity > 30) score -= 10;

    return Math.max(0, Math.min(100, score)) / 100;
  };

  const calculatePhysiologicalScore = () => {
    // Combine various physiological indicators
    const behaviorScore = calculateBehaviorScore();
    const feedingScore = calculateFeedingScore();
    return (behaviorScore + feedingScore) / 2;
  };

  const estimateEconomicImpact = (stressLevel: string) => {
    const baseGrowthReduction = stressLevel === 'High' ? 0.3 :
                               stressLevel === 'Moderate' ? 0.15 : 0.05;
    
    const baseMortalityRisk = stressLevel === 'High' ? 0.2 :
                             stressLevel === 'Moderate' ? 0.1 : 0.02;
    
    const baseTreatmentCost = stressLevel === 'High' ? 500 :
                             stressLevel === 'Moderate' ? 200 : 50;

    return {
      growthReduction: baseGrowthReduction,
      mortalityRisk: baseMortalityRisk,
      treatmentCost: baseTreatmentCost,
    };
  };

  const analyzeStress = () => {
    const speciesParams = speciesParameters[formData.species as keyof typeof speciesParameters];
    
    // Calculate risk factors
    const waterQuality = calculateWaterQualityScore(speciesParams);
    const behavior = calculateBehaviorScore();
    const feeding = calculateFeedingScore();
    const environmental = calculateEnvironmentalScore();
    const physiological = calculatePhysiologicalScore();

    // Calculate overall stress level
    const overallScore = (waterQuality + behavior + feeding + environmental + physiological) / 5;
    const stressLevel: 'Low' | 'Moderate' | 'High' = 
      overallScore > 0.7 ? 'Low' :
      overallScore > 0.4 ? 'Moderate' : 'High';

    // Generate causes
    const causes: string[] = [];
    if (waterQuality < 0.6) causes.push('Poor water quality parameters');
    if (behavior < 0.6) causes.push('Abnormal behavior patterns');
    if (feeding < 0.6) causes.push('Reduced feeding response');
    if (environmental < 0.6) causes.push('Suboptimal environmental conditions');
    if (physiological < 0.6) causes.push('Physiological stress indicators');

    // Generate recommendations
    const recommendations = [
      waterQuality < 0.6 ? `Optimize water parameters for ${formData.species} (Temp: ${speciesParams.tempRange.optimal}°C, DO: ${speciesParams.doRange.optimal} mg/L)` : null,
      behavior < 0.6 ? 'Monitor fish behavior closely and identify specific stressors' : null,
      feeding < 0.6 ? 'Adjust feeding regime and monitor feed consumption' : null,
      environmental < 0.6 ? 'Improve environmental conditions (water flow, stocking density)' : null,
    ].filter(Boolean) as string[];

    // Generate immediate actions
    const immediateActions = [
      waterQuality < 0.4 ? 'Perform emergency water exchange' : null,
      behavior < 0.4 ? 'Isolate affected fish if possible' : null,
      feeding < 0.4 ? 'Temporarily reduce feeding rate' : null,
      environmental < 0.4 ? 'Increase aeration immediately' : null,
    ].filter(Boolean) as string[];

    // Generate long-term actions
    const longTermActions = [
      'Implement regular water quality monitoring schedule',
      'Develop emergency response protocols',
      'Train staff in stress recognition and management',
      'Upgrade water treatment systems if necessary',
      'Review and optimize feeding protocols',
    ];

    // Generate monitoring plan
    const monitoringPlan = [
      'Daily water quality checks',
      'Twice daily behavior observations',
      'Weekly growth sampling',
      'Monthly health assessment',
      'Regular stress indicator monitoring',
    ];

    // Calculate economic impact
    const economicImpact = estimateEconomicImpact(stressLevel);

    return {
      stressLevel,
      causes,
      recommendations,
      riskFactors: {
        waterQuality,
        behavior,
        feeding,
        environmental,
        physiological,
      },
      immediateActions,
      longTermActions,
      monitoringPlan,
      economicImpact,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = analyzeStress();
    setAnalysis(result);
  };

  const getRadarData = () => {
    if (!analysis) return [];
    const { riskFactors } = analysis;
    return [
      {
        category: 'Water Quality',
        value: riskFactors.waterQuality * 100,
      },
      {
        category: 'Behavior',
        value: riskFactors.behavior * 100,
      },
      {
        category: 'Feeding',
        value: riskFactors.feeding * 100,
      },
      {
        category: 'Environmental',
        value: riskFactors.environmental * 100,
      },
      {
        category: 'Physiological',
        value: riskFactors.physiological * 100,
      },
    ];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fish Stress Indicator
      </Typography>
      <Typography variant="body1" paragraph>
        Comprehensive analysis of fish stress levels based on multiple parameters and behavioral indicators
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Species and Water Parameters
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
                      {Object.entries(speciesParameters).map(([key, { description }]) => (
                        <MenuItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    label="Dissolved Oxygen (mg/L)"
                    value={formData.dissolvedOxygen}
                    onChange={handleChange('dissolvedOxygen')}
                    type="number"
                    required
                    helperText="Current dissolved oxygen level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="pH Level"
                    value={formData.ph}
                    onChange={handleChange('ph')}
                    type="number"
                    required
                    helperText="Current pH level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Ammonia (mg/L)"
                    value={formData.ammonia}
                    onChange={handleChange('ammonia')}
                    type="number"
                    required
                    helperText="Current ammonia level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Nitrite (mg/L)"
                    value={formData.nitrite}
                    onChange={handleChange('nitrite')}
                    type="number"
                    required
                    helperText="Current nitrite level"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Salinity (ppt)"
                    value={formData.salinity}
                    onChange={handleChange('salinity')}
                    type="number"
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
                Environmental Conditions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Stocking Density (kg/m³)"
                    value={formData.stockingDensity}
                    onChange={handleChange('stockingDensity')}
                    type="number"
                    required
                    helperText="Current stocking density"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Water Flow (L/min)"
                    value={formData.waterFlow}
                    onChange={handleChange('waterFlow')}
                    type="number"
                    required
                    helperText="Current water flow rate"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Turbidity (NTU)"
                    value={formData.turbidity}
                    onChange={handleChange('turbidity')}
                    type="number"
                    required
                    helperText="Current turbidity level"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Feeding Response</InputLabel>
                    <Select
                      name="feedingResponse"
                      value={formData.feedingResponse}
                      label="Feeding Response"
                      onChange={handleSelectChange}
                    >
                      {feedingResponses.map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                          {label}
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
                Behavioral Indicators
              </Typography>
              <FormGroup>
                <Grid container spacing={1}>
                  {behaviorOptions.map(({ value, label, severity }) => (
                    <Grid item xs={12} sm={6} key={value}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.behavior.includes(value)}
                            onChange={() => handleBehaviorChange(value)}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {label}
                            <Tooltip title={`Severity: ${severity}/3`}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!formData.species || !formData.waterTemperature || !formData.dissolvedOxygen}
                >
                  Analyze Stress Levels
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {analysis && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Stress Analysis Results
                </Typography>
                <Alert
                  severity={
                    analysis.stressLevel === 'High' ? 'error' :
                    analysis.stressLevel === 'Moderate' ? 'warning' :
                    'success'
                  }
                  sx={{ mb: 2 }}
                >
                  <Typography variant="subtitle1">
                    Overall Stress Level: {analysis.stressLevel}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Primary Causes:
                    <ul style={{ marginTop: 4, marginBottom: 0 }}>
                      {analysis.causes.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </Typography>
                </Alert>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Risk Factor Analysis
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Risk Factors"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Economic Impact
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Growth Reduction</TableCell>
                        <TableCell>{(analysis.economicImpact.growthReduction * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mortality Risk</TableCell>
                        <TableCell>{(analysis.economicImpact.mortalityRisk * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Estimated Treatment Cost</TableCell>
                        <TableCell>${analysis.economicImpact.treatmentCost.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Immediate Actions Required:
                  </Typography>
                  <ul>
                    {analysis.immediateActions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </Alert>

                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Long-term Management Plan:
                  </Typography>
                  <ul>
                    {analysis.longTermActions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </Alert>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Monitoring Plan:
                  </Typography>
                  <ul>
                    {analysis.monitoringPlan.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🐟 Fish Stress Monitoring: Complete Guide to Health Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on fish stress monitoring in aquaculture! Understanding and managing stress levels in your fish population is crucial for optimal growth and survival. In this detailed guide, we'll explore everything you need to know about monitoring and reducing stress in your aquaculture facility. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Stress Monitoring Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Stress monitoring helps prevent disease outbreaks, optimize growth rates, and maintain healthy fish populations. Early detection of stress factors allows for timely interventions, ensuring better production outcomes and fish welfare.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Stress Monitoring
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Early problem detection</li>
            <li>Improved fish health</li>
            <li>Better growth rates</li>
            <li>Reduced mortality</li>
            <li>Enhanced feed efficiency</li>
            <li>Better product quality</li>
            <li>Increased profitability</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Stress Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential factors to monitor:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Water Quality:</strong> Oxygen, pH, ammonia</li>
            <li><strong>Temperature:</strong> Changes and extremes</li>
            <li><strong>Handling:</strong> Management practices</li>
            <li><strong>Stocking Density:</strong> Space per fish</li>
            <li><strong>Feed Quality:</strong> Nutritional status</li>
            <li><strong>Disease Pressure:</strong> Health status</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Monitor Stress
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily routine checks</li>
            <li>During handling</li>
            <li>After feeding</li>
            <li>Weather changes</li>
            <li>Management activities</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Stress Assessment
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Visual Check:</strong> Observe behavior</li>
            <li><strong>Parameter Testing:</strong> Use our tool above</li>
            <li><strong>Data Analysis:</strong> Identify patterns</li>
            <li><strong>Risk Assessment:</strong> Evaluate impact</li>
            <li><strong>Action Planning:</strong> Develop solutions</li>
            <li><strong>Implementation:</strong> Apply measures</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Stress Signs
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Abnormal swimming</li>
            <li>Reduced feeding</li>
            <li>Surface gasping</li>
            <li>Color changes</li>
            <li>Increased mortality</li>
            <li>Growth reduction</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Tips for Stress Management
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Check daily
          2. <strong>Gentle Handling:</strong> Minimize disturbance
          3. <strong>Water Quality:</strong> Maintain stability
          4. <strong>Feeding:</strong> Follow schedules
          5. <strong>Environment:</strong> Reduce fluctuations
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Stress Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective stress management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>40-60% better growth rates</li>
            <li>Reduced disease outbreaks</li>
            <li>Improved feed conversion</li>
            <li>Better survival rates</li>
            <li>Higher product quality</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often should I check for stress?</strong>
          <Typography paragraph>
            A: Daily monitoring is essential, with detailed assessments during critical activities. Use our tool regularly.
          </Typography>

          <strong>Q: What are the first signs of stress?</strong>
          <Typography paragraph>
            A: Changes in feeding behavior and swimming patterns are typically the first indicators. Our tool helps detect early signs.
          </Typography>

          <strong>Q: How can I reduce stress levels?</strong>
          <Typography paragraph>
            A: Maintain stable conditions, minimize handling, and ensure good water quality. Our indicator provides specific recommendations.
          </Typography>

          <strong>Q: Which parameters matter most?</strong>
          <Typography paragraph>
            A: Dissolved oxygen and temperature are critical. Use our stress indicator to monitor these key parameters.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective stress monitoring and management are fundamental to successful aquaculture operations. Use our stress indicator above to monitor and manage stress levels in your facility. Follow the guidelines in this guide to implement effective stress management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Health Management Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default FishStressIndicator; 