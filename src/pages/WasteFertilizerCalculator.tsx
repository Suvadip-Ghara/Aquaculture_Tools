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
  Tooltip,
  IconButton,
  Divider,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import FormField from '../components/FormField';

interface WasteData {
  fishBiomass: string;
  feedingRate: string;
  collectionFrequency: string;
  pondSize: string;
  fishSpecies: string;
  feedProtein: string;
  processingMethod: string;
  storageConditions: string;
  cropType: string;
}

interface NutrientContent {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
}

interface FertilizerResult {
  fertilizer: number;
  applicationRate: number;
  nutrientContent: NutrientContent;
  recommendations: string[];
  storageRequirements: string[];
  environmentalBenefits: string[];
  economicValue: {
    fertilizerValue: number;
    disposalSavings: number;
    totalBenefit: number;
  };
}

const fishSpeciesData = {
  tilapia: {
    wasteRate: 0.35,
    nutrientRichness: 1.0,
    description: 'Moderate waste production with balanced nutrient content',
  },
  carp: {
    wasteRate: 0.4,
    nutrientRichness: 1.1,
    description: 'High waste production with rich nutrient content',
  },
  catfish: {
    wasteRate: 0.3,
    nutrientRichness: 0.9,
    description: 'Lower waste production with standard nutrient content',
  },
  trout: {
    wasteRate: 0.25,
    nutrientRichness: 1.2,
    description: 'Low waste production but nutrient-rich content',
  },
};

const processingMethods = {
  composting: {
    efficiency: 0.7,
    nutrientRetention: 0.8,
    processingTime: 30,
    description: 'Traditional composting with regular turning',
  },
  vermicomposting: {
    efficiency: 0.85,
    nutrientRetention: 0.9,
    processingTime: 45,
    description: 'Using earthworms for enhanced decomposition',
  },
  biodigestion: {
    efficiency: 0.6,
    nutrientRetention: 0.75,
    processingTime: 20,
    description: 'Anaerobic digestion with biogas production',
  },
  drying: {
    efficiency: 0.5,
    nutrientRetention: 0.6,
    processingTime: 7,
    description: 'Sun drying with periodic turning',
  },
};

const storageConditions = {
  indoor: {
    nutrientLoss: 0.05,
    maxDuration: 180,
    description: 'Protected from elements, temperature controlled',
  },
  covered: {
    nutrientLoss: 0.15,
    maxDuration: 90,
    description: 'Protected from rain but exposed to temperature variations',
  },
  outdoor: {
    nutrientLoss: 0.3,
    maxDuration: 30,
    description: 'Exposed to elements, requires frequent monitoring',
  },
};

const cropTypes = {
  vegetables: {
    applicationRate: 1.0,
    frequency: 'Weekly',
    description: 'High nutrient demand, frequent application needed',
  },
  grains: {
    applicationRate: 0.7,
    frequency: 'Monthly',
    description: 'Moderate nutrient demand, less frequent application',
  },
  fruits: {
    applicationRate: 0.8,
    frequency: 'Bi-weekly',
    description: 'Variable nutrient demand based on growth stage',
  },
  fodder: {
    applicationRate: 1.2,
    frequency: 'Weekly',
    description: 'High biomass production requires more nutrients',
  },
};

const initialFormData: WasteData = {
  fishBiomass: '',
  feedingRate: '',
  collectionFrequency: '',
  pondSize: '',
  fishSpecies: '',
  feedProtein: '',
  processingMethod: '',
  storageConditions: '',
  cropType: '',
};

const WasteFertilizerCalculator: React.FC = () => {
  const [formData, setFormData] = useState<WasteData>(initialFormData);
  const [result, setResult] = useState<FertilizerResult | null>(null);

  const handleChange = (field: keyof WasteData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateNutrientContent = (
    baseFertilizer: number,
    species: string,
    processingMethod: string,
    storage: string
  ): NutrientContent => {
    const speciesData = fishSpeciesData[species as keyof typeof fishSpeciesData];
    const processData = processingMethods[processingMethod as keyof typeof processingMethods];
    const storageData = storageConditions[storage as keyof typeof storageConditions];
    
    const nutrientRetention = processData.nutrientRetention * (1 - storageData.nutrientLoss);
    const baseContent = speciesData.nutrientRichness;

    return {
      nitrogen: baseFertilizer * 0.05 * baseContent * nutrientRetention,
      phosphorus: baseFertilizer * 0.02 * baseContent * nutrientRetention,
      potassium: baseFertilizer * 0.01 * baseContent * nutrientRetention,
      organicMatter: baseFertilizer * 0.4 * baseContent * nutrientRetention,
    };
  };

  const calculateEconomicValue = (
    fertilizer: number,
    nutrientContent: NutrientContent
  ) => {
    // Approximate values per kg
    const nitrogenValue = 2.5;
    const phosphorusValue = 3.0;
    const potassiumValue = 2.0;
    const organicMatterValue = 0.5;

    const fertilizerValue =
      nutrientContent.nitrogen * nitrogenValue +
      nutrientContent.phosphorus * phosphorusValue +
      nutrientContent.potassium * potassiumValue +
      nutrientContent.organicMatter * organicMatterValue;

    const disposalSavings = fertilizer * 0.3; // Assume $0.3/kg disposal cost savings
    const totalBenefit = fertilizerValue + disposalSavings;

    return {
      fertilizerValue,
      disposalSavings,
      totalBenefit,
    };
  };

  const calculateFertilizer = () => {
    const biomass = parseFloat(formData.fishBiomass);
    const feedRate = parseFloat(formData.feedingRate);
    const frequency = parseFloat(formData.collectionFrequency);
    const pondArea = parseFloat(formData.pondSize);
    const proteinContent = parseFloat(formData.feedProtein);

    const speciesData = fishSpeciesData[formData.fishSpecies as keyof typeof fishSpeciesData];
    const processData = processingMethods[formData.processingMethod as keyof typeof processingMethods];
    const cropData = cropTypes[formData.cropType as keyof typeof cropTypes];

    // Calculate base waste production
    const dailyWaste = feedRate * speciesData.wasteRate * (proteinContent / 32); // Adjust for protein content
    
    // Convert waste to fertilizer
    const rawFertilizer = dailyWaste * frequency;
    const fertilizer = rawFertilizer * processData.efficiency;
    
    // Calculate application rate based on crop type
    const baseApplicationRate = (fertilizer / (pondArea / 10000)) * 7;
    const applicationRate = baseApplicationRate * cropData.applicationRate;

    // Calculate nutrient content
    const nutrientContent = calculateNutrientContent(
      fertilizer,
      formData.fishSpecies,
      formData.processingMethod,
      formData.storageConditions
    );

    // Generate recommendations
    const recommendations = [
      `Collect waste every ${frequency} days to maintain optimal nutrient content`,
      `Use ${formData.processingMethod} method with ${processData.processingTime} days processing time`,
      `Apply fertilizer ${cropData.frequency.toLowerCase()} for ${formData.cropType}`,
      'Monitor soil nutrient levels and adjust application rates accordingly',
      `Maintain proper ${formData.storageConditions} storage conditions`,
    ];

    // Storage requirements
    const storageData = storageConditions[formData.storageConditions as keyof typeof storageConditions];
    const storageRequirements = [
      `Maximum storage duration: ${storageData.maxDuration} days`,
      `Expected nutrient loss during storage: ${(storageData.nutrientLoss * 100).toFixed(1)}%`,
      storageData.description,
      'Keep storage area well-ventilated',
      'Monitor moisture levels regularly',
    ];

    // Environmental benefits
    const environmentalBenefits = [
      `Reduces waste disposal by ${(fertilizer * 52).toFixed(0)} kg annually`,
      `Saves approximately ${((fertilizer * 52) * 0.5).toFixed(0)} kg CO2 emissions per year`,
      'Promotes circular economy in aquaculture',
      'Reduces chemical fertilizer dependency',
      'Improves soil organic matter content',
    ];

    // Calculate economic value
    const economicValue = calculateEconomicValue(fertilizer, nutrientContent);

    return {
      fertilizer,
      applicationRate,
      nutrientContent,
      recommendations,
      storageRequirements,
      environmentalBenefits,
      economicValue,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateFertilizer();
    setResult(result);
  };

  const getNutrientChartData = () => {
    if (!result) return [];
    const { nutrientContent } = result;
    return [
      { name: 'Nitrogen', value: nutrientContent.nitrogen },
      { name: 'Phosphorus', value: nutrientContent.phosphorus },
      { name: 'Potassium', value: nutrientContent.potassium },
      { name: 'Organic Matter', value: nutrientContent.organicMatter },
    ];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Waste-to-Fertilizer Calculator
      </Typography>
      <Typography variant="body1" paragraph>
        Convert aquaculture waste into valuable organic fertilizer and calculate its nutrient content and economic value
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Fish Species</InputLabel>
                    <Select
                      name="fishSpecies"
                      value={formData.fishSpecies}
                      label="Fish Species"
                      onChange={handleSelectChange}
                    >
                      {Object.entries(fishSpeciesData).map(([key, { description }]) => (
                        <MenuItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Fish Biomass (kg)"
                    value={formData.fishBiomass}
                    onChange={handleChange('fishBiomass')}
                    type="number"
                    required
                    helperText="Total weight of fish in the pond"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Daily Feeding Rate (kg)"
                    value={formData.feedingRate}
                    onChange={handleChange('feedingRate')}
                    type="number"
                    required
                    helperText="Amount of feed given per day"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Feed Protein Content (%)"
                    value={formData.feedProtein}
                    onChange={handleChange('feedProtein')}
                    type="number"
                    required
                    helperText="Protein percentage in feed"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Pond Size (m²)"
                    value={formData.pondSize}
                    onChange={handleChange('pondSize')}
                    type="number"
                    required
                    helperText="Surface area of the pond"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processing Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Processing Method</InputLabel>
                    <Select
                      name="processingMethod"
                      value={formData.processingMethod}
                      label="Processing Method"
                      onChange={handleSelectChange}
                    >
                      {Object.entries(processingMethods).map(([key, { description }]) => (
                        <MenuItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Storage Conditions</InputLabel>
                    <Select
                      name="storageConditions"
                      value={formData.storageConditions}
                      label="Storage Conditions"
                      onChange={handleSelectChange}
                    >
                      {Object.entries(storageConditions).map(([key, { description }]) => (
                        <MenuItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Target Crop Type</InputLabel>
                    <Select
                      name="cropType"
                      value={formData.cropType}
                      label="Target Crop Type"
                      onChange={handleSelectChange}
                    >
                      {Object.entries(cropTypes).map(([key, { description }]) => (
                        <MenuItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    label="Collection Frequency (days)"
                    value={formData.collectionFrequency}
                    onChange={handleChange('collectionFrequency')}
                    type="number"
                    required
                    helperText="How often waste is collected"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!formData.fishSpecies || !formData.fishBiomass || !formData.feedingRate || !formData.processingMethod}
                >
                  Calculate Fertilizer Production
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {result && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Production Results
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Fertilizer Production</TableCell>
                        <TableCell>{result.fertilizer.toFixed(2)} kg per collection</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Application Rate</TableCell>
                        <TableCell>{result.applicationRate.toFixed(2)} kg/ha/week</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Annual Production</TableCell>
                        <TableCell>{(result.fertilizer * 52).toFixed(0)} kg/year</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Nutrient Content
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={getNutrientChartData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {getNutrientChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Economic Value
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Fertilizer Value</TableCell>
                        <TableCell>${result.economicValue.fertilizerValue.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Disposal Cost Savings</TableCell>
                        <TableCell>${result.economicValue.disposalSavings.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Economic Benefit</TableCell>
                        <TableCell>${result.economicValue.totalBenefit.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations:
                  </Typography>
                  <ul>
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </Alert>

                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Storage Requirements:
                  </Typography>
                  <ul>
                    {result.storageRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </Alert>

                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Environmental Benefits:
                  </Typography>
                  <ul>
                    {result.environmentalBenefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
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
          🌱 Waste to Fertilizer: Complete Guide to Sustainable Aquaculture
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on waste-to-fertilizer conversion in aquaculture! Understanding how to efficiently convert aquaculture waste into valuable fertilizer is key to sustainable farming. In this detailed guide, we'll explore everything you need to know about calculating and optimizing waste conversion in your facility. ♻️
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Waste-to-Fertilizer Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Converting waste to fertilizer helps reduce environmental impact, create additional revenue streams, and promote sustainable aquaculture practices. Proper waste management is essential for both environmental compliance and farm profitability.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Waste Conversion
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Environmental sustainability</li>
            <li>Additional income</li>
            <li>Reduced disposal costs</li>
            <li>Better resource utilization</li>
            <li>Improved farm efficiency</li>
            <li>Regulatory compliance</li>
            <li>Enhanced reputation</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Conversion Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential factors to consider:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Waste Volume:</strong> Daily production</li>
            <li><strong>Nutrient Content:</strong> NPK values</li>
            <li><strong>Processing Method:</strong> Conversion technique</li>
            <li><strong>Storage Capacity:</strong> Holding facilities</li>
            <li><strong>Quality Standards:</strong> Market requirements</li>
            <li><strong>Processing Time:</strong> Production cycle</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Calculate Conversion
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily waste collection</li>
            <li>Processing planning</li>
            <li>Capacity assessment</li>
            <li>Market analysis</li>
            <li>System optimization</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Conversion Process
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Waste Assessment:</strong> Use our calculator above</li>
            <li><strong>Collection Planning:</strong> Organize logistics</li>
            <li><strong>Processing Setup:</strong> Prepare equipment</li>
            <li><strong>Quality Control:</strong> Monitor standards</li>
            <li><strong>Storage:</strong> Proper conditions</li>
            <li><strong>Distribution:</strong> Market delivery</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Conversion Challenges
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Processing capacity</li>
            <li>Quality consistency</li>
            <li>Storage limitations</li>
            <li>Market demand</li>
            <li>Equipment maintenance</li>
            <li>Regulatory compliance</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Tips for Waste Management
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Collection:</strong> Maintain schedule
          2. <strong>Quality Control:</strong> Monitor parameters
          3. <strong>Storage Management:</strong> Proper conditions
          4. <strong>Market Research:</strong> Understand demand
          5. <strong>Documentation:</strong> Keep records
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Waste Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>25-45% cost reduction</li>
            <li>New revenue streams</li>
            <li>Better environmental compliance</li>
            <li>Improved sustainability</li>
            <li>Enhanced farm reputation</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How much fertilizer can I produce?</strong>
          <Typography paragraph>
            A: It varies by waste volume and processing efficiency. Use our calculator for specific estimates.
          </Typography>

          <strong>Q: What affects fertilizer quality?</strong>
          <Typography paragraph>
            A: Processing method, waste composition, and storage conditions. Our calculator helps optimize these factors.
          </Typography>

          <strong>Q: Is waste conversion profitable?</strong>
          <Typography paragraph>
            A: Yes, when properly managed. Our tool helps calculate potential returns and optimize operations.
          </Typography>

          <strong>Q: What equipment do I need?</strong>
          <Typography paragraph>
            A: Requirements vary by scale and method. Use our calculator to determine capacity needs.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective waste-to-fertilizer conversion is crucial for sustainable aquaculture operations. Use our waste calculator above to optimize your conversion process and maximize returns. Follow the guidelines in this guide to implement effective waste management strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Waste Management Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default WasteFertilizerCalculator; 