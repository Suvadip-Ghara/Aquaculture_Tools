import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Pool,
  Science,
  Calculate,
  ElectricBolt,
  Schedule,
  MonetizationOn,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

interface AerationData {
  // Pond Dimensions
  length: string;
  width: string;
  depth: string;
  
  // Fish Stock
  fishSpecies: string;
  fishQuantity: string;
  averageWeight: string;
  
  // Water Parameters
  temperature: string;
  dissolvedOxygen: string;
}

interface AerationAnalysis {
  waterVolume: number;
  fishBiomass: number;
  oxygenDemand: number;
  requiredAerators: number;
  aeratorType: string;
  maintenanceSchedule: string[];
  energyCost: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const fishSpeciesList = [
  { value: 'carp', name: 'Common Carp', oxygenDemand: 0.2 },
  { value: 'tilapia', name: 'Tilapia', oxygenDemand: 0.25 },
  { value: 'catfish', name: 'Catfish', oxygenDemand: 0.3 },
  { value: 'trout', name: 'Rainbow Trout', oxygenDemand: 0.35 },
];

const initialFormData: AerationData = {
  length: '',
  width: '',
  depth: '',
  fishSpecies: '',
  fishQuantity: '',
  averageWeight: '',
  temperature: '',
  dissolvedOxygen: '',
};

export default function AerationCalculator() {
  const [formData, setFormData] = useState<AerationData>(initialFormData);
  const [analysis, setAnalysis] = useState<AerationAnalysis | null>(null);

  const handleChange = (field: keyof AerationData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const calculateAeration = () => {
    // Calculate water volume (m³)
    const length = parseFloat(formData.length);
    const width = parseFloat(formData.width);
    const depth = parseFloat(formData.depth);
    const waterVolume = length * width * depth;

    // Calculate fish biomass (kg)
    const quantity = parseFloat(formData.fishQuantity);
    const weight = parseFloat(formData.averageWeight);
    const fishBiomass = quantity * weight;

    // Calculate oxygen demand
    const selectedSpecies = fishSpeciesList.find(s => s.value === formData.fishSpecies);
    const baseOxygenDemand = selectedSpecies?.oxygenDemand || 0.25; // kg O₂/kg fish/day
    const temperature = parseFloat(formData.temperature);
    const temperatureFactor = 1 + (temperature - 25) * 0.02; // 2% increase per °C above 25°C
    const oxygenDemand = fishBiomass * baseOxygenDemand * temperatureFactor;

    // Calculate required aerators (assuming 1 aerator provides 2 kg O₂/hour)
    const requiredAerators = Math.ceil(oxygenDemand / (2 * 24));

    // Estimate energy cost (assuming 1 kW per aerator, $0.12 per kWh)
    const dailyEnergyCost = requiredAerators * 1 * 24 * 0.12;

    // Generate maintenance schedule
    const maintenanceSchedule = [
      'Daily: Check aerator operation and clean water inlets',
      'Weekly: Inspect electrical connections and mounting hardware',
      'Monthly: Clean/replace filters and check motor bearings',
      'Quarterly: Full system inspection and performance testing',
    ];

    // Generate recommendations
    const recommendations = [
      `Install ${requiredAerators} aerators with minimum 1 HP capacity each`,
      'Position aerators to ensure uniform oxygen distribution',
      'Implement backup power system for emergency situations',
      'Monitor dissolved oxygen levels during early morning hours',
    ];

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    const currentDO = parseFloat(formData.dissolvedOxygen);
    if (currentDO < 3) {
      riskLevel = 'high';
    } else if (currentDO < 5) {
      riskLevel = 'medium';
    }

    setAnalysis({
      waterVolume,
      fishBiomass,
      oxygenDemand,
      requiredAerators,
      aeratorType: '1 HP Paddle Wheel Aerator',
      maintenanceSchedule,
      energyCost: dailyEnergyCost,
      recommendations,
      riskLevel,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateAeration();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Aeration System Design Calculator
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              {/* Pond Dimensions */}
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pool color="primary" /> Pond Dimensions
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Length (m)"
                    type="number"
                    value={formData.length}
                    onChange={handleChange('length')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Width (m)"
                    type="number"
                    value={formData.width}
                    onChange={handleChange('width')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Depth (m)"
                    type="number"
                    value={formData.depth}
                    onChange={handleChange('depth')}
                    required
                  />
                </Grid>
              </Grid>

              {/* Fish Stock Information */}
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Science color="primary" /> Fish Stock Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Fish Species</InputLabel>
                    <Select
                      value={formData.fishSpecies}
                      label="Fish Species"
                      onChange={handleChange('fishSpecies')}
                    >
                      {fishSpeciesList.map((species) => (
                        <MenuItem key={species.value} value={species.value}>
                          {species.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={formData.fishQuantity}
                    onChange={handleChange('fishQuantity')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Average Weight (kg)"
                    type="number"
                    value={formData.averageWeight}
                    onChange={handleChange('averageWeight')}
                    required
                  />
                </Grid>
              </Grid>

              {/* Water Parameters */}
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Science color="primary" /> Water Parameters
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Temperature (°C)"
                    type="number"
                    value={formData.temperature}
                    onChange={handleChange('temperature')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dissolved Oxygen (mg/L)"
                    type="number"
                    value={formData.dissolvedOxygen}
                    onChange={handleChange('dissolvedOxygen')}
                    required
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Calculate Aeration Requirements
              </Button>
            </form>
          </Paper>
        </Grid>

        {analysis && (
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Analysis Results
              </Typography>

              <Alert 
                severity={
                  analysis.riskLevel === 'high' 
                    ? 'error' 
                    : analysis.riskLevel === 'medium'
                    ? 'warning'
                    : 'success'
                }
                sx={{ mb: 3 }}
              >
                {analysis.riskLevel === 'high' 
                  ? 'Immediate aeration improvement required!'
                  : analysis.riskLevel === 'medium'
                  ? 'Monitor oxygen levels closely'
                  : 'Adequate aeration capacity'}
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card elevation={0}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calculate color="primary" /> System Requirements
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Water Volume"
                            secondary={`${analysis.waterVolume.toFixed(1)} m³`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Fish Biomass"
                            secondary={`${analysis.fishBiomass.toFixed(1)} kg`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Oxygen Demand"
                            secondary={`${analysis.oxygenDemand.toFixed(1)} kg O₂/day`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Required Aerators"
                            secondary={`${analysis.requiredAerators} units`}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card elevation={0}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MonetizationOn color="primary" /> Operating Costs
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Daily Energy Cost"
                            secondary={`$${analysis.energyCost.toFixed(2)}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Monthly Energy Cost"
                            secondary={`$${(analysis.energyCost * 30).toFixed(2)}`}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="primary" /> Maintenance Schedule
                </Typography>
                <List dense>
                  {analysis.maintenanceSchedule.map((task, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={task} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <List dense>
                  {analysis.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Warning color="info" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          💨 Aeration: Complete Guide to Oxygen Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on aeration management in aquaculture! Proper oxygen levels are vital for fish survival and growth. In this detailed guide, we'll explore everything you need to know about calculating and managing aeration needs. 🌬️
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Aeration Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Aeration maintains oxygen levels, removes harmful gases, and supports healthy fish growth. It's essential for intensive aquaculture.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Aeration
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better growth</li>
            <li>Higher survival</li>
            <li>Improved FCR</li>
            <li>Disease prevention</li>
            <li>Waste removal</li>
            <li>Higher stocking</li>
            <li>Better profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Aeration Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Biomass:</strong> Fish load</li>
            <li><strong>Temperature:</strong> Water temp</li>
            <li><strong>Altitude:</strong> Location</li>
            <li><strong>Feeding:</strong> Feed rate</li>
            <li><strong>System:</strong> Type used</li>
            <li><strong>Power:</strong> Efficiency</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Add Aeration
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for aeration:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Night hours</li>
            <li>Early morning</li>
            <li>After feeding</li>
            <li>Cloudy days</li>
            <li>High biomass</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Planning
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Calculate:</strong> Use our tool</li>
            <li><strong>Select:</strong> Choose system</li>
            <li><strong>Position:</strong> Place units</li>
            <li><strong>Monitor:</strong> Check levels</li>
            <li><strong>Maintain:</strong> Service gear</li>
            <li><strong>Adjust:</strong> Optimize use</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Aeration Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Poor placement</li>
            <li>Wrong sizing</li>
            <li>Power issues</li>
            <li>Maintenance gaps</li>
            <li>System failures</li>
            <li>Inefficiency</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Aeration Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Checks:</strong> Monitor DO
          2. <strong>Backup Systems:</strong> Have spares
          3. <strong>Good Layout:</strong> Plan well
          4. <strong>Maintenance:</strong> Service often
          5. <strong>Emergency Plan:</strong> Be ready
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Aeration
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>20-30% better growth</li>
            <li>Higher survival</li>
            <li>Better FCR</li>
            <li>Lower stress</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How much aeration needed?</strong>
          <Typography paragraph>
            A: Depends on biomass and conditions. Our calculator determines needs.
          </Typography>

          <strong>Q: Best system type?</strong>
          <Typography paragraph>
            A: Varies by setup. Our calculator suggests options.
          </Typography>

          <strong>Q: When to increase?</strong>
          <Typography paragraph>
            A: Based on DO levels. Our calculator helps plan.
          </Typography>

          <strong>Q: Power requirements?</strong>
          <Typography paragraph>
            A: Calculated by load. Our calculator shows needs.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper aeration is crucial for successful aquaculture operations. Use our aeration calculator above to optimize your oxygen management. Follow the guidelines in this guide to implement effective aeration strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Aeration Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};