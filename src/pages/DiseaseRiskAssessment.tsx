import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
} from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import FormField from '../components/FormField';

interface CriticalParameters {
  temperature: { min: number; max: number };
  do?: { min: number; max: number };
  pH: { min: number; max: number };
}

interface Disease {
  name: string;
  description: string;
  riskFactors: string[];
  symptoms: string[];
  criticalParameters: CriticalParameters;
  preventiveMeasures: string[];
  treatments: string[];
}

interface FormData {
  temperature: string;
  pH: string;
  dissolvedOxygen: string;
  symptoms: string[];
  riskFactors: string[];
  ammonia: string;
  nitrite: string;
  species: string;
  ageGroup: string;
  feedType: string;
  waterSource: string;
  stockingDensity: string;
  behavior: string[];
  mortalityRate: string;
  feedingRate: string;
}

interface RiskData {
  // Water quality parameters
  temperature: string;
  dissolvedOxygen: string;
  pH: string;
  ammonia: string;
  nitrite: string;
  alkalinity: string;
  hardness: string;
  turbidity: string;
  salinity: string;
  carbonDioxide: string;
  
  // Fish behavior and symptoms
  behavior: string[];
  feedingResponse: string;
  mortalityRate: string;
  
  // Environmental factors
  stockingDensity: string;
  waterExchangeRate: string;
  pondAge: string;
  seasonType: string;
  waterSource: string;
  previousDiseases: string[];
  lastTreatmentDate: string;
  species: string;
  waterTemperature: string;
  feedingRate: string;
  mortality: string;
  symptoms: string[];
}

interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  status: 'low' | 'medium' | 'high';
}

interface DiseaseRisk {
  disease: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  preventiveMeasures: string[];
  treatments: string[];
}

interface DiseaseInfo {
  name: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
  riskFactors: string[];
  criticalParameters: {
    temperature?: [number, number];
    pH?: [number, number];
    do?: number;
  };
  treatmentCost?: {
    low: number;
    high: number;
  };
}

interface SeasonalPattern {
  season: string;
  commonDiseases: string[];
  preventiveMeasures: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
}

const initialFormData: FormData = {
  temperature: '',
  pH: '',
  dissolvedOxygen: '',
  symptoms: [],
  riskFactors: [],
  ammonia: '',
  nitrite: '',
  species: '',
  ageGroup: '',
  feedType: '',
  waterSource: '',
  stockingDensity: '',
};

const behaviorSymptoms = [
  'Lethargy',
  'Erratic swimming',
  'Gasping at surface',
  'Red/inflamed gills',
  'Skin lesions',
  'White spots on skin',
  'Bloated abdomen',
  'Fin rot',
  'Color changes',
  'Excess mucus production',
  'Scale loss',
  'Pop-eye condition',
  'Ulcers',
  'Hemorrhages',
  'Cotton-like growth',
  'Black/brown spots',
  'Rapid operculum movement',
  'Flashing behavior',
  'Tail/fin erosion',
  'Body deformities',
];

const feedingResponses = [
  'Normal appetite',
  'Slightly reduced appetite',
  'Severely reduced appetite',
  'No appetite',
];

const seasonTypes = [
  'Summer',
  'Rainy',
  'Winter',
  'Spring',
];

const previousDiseasesList = [
  'White Spot Disease',
  'Bacterial Gill Disease',
  'Columnaris',
  'Aeromonas Infection',
  'Saprolegniasis',
  'Trichodiniasis',
];

const diseases: DiseaseInfo[] = [
  {
    name: 'White Spot Disease (Ich)',
    symptoms: ['White spots on skin', 'Flashing behavior', 'Rapid breathing'],
    treatments: [
      'Increase temperature to 30°C gradually',
      'Salt treatment (0.15-0.3%)',
      'Commercial ich treatment',
      'Formalin bath treatment'
    ],
    prevention: [
      'Quarantine new fish',
      'Maintain optimal water quality',
      'Regular health monitoring'
    ],
    riskFactors: ['Low temperature', 'Stressed fish', 'Poor water quality'],
    criticalParameters: {
      temperature: { min: 24, max: 26 },
      pH: { min: 6.5, max: 8.0 },
      do: { min: 5, max: 8 }
    }
  },
  {
    name: 'Bacterial Gill Disease',
    symptoms: ['Red/inflamed gills', 'Gasping at surface', 'Excess mucus production'],
    treatments: [
      'Antibiotic treatment under veterinary guidance',
      'Potassium permanganate bath',
      'Improve aeration'
    ],
    prevention: [
      'Maintain good water quality',
      'Avoid overcrowding',
      'Regular gill checks'
    ],
    riskFactors: ['High ammonia', 'Low oxygen', 'High organic load'],
    criticalParameters: {
      temperature: { min: 20, max: 28 },
      do: { min: 6, max: 9 }
    }
  },
  {
    name: 'Columnaris Disease',
    symptoms: ['Skin lesions', 'Cotton-like growth', 'Fin rot'],
    treatments: [
      'Antibiotic treatment',
      'Salt bath treatment',
      'Copper sulfate treatment'
    ],
    prevention: [
      'Reduce stress factors',
      'Maintain clean environment',
      'Regular water changes'
    ],
    riskFactors: ['High temperature', 'Poor water quality', 'Physical injury'],
    criticalParameters: {
      temperature: { min: 20, max: 30 },
      pH: { min: 6.0, max: 8.0 }
    }
  },
  {
    name: 'Saprolegniasis (Fungal Infection)',
    symptoms: ['Cotton-like growth', 'Scale loss', 'Lethargy'],
    treatments: [
      'Salt bath treatment',
      'Malachite green treatment',
      'Remove infected tissue'
    ],
    prevention: [
      'Avoid physical damage',
      'Maintain water quality',
      'Proper handling'
    ],
    riskFactors: ['Low temperature', 'Physical injury', 'Stress'],
    criticalParameters: {
      temperature: { min: 10, max: 20 },
      pH: { min: 6.5, max: 7.5 }
    }
  },
  {
    name: 'Aeromonas Infection',
    symptoms: ['Ulcers', 'Hemorrhages', 'Pop-eye condition'],
    treatments: [
      'Antibiotic treatment',
      'Wound disinfection',
      'Salt bath treatment'
    ],
    prevention: [
      'Good sanitation',
      'Stress reduction',
      'Regular health checks'
    ],
    riskFactors: ['Poor water quality', 'High organic matter', 'Temperature fluctuation'],
    criticalParameters: {
      temperature: { min: 25, max: 30 },
      do: { min: 5, max: 8 }
    }
  },
  {
    name: 'Trichodiniasis',
    symptoms: ['Excess mucus production', 'Lethargy', 'Scale loss', 'Rapid breathing'],
    treatments: [
      'Formalin bath treatment',
      'Salt treatment (2-3%)',
      'Potassium permanganate bath'
    ],
    prevention: [
      'Regular water quality monitoring',
      'Avoid overcrowding',
      'Quarantine new fish'
    ],
    riskFactors: ['Poor water quality', 'High organic load', 'Overcrowding'],
    criticalParameters: {
      temperature: [20, 28],
      pH: [6.5, 8.0],
      do: 5
    },
    treatmentCost: {
      low: 50,
      high: 150
    }
  },
  {
    name: 'Streptococcosis',
    symptoms: ['Erratic swimming', 'Pop-eye condition', 'Hemorrhages', 'Dark body color'],
    treatments: [
      'Antibiotic treatment under veterinary guidance',
      'Increase water exchange',
      'Reduce feeding rate'
    ],
    prevention: [
      'Maintain optimal water temperature',
      'Regular disinfection',
      'Proper feed storage'
    ],
    riskFactors: ['High temperature', 'Poor water quality', 'Stress'],
    criticalParameters: {
      temperature: [25, 32],
      pH: [6.5, 7.5],
      do: 6
    },
    treatmentCost: {
      low: 100,
      high: 300
    }
  }
];

const seasonalPatterns: SeasonalPattern[] = [
  {
    season: 'Summer',
    commonDiseases: ['Columnaris Disease', 'Streptococcosis', 'Aeromonas Infection'],
    preventiveMeasures: [
      'Increase aeration',
      'Reduce feeding rate during peak temperature',
      'More frequent water quality monitoring'
    ],
    riskLevel: 'High'
  },
  {
    season: 'Winter',
    commonDiseases: ['White Spot Disease', 'Saprolegniasis'],
    preventiveMeasures: [
      'Maintain stable temperature',
      'Monitor dissolved oxygen levels',
      'Adjust feeding rate according to metabolism'
    ],
    riskLevel: 'Moderate'
  },
  {
    season: 'Rainy',
    commonDiseases: ['Bacterial Gill Disease', 'Trichodiniasis'],
    preventiveMeasures: [
      'Monitor water turbidity',
      'Increase water exchange rate',
      'Check pH fluctuations'
    ],
    riskLevel: 'High'
  },
  {
    season: 'Spring',
    commonDiseases: ['Columnaris Disease', 'Aeromonas Infection'],
    preventiveMeasures: [
      'Gradual temperature adaptation',
      'Regular health monitoring',
      'Balanced feeding regime'
    ],
    riskLevel: 'Moderate'
  }
];

const DiseaseRiskAssessment: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [diseaseRisks, setDiseaseRisks] = useState<DiseaseRisk[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>([]);

  const handleInputChange = (field: keyof FormData) => (value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : String(value)
    }));
  };

  const calculateRiskFactors = (): RiskFactor[] => {
    const factors: RiskFactor[] = [];

    // Water Temperature Risk
    const temp = parseFloat(formData.temperature);
    factors.push({
      name: 'Temperature',
      value: temp < 20 || temp > 32 ? 100 : temp < 25 || temp > 30 ? 50 : 0,
      weight: 0.2,
      status: temp < 20 || temp > 32 ? 'high' : temp < 25 || temp > 30 ? 'medium' : 'low',
    });

    // Dissolved Oxygen Risk
    const do_ = parseFloat(formData.dissolvedOxygen);
    factors.push({
      name: 'Oxygen',
      value: do_ < 3 ? 100 : do_ < 5 ? 50 : 0,
      weight: 0.15,
      status: do_ < 3 ? 'high' : do_ < 5 ? 'medium' : 'low',
    });

    // pH Risk
    const ph = parseFloat(formData.pH);
    factors.push({
      name: 'pH',
      value: ph < 6 || ph > 9 ? 100 : ph < 6.5 || ph > 8.5 ? 50 : 0,
      weight: 0.1,
      status: ph < 6 || ph > 9 ? 'high' : ph < 6.5 || ph > 8.5 ? 'medium' : 'low',
    });

    // Ammonia Risk
    const ammonia = parseFloat(formData.ammonia);
    factors.push({
      name: 'Ammonia',
      value: ammonia > 1 ? 100 : ammonia > 0.5 ? 50 : 0,
      weight: 0.15,
      status: ammonia > 1 ? 'high' : ammonia > 0.5 ? 'medium' : 'low',
    });

    // Stocking Density Risk
    const density = parseFloat(formData.stockingDensity);
    factors.push({
      name: 'Density',
      value: density > 50 ? 100 : density > 30 ? 50 : 0,
      weight: 0.1,
      status: density > 50 ? 'high' : density > 30 ? 'medium' : 'low',
    });

    // Mortality Risk
    const mortality = parseFloat(formData.mortalityRate);
    factors.push({
      name: 'Mortality',
      value: mortality > 5 ? 100 : mortality > 2 ? 50 : 0,
      weight: 0.2,
      status: mortality > 5 ? 'high' : mortality > 2 ? 'medium' : 'low',
    });

    // Behavior Risk
    const behaviorRisk = ['Lethargic', 'Erratic swimming', 'Surface breathing'].includes(
      formData.behavior.join(',')
    )
      ? 100
      : formData.behavior.includes('Bottom sitting')
      ? 50
      : 0;
    factors.push({
      name: 'Behavior',
      value: behaviorRisk,
      weight: 0.1,
      status:
        behaviorRisk === 100 ? 'high' : behaviorRisk === 50 ? 'medium' : 'low',
    });

    return factors;
  };

  const assessDiseaseRisks = (factors: RiskFactor[]): DiseaseRisk[] => {
    const risks: DiseaseRisk[] = [];
    const speciesDiseases = diseases.filter(d => d.name === formData.species);

    speciesDiseases.forEach((disease) => {
      const temp = parseFloat(formData.temperature);
      const do_ = parseFloat(formData.dissolvedOxygen);
      const ph = parseFloat(formData.pH);

      let probability = 0;

        // Check environmental conditions
        if (disease.criticalParameters.temperature) {
          const { min: minTemp, max: maxTemp } = disease.criticalParameters.temperature;
          if (temp >= minTemp && temp <= maxTemp) {
          probability += 30;
          }
        }

        if (disease.criticalParameters.do) {
          const { min: minDO, max: maxDO } = disease.criticalParameters.do;
          if (do_ >= minDO && do_ <= maxDO) {
          probability += 20;
          }
        }

        if (disease.criticalParameters.pH) {
          const { min: minPH, max: maxPH } = disease.criticalParameters.pH;
          if (pH >= minPH && pH <= maxPH) {
          probability += 20;
          }
        }

      // Check symptoms match
      const matchingSymptoms = disease.symptoms.filter((s) =>
        selectedSymptoms.includes(s)
      );
      probability += (matchingSymptoms.length / disease.symptoms.length) * 30;

      let severity: 'low' | 'medium' | 'high' = 'low';
      if (probability > 70) severity = 'high';
      else if (probability > 40) severity = 'medium';

      risks.push({
        disease: disease.name,
          probability,
        severity,
        symptoms: matchingSymptoms,
        preventiveMeasures: disease.prevention,
        treatments: disease.treatments,
      });
    });

    return risks.sort((a, b) => b.probability - a.probability);
  };

  const analyzeRisk = () => {
    const factors = calculateRiskFactors();
    const risks = assessDiseaseRisks(factors);
    setRiskFactors(factors);
    setDiseaseRisks(risks);
    setShowResults(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Disease Risk Assessment
      </Typography>
        <Typography color="text.secondary" paragraph>
          Assess disease risks based on environmental parameters and fish behavior
      </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormField
              label="Species"
              value={formData.species}
              onChange={handleInputChange('species')}
              type="select"
              options={diseases.map((d) => ({
                value: d.name,
                label: d.name.charAt(0).toUpperCase() + d.name.slice(1),
              }))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
                label="Water Temperature (°C)"
                value={formData.temperature}
                onChange={handleInputChange('temperature')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
                label="Dissolved Oxygen (mg/L)"
                value={formData.dissolvedOxygen}
                onChange={handleInputChange('dissolvedOxygen')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="pH"
                value={formData.pH}
                onChange={handleInputChange('pH')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
                label="Ammonia (mg/L)"
                value={formData.ammonia}
                onChange={handleInputChange('ammonia')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Stocking Density (kg/m³)"
              value={formData.stockingDensity}
              onChange={handleInputChange('stockingDensity')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Feeding Rate (% biomass/day)"
              value={formData.feedingRate}
              onChange={handleInputChange('feedingRate')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Mortality Rate (%)"
                  value={formData.mortalityRate}
              onChange={handleInputChange('mortalityRate')}
                type="number"
                required
              />
            </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <FormField
              label="Fish Behavior"
              value={formData.behavior.join(', ')}
              onChange={handleInputChange('behavior')}
              type="multiselect"
              options={behaviorSymptoms.map((symptom) => ({ value: symptom, label: symptom }))}
                required
              />
            </Grid>
          <Grid item xs={12}>
              <FormField
              label="Observed Symptoms"
              value={formData.symptoms}
              onChange={handleInputChange('symptoms')}
              type="multiselect"
              options={behaviorSymptoms.map((symptom) => ({ value: symptom, label: symptom }))}
              multiple
              />
            </Grid>
          <Grid item xs={12}>
              <FormField
              label="Risk Factors"
              value={formData.riskFactors}
              onChange={handleInputChange('riskFactors')}
              type="multiselect"
              options={riskFactors.map((factor) => ({ value: factor, label: factor }))}
              multiple
              />
            </Grid>
          </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
            onClick={analyzeRisk}
            disabled={
              !formData.species ||
              !formData.temperature ||
              !formData.dissolvedOxygen ||
              !formData.pH ||
              !formData.ammonia ||
              !formData.stockingDensity ||
              !formData.mortalityRate ||
              !formData.behavior.length
            }
          >
            Analyze Risk
            </Button>
          </Box>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🔍 Disease Risk Assessment: Complete Guide to Health Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on disease risk assessment in aquaculture! Understanding and managing disease risks is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about assessing and managing health risks. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Risk Assessment Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Risk assessment helps prevent diseases, protect stock, and ensure profitability. It's cheaper than treatment and more effective for management.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Assessment
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Disease prevention</li>
            <li>Better survival</li>
            <li>Lower costs</li>
            <li>Quality product</li>
            <li>Early warning</li>
            <li>Smart planning</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Risk Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Water:</strong> Quality risks</li>
            <li><strong>Stock:</strong> Health status</li>
            <li><strong>Environment:</strong> Conditions</li>
            <li><strong>Management:</strong> Practices</li>
            <li><strong>History:</strong> Past issues</li>
            <li><strong>Biosecurity:</strong> Measures</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Assess Risk
        </Typography>
        <Typography variant="body1" paragraph>
          Key assessment times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily checks</li>
            <li>Stock changes</li>
            <li>Season shifts</li>
            <li>System changes</li>
            <li>After problems</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Assessment
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Analysis:</strong> Use our tool</li>
            <li><strong>Identify:</strong> Find risks</li>
            <li><strong>Evaluate:</strong> Rate impact</li>
            <li><strong>Plan:</strong> Set measures</li>
            <li><strong>Monitor:</strong> Track health</li>
            <li><strong>Review:</strong> Update plans</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Risk Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Water problems</li>
            <li>Poor biosecurity</li>
            <li>Stock stress</li>
            <li>Management gaps</li>
            <li>System failures</li>
            <li>Disease spread</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Risk Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Checks:</strong> Stay vigilant
          2. <strong>Quick Action:</strong> Address issues
          3. <strong>Good Records:</strong> Track changes
          4. <strong>Staff Training:</strong> Build skills
          5. <strong>Expert Help:</strong> Get advice
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Assessment
        </Typography>
        <Typography variant="body1" paragraph>
          Effective assessment leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>90%+ prevention</li>
            <li>Better health</li>
            <li>Lower costs</li>
            <li>Quality stock</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How to assess risk?</strong>
          <Typography paragraph>
            A: Multiple factors matter. Our tool guides assessment.
          </Typography>

          <strong>Q: Warning signs?</strong>
          <Typography paragraph>
            A: Various indicators. Our tool helps identify.
          </Typography>

          <strong>Q: Prevention steps?</strong>
          <Typography paragraph>
            A: Many options exist. Our tool suggests measures.
          </Typography>

          <strong>Q: Assessment timing?</strong>
          <Typography paragraph>
            A: Regular checks needed. Our tool guides scheduling.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper disease risk assessment is crucial for successful aquaculture operations. Use our risk assessment tool above to protect your stock. Follow the guidelines in this guide to implement effective risk management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Health Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      {showResults && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
          <Typography variant="h6" gutterBottom>
                  Risk Factors Analysis
          </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riskFactors}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Risk Level"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Factor</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Risk Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {riskFactors.map((factor) => (
                        <TableRow key={factor.name}>
                          <TableCell>{factor.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={factor.status.toUpperCase()}
                              color={getStatusColor(factor.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{factor.value}</TableCell>
                        </TableRow>
                      ))}
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
                  Disease Risk Assessment
            </Typography>
                {diseaseRisks.map((risk) => (
                  <Box key={risk.disease} sx={{ mb: 3 }}>
              <Box
                sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1">{risk.disease}</Typography>
                  <Chip
                        label={`${risk.probability}% Risk`}
                        color={getStatusColor(risk.severity)}
                    size="small"
                  />
                    </Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Common Symptoms:
                </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      {risk.symptoms.map((symptom) => (
                        <Chip
                          key={symptom}
                          label={symptom}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                  Preventive Measures:
                </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {risk.preventiveMeasures.map((measure, index) => (
                    <li key={index}>
                      <Typography variant="body2">{measure}</Typography>
                    </li>
                  ))}
                </ul>
                    {risk.severity === 'high' && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Recommended Treatments:
              </Typography>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                          {risk.treatments.map((treatment, index) => (
                            <li key={index}>
                              <Typography variant="body2">{treatment}</Typography>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                </Box>
              ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default DiseaseRiskAssessment;