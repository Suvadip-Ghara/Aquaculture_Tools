import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import FormField from '../components/FormField';

interface LimingData {
  pondArea: string;
  pondDepth: string;
  currentPH: string;
  targetPH: string;
  soilType: string;
  waterSource: string;
  limeType: string;
  alkalinity: string;
}

interface LimeType {
  name: string;
  neutralizingValue: number;
  solubility: number;
  costPerTon: number;
}

interface SoilType {
  name: string;
  bufferCapacity: number;
  description: string;
}

const limeTypes: Record<string, LimeType> = {
  agricultural: {
    name: 'Agricultural Limestone',
    neutralizingValue: 100,
    solubility: 0.6,
    costPerTon: 30,
  },
  hydrated: {
    name: 'Hydrated Lime',
    neutralizingValue: 136,
    solubility: 0.9,
    costPerTon: 45,
  },
  quicklime: {
    name: 'Quicklime',
    neutralizingValue: 179,
    solubility: 1.0,
    costPerTon: 60,
  },
  dolomitic: {
    name: 'Dolomitic Limestone',
    neutralizingValue: 109,
    solubility: 0.5,
    costPerTon: 35,
  },
};

const soilTypes: Record<string, SoilType> = {
  sandy: {
    name: 'Sandy Soil',
    bufferCapacity: 0.5,
    description: 'Low buffering capacity, requires less lime',
  },
  loamy: {
    name: 'Loamy Soil',
    bufferCapacity: 1.0,
    description: 'Medium buffering capacity',
  },
  clayey: {
    name: 'Clay Soil',
    bufferCapacity: 1.5,
    description: 'High buffering capacity, requires more lime',
  },
  organic: {
    name: 'Organic Soil',
    bufferCapacity: 2.0,
    description: 'Very high buffering capacity, requires most lime',
  },
};

const PondLimingCalculator: React.FC = () => {
  const [formData, setFormData] = useState<LimingData>({
    pondArea: '',
    pondDepth: '',
    currentPH: '',
    targetPH: '',
    soilType: '',
    waterSource: '',
    limeType: '',
    alkalinity: '',
  });

  const [results, setResults] = useState<{
    limeRequired: number;
    cost: number;
    applicationRate: number;
    recommendations: string[];
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateLimeRequirement = () => {
    const {
      pondArea,
      pondDepth,
      currentPH,
      targetPH,
      soilType,
      waterSource,
      limeType,
      alkalinity,
    } = formData;

    // Convert inputs to numbers
    const area = parseFloat(pondArea);
    const depth = parseFloat(pondDepth);
    const currentpH = parseFloat(currentPH);
    const targetpH = parseFloat(targetPH);
    const alkLevel = parseFloat(alkalinity);

    // Basic validation
    if (
      isNaN(area) ||
      isNaN(depth) ||
      isNaN(currentpH) ||
      isNaN(targetpH) ||
      isNaN(alkLevel) ||
      !soilType ||
      !waterSource ||
      !limeType
    ) {
      alert('Please fill in all fields with valid numbers');
      return;
    }

    // Calculate volume in cubic meters
    const pondVolume = area * depth;

    // pH difference factor
    const pHDifference = targetpH - currentpH;
    
    // Base lime requirement (kg/ha)
    let baseLimeReq = pHDifference * 1000;

    // Adjust for soil type
    baseLimeReq *= soilTypes[soilType].bufferCapacity;

    // Adjust for alkalinity
    if (alkLevel < 50) {
      baseLimeReq *= 1.3;
    } else if (alkLevel > 150) {
      baseLimeReq *= 0.7;
    }

    // Adjust for water source
    if (waterSource === 'groundwater') {
      baseLimeReq *= 0.8;
    } else if (waterSource === 'rainwater') {
      baseLimeReq *= 1.2;
    }

    // Adjust for lime type efficiency
    const selectedLime = limeTypes[limeType];
    const limeEfficiencyFactor = selectedLime.neutralizingValue / 100;
    const finalLimeReq = baseLimeReq / limeEfficiencyFactor;

    // Calculate cost
    const costPerKg = selectedLime.costPerTon / 1000;
    const totalCost = finalLimeReq * costPerKg;

    // Application rate (kg/m²)
    const applicationRate = finalLimeReq / (area * 10000);

    // Generate recommendations
    const recommendations = [
      `Apply ${finalLimeReq.toFixed(2)} kg of ${selectedLime.name} total.`,
      `Spread lime evenly at a rate of ${applicationRate.toFixed(3)} kg/m².`,
      `For best results, apply lime during dry weather.`,
      `Monitor pH weekly after application.`,
    ];

    if (selectedLime.solubility < 0.7) {
      recommendations.push(
        'This lime type dissolves slowly. Consider multiple smaller applications.'
      );
    }

    if (pHDifference > 2) {
      recommendations.push(
        'Large pH adjustment needed. Consider gradual adjustment over multiple applications.'
      );
    }

    setResults({
      limeRequired: finalLimeReq,
      cost: totalCost,
      applicationRate: applicationRate,
      recommendations,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pond Liming Calculator
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormField
              label="Pond Area (hectares)"
              type="number"
              name="pondArea"
              value={formData.pondArea}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="Average Depth (meters)"
              type="number"
              name="pondDepth"
              value={formData.pondDepth}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="Current pH"
              type="number"
              name="currentPH"
              value={formData.currentPH}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="Target pH"
              type="number"
              name="targetPH"
              value={formData.targetPH}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="Soil Type"
              type="select"
              name="soilType"
              value={formData.soilType}
              onChange={handleInputChange}
              options={Object.entries(soilTypes).map(([value, { name }]) => ({
                value,
                label: name,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="Water Source"
              type="select"
              name="waterSource"
              value={formData.waterSource}
              onChange={handleInputChange}
              options={[
                { value: 'surface', label: 'Surface Water' },
                { value: 'groundwater', label: 'Ground Water' },
                { value: 'rainwater', label: 'Rain Water' },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="Lime Type"
              type="select"
              name="limeType"
              value={formData.limeType}
              onChange={handleInputChange}
              options={Object.entries(limeTypes).map(([value, { name }]) => ({
                value,
                label: name,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="Water Alkalinity (mg/L CaCO₃)"
              type="number"
              name="alkalinity"
              value={formData.alkalinity}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateLimeRequirement}
            size="large"
          >
            Calculate Lime Requirement
          </Button>
        </Box>

        {results && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Results
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Lime Required</TableCell>
                        <TableCell>{results.limeRequired.toFixed(2)} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Application Rate</TableCell>
                        <TableCell>
                          {results.applicationRate.toFixed(3)} kg/m²
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Estimated Cost</TableCell>
                        <TableCell>${results.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommendations
                    </Typography>
                    {results.recommendations.map((rec, index) => (
                      <Alert
                        severity="info"
                        key={index}
                        sx={{ mb: 1 }}
                      >
                        <AlertTitle>Step {index + 1}</AlertTitle>
                        {rec}
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🌿 Pond Liming: Complete Guide to pH Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on pond liming in aquaculture! Understanding and managing pond pH is crucial for optimal fish growth and health. In this detailed guide, we'll explore everything you need to know about calculating and applying lime in your ponds. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Liming Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Liming stabilizes pH, improves water quality, and enhances pond productivity. It's essential for maintaining optimal conditions for fish growth and health.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Proper Liming
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>pH stability</li>
            <li>Better productivity</li>
            <li>Improved health</li>
            <li>Enhanced growth</li>
            <li>Water quality</li>
            <li>Nutrient availability</li>
            <li>Disease resistance</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Liming Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Soil pH:</strong> Current level</li>
            <li><strong>Water Quality:</strong> Parameters</li>
            <li><strong>Pond Size:</strong> Area and depth</li>
            <li><strong>Lime Type:</strong> Material choice</li>
            <li><strong>Application:</strong> Method</li>
            <li><strong>Timing:</strong> When to apply</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Apply Lime
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for application:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Pond preparation</li>
            <li>pH drops</li>
            <li>Regular maintenance</li>
            <li>After heavy rain</li>
            <li>Seasonal changes</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Liming Process
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Testing:</strong> Use our calculator</li>
            <li><strong>Planning:</strong> Calculate needs</li>
            <li><strong>Preparation:</strong> Get materials</li>
            <li><strong>Application:</strong> Apply lime</li>
            <li><strong>Monitoring:</strong> Check results</li>
            <li><strong>Maintenance:</strong> Regular checks</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Liming Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Wrong amount</li>
            <li>Poor timing</li>
            <li>Uneven application</li>
            <li>Wrong type</li>
            <li>Inadequate mixing</li>
            <li>Over-liming</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Liming Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Testing:</strong> Check pH
          2. <strong>Even Application:</strong> Spread well
          3. <strong>Timing:</strong> Choose right time
          4. <strong>Quality:</strong> Use good lime
          5. <strong>Records:</strong> Track changes
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Liming
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>20-30% better growth</li>
            <li>Stable pH</li>
            <li>Better health</li>
            <li>Higher production</li>
            <li>Lower costs</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How much lime do I need?</strong>
          <Typography paragraph>
            A: It depends on pH and pond size. Our calculator provides precise amounts.
          </Typography>

          <strong>Q: When should I lime?</strong>
          <Typography paragraph>
            A: Before stocking and during maintenance. Our calculator helps plan timing.
          </Typography>

          <strong>Q: What type of lime is best?</strong>
          <Typography paragraph>
            A: Agricultural limestone is common. Our calculator considers lime types.
          </Typography>

          <strong>Q: How often should I lime?</strong>
          <Typography paragraph>
            A: Based on pH tests and pond conditions. Our calculator guides frequency.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper liming is crucial for successful pond management. Use our liming calculator above to optimize your pH management. Follow the guidelines in this guide to implement effective liming strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Water Quality Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default PondLimingCalculator;
