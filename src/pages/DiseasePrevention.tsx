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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore,
  Warning,
  CheckCircle,
  LocalHospital,
  BugReport,
  Healing,
  Security,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';

interface HealthData {
  waterQuality: {
    temperature: string;
    dissolvedOxygen: string;
    ph: string;
    ammonia: string;
    nitrite: string;
  };
  behavior: string[];
  symptoms: string[];
  feedingResponse: string;
  mortalityRate: string;
  previousDiseases: string[];
  quarantineStatus: string;
  biosecurityLevel: string;
}

const behaviorOptions = [
  'Normal',
  'Lethargy',
  'Erratic Swimming',
  'Surface Gasping',
  'Bottom Sitting',
  'Flashing',
  'Rubbing Against Objects',
];

const symptomOptions = [
  'No Visible Symptoms',
  'Skin Lesions',
  'White Spots',
  'Red Spots',
  'Fin Rot',
  'Swollen Abdomen',
  'Cloudy Eyes',
  'Gill Damage',
  'Scale Loss',
  'Body Deformities',
];

const feedingResponses = [
  'Normal',
  'Reduced Appetite',
  'No Appetite',
  'Aggressive Feeding',
];

const commonDiseases = [
  'White Spot Disease',
  'Bacterial Gill Disease',
  'Columnaris',
  'Saprolegniasis',
  'Aeromonas Infection',
];

const quarantineStatuses = [
  'No Quarantine',
  'New Stock Quarantined',
  'Disease Outbreak Quarantine',
  'Preventive Quarantine',
];

const biosecurityLevels = [
  'Basic',
  'Standard',
  'Advanced',
  'Comprehensive',
];

const initialFormData: HealthData = {
  waterQuality: {
    temperature: '',
    dissolvedOxygen: '',
    ph: '',
    ammonia: '',
    nitrite: '',
  },
  behavior: [],
  symptoms: [],
  feedingResponse: '',
  mortalityRate: '',
  previousDiseases: [],
  quarantineStatus: '',
  biosecurityLevel: '',
};

interface DiseaseRisk {
  name: string;
  probability: number;
  severity: 'Low' | 'Medium' | 'High';
  symptoms: string[];
  treatments: string[];
  prevention: string[];
}

interface PreventionAnalysis {
  overallRisk: number;
  diseaseRisks: DiseaseRisk[];
  biosecurityRecommendations: string[];
  quarantineRecommendations: string[];
  treatmentProtocols: string[];
  emergencyActions: string[];
}

export default function DiseasePrevention() {
  const [formData, setFormData] = useState<HealthData>(initialFormData);
  const [analysis, setAnalysis] = useState<PreventionAnalysis | null>(null);

  const handleWaterQualityChange = (field: keyof typeof initialFormData.waterQuality) => (
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      waterQuality: {
        ...prev.waterQuality,
        [field]: value,
      },
    }));
  };

  const handleMultiSelectChange = (field: 'behavior' | 'symptoms' | 'previousDiseases') => (
    event: SelectChangeEvent<string[]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value as string[],
    }));
  };

  const handleChange = (
    field: 'feedingResponse' | 'mortalityRate' | 'quarantineStatus' | 'biosecurityLevel'
  ) => (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value as string,
    }));
  };

  const analyzePrevention = () => {
    const diseaseRisks: DiseaseRisk[] = [];
    let overallRisk = 0;
    const biosecurityRecommendations: string[] = [];
    const quarantineRecommendations: string[] = [];
    const treatmentProtocols: string[] = [];
    const emergencyActions: string[] = [];

    // Water quality analysis
    const temp = parseFloat(formData.waterQuality.temperature);
    const do2 = parseFloat(formData.waterQuality.dissolvedOxygen);
    const ph = parseFloat(formData.waterQuality.ph);
    const ammonia = parseFloat(formData.waterQuality.ammonia);
    const nitrite = parseFloat(formData.waterQuality.nitrite);

    if (temp < 25 || temp > 32) overallRisk += 20;
    if (do2 < 5) overallRisk += 25;
    if (ph < 6.5 || ph > 8.5) overallRisk += 15;
    if (ammonia > 0.5) overallRisk += 25;
    if (nitrite > 0.1) overallRisk += 20;

    // Behavior and symptoms analysis
    const abnormalBehaviors = formData.behavior.filter(b => b !== 'Normal');
    const visibleSymptoms = formData.symptoms.filter(s => s !== 'No Visible Symptoms');

    if (abnormalBehaviors.length > 0) {
      overallRisk += 10 * abnormalBehaviors.length;
    }

    if (visibleSymptoms.length > 0) {
      overallRisk += 15 * visibleSymptoms.length;
    }

    // Feeding response analysis
    if (formData.feedingResponse === 'No Appetite') {
      overallRisk += 30;
      emergencyActions.push('Immediate health assessment required');
    } else if (formData.feedingResponse === 'Reduced Appetite') {
      overallRisk += 15;
    }

    // Disease risk assessment
    if (formData.symptoms.includes('White Spots')) {
      diseaseRisks.push({
        name: 'White Spot Disease',
        probability: 80,
        severity: 'High',
        symptoms: ['White spots on body', 'Flashing', 'Lethargy'],
        treatments: [
          'Increase temperature gradually to 30°C',
          'Salt treatment (0.15-0.3%)',
          'Commercial ich treatment',
        ],
        prevention: [
          'Maintain optimal water quality',
          'Quarantine new fish',
          'Regular health monitoring',
        ],
      });
    }

    if (formData.symptoms.includes('Gill Damage')) {
      diseaseRisks.push({
        name: 'Bacterial Gill Disease',
        probability: 70,
        severity: 'High',
        symptoms: ['Gill damage', 'Surface gasping', 'Lethargy'],
        treatments: [
          'Antibiotic treatment under veterinary guidance',
          'Improve aeration',
          'Reduce stocking density',
        ],
        prevention: [
          'Maintain good water quality',
          'Regular gill checks',
          'Proper stocking density',
        ],
      });
    }

    // Biosecurity recommendations
    if (formData.biosecurityLevel === 'Basic') {
      biosecurityRecommendations.push('Implement basic disinfection protocols');
      biosecurityRecommendations.push('Establish visitor log and control');
      biosecurityRecommendations.push('Install footbaths at entry points');
    }

    // Quarantine recommendations
    if (formData.quarantineStatus === 'No Quarantine') {
      quarantineRecommendations.push('Establish quarantine protocol for new stock');
      quarantineRecommendations.push('Set up dedicated quarantine facilities');
      quarantineRecommendations.push('Implement observation period of 2-4 weeks');
    }

    // Treatment protocols
    if (overallRisk > 50) {
      treatmentProtocols.push('Daily water quality monitoring');
      treatmentProtocols.push('Increase water exchange rate');
      treatmentProtocols.push('Prepare medication stock');
    }

    // Emergency actions for high risk
    if (overallRisk > 70) {
      emergencyActions.push('Contact aquatic veterinarian');
      emergencyActions.push('Prepare treatment equipment');
      emergencyActions.push('Isolate affected stock');
    }

    return {
      overallRisk: Math.min(overallRisk, 100),
      diseaseRisks,
      biosecurityRecommendations,
      quarantineRecommendations,
      treatmentProtocols,
      emergencyActions,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = analyzePrevention();
    setAnalysis(result);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Disease Prevention System
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Early warning system for disease prevention and health management.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Water Quality Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Temperature (°C)"
                    type="number"
                    value={formData.waterQuality.temperature}
                    onChange={(e) => handleWaterQualityChange('temperature')(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dissolved Oxygen (mg/L)"
                    type="number"
                    value={formData.waterQuality.dissolvedOxygen}
                    onChange={(e) => handleWaterQualityChange('dissolvedOxygen')(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="pH"
                    type="number"
                    value={formData.waterQuality.ph}
                    onChange={(e) => handleWaterQualityChange('ph')(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ammonia (mg/L)"
                    type="number"
                    value={formData.waterQuality.ammonia}
                    onChange={(e) => handleWaterQualityChange('ammonia')(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nitrite (mg/L)"
                    type="number"
                    value={formData.waterQuality.nitrite}
                    onChange={(e) => handleWaterQualityChange('nitrite')(e.target.value)}
                    required
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Health Indicators
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Behavior</InputLabel>
                    <Select
                      multiple
                      value={formData.behavior}
                      onChange={handleMultiSelectChange('behavior')}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {behaviorOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Symptoms</InputLabel>
                    <Select
                      multiple
                      value={formData.symptoms}
                      onChange={handleMultiSelectChange('symptoms')}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {symptomOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Feeding Response</InputLabel>
                    <Select
                      value={formData.feedingResponse}
                      onChange={handleChange('feedingResponse')}
                    >
                      {feedingResponses.map((response) => (
                        <MenuItem key={response} value={response}>
                          {response}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mortality Rate (%/day)"
                    type="number"
                    value={formData.mortalityRate}
                    onChange={(e) => handleChange('mortalityRate')(e)}
                    required
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Disease History & Prevention
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Previous Diseases</InputLabel>
                    <Select
                      multiple
                      value={formData.previousDiseases}
                      onChange={handleMultiSelectChange('previousDiseases')}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {commonDiseases.map((disease) => (
                        <MenuItem key={disease} value={disease}>
                          {disease}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Quarantine Status</InputLabel>
                    <Select
                      value={formData.quarantineStatus}
                      onChange={handleChange('quarantineStatus')}
                    >
                      {quarantineStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Biosecurity Level</InputLabel>
                    <Select
                      value={formData.biosecurityLevel}
                      onChange={handleChange('biosecurityLevel')}
                    >
                      {biosecurityLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" size="large">
                  Analyze Health Status
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {analysis && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Health Analysis Results
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Overall Risk Level:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analysis.overallRisk}
                  color={
                    analysis.overallRisk > 70
                      ? 'error'
                      : analysis.overallRisk > 40
                      ? 'warning'
                      : 'success'
                  }
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="caption">
                  {analysis.overallRisk}% Risk Level
                </Typography>
              </Box>

              {analysis.diseaseRisks.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Potential Disease Risks:
                  </Typography>
                  {analysis.diseaseRisks.map((disease, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>
                          {disease.name} - {disease.probability}% Risk
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="subtitle2">Symptoms:</Typography>
                        <List dense>
                          {disease.symptoms.map((symptom, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <BugReport fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={symptom} />
                            </ListItem>
                          ))}
                        </List>
                        <Typography variant="subtitle2">Treatments:</Typography>
                        <List dense>
                          {disease.treatments.map((treatment, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <Healing fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={treatment} />
                            </ListItem>
                          ))}
                        </List>
                        <Typography variant="subtitle2">Prevention:</Typography>
                        <List dense>
                          {disease.prevention.map((prevention, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <Security fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={prevention} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {analysis.emergencyActions.length > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Emergency Actions Required:
                  </Typography>
                  <List dense>
                    {analysis.emergencyActions.map((action, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Warning fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={action} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Biosecurity Recommendations</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {analysis.biosecurityRecommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Security fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Quarantine Protocols</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {analysis.quarantineRecommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <LocalHospital fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Treatment Protocols</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {analysis.treatmentProtocols.map((protocol, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Healing fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={protocol} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🏥 Disease Prevention: Complete Guide to Fish Health Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on disease prevention in aquaculture! Maintaining fish health is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about preventing and managing fish diseases. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Disease Prevention Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Disease prevention protects your stock, ensures growth, and maintains profitability. It's cheaper and more effective than treatment.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Prevention
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Higher survival</li>
            <li>Better growth</li>
            <li>Lower costs</li>
            <li>Quality product</li>
            <li>Less treatment</li>
            <li>Market access</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Prevention Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential measures:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Water:</strong> Quality management</li>
            <li><strong>Feed:</strong> Proper nutrition</li>
            <li><strong>Stress:</strong> Minimization</li>
            <li><strong>Hygiene:</strong> Good practices</li>
            <li><strong>Monitoring:</strong> Regular checks</li>
            <li><strong>Biosecurity:</strong> Strict measures</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Take Action
        </Typography>
        <Typography variant="body1" paragraph>
          Key prevention times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily checks</li>
            <li>Stock changes</li>
            <li>Weather shifts</li>
            <li>Stress events</li>
            <li>Season changes</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Prevention
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Assessment:</strong> Use our tool</li>
            <li><strong>Planning:</strong> Set protocols</li>
            <li><strong>Implementation:</strong> Apply measures</li>
            <li><strong>Monitoring:</strong> Check health</li>
            <li><strong>Response:</strong> Quick action</li>
            <li><strong>Review:</strong> Update plans</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Health Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Water problems</li>
            <li>Feed issues</li>
            <li>Stress factors</li>
            <li>Parasites</li>
            <li>Infections</li>
            <li>Environmental stress</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Prevention Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Stay vigilant
          2. <strong>Quick Response:</strong> Act fast
          3. <strong>Good Records:</strong> Track health
          4. <strong>Staff Training:</strong> Build skills
          5. <strong>Expert Help:</strong> Get advice
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Prevention
        </Typography>
        <Typography variant="body1" paragraph>
          Effective prevention leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>90%+ survival</li>
            <li>Better growth</li>
            <li>Lower costs</li>
            <li>Quality product</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: Best prevention methods?</strong>
          <Typography paragraph>
            A: Multiple approaches needed. Our tool guides strategy.
          </Typography>

          <strong>Q: Warning signs?</strong>
          <Typography paragraph>
            A: Various indicators. Our tool helps identify.
          </Typography>

          <strong>Q: When to act?</strong>
          <Typography paragraph>
            A: At first signs. Our tool guides timing.
          </Typography>

          <strong>Q: Prevention costs?</strong>
          <Typography paragraph>
            A: Less than treatment. Our tool helps budget.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper disease prevention is crucial for successful aquaculture operations. Use our disease prevention tool above to protect your stock. Follow the guidelines in this guide to implement effective prevention strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Health Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};