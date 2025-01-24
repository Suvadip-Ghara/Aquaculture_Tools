import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Rating,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore,
  WaterDrop,
  Thermostat,
  Science,
  AttachMoney,
  LocalShipping,
  Gavel,
  Timeline,
  TrendingUp,
} from '@mui/icons-material';
import FormField from '../components/FormField';

interface SuitabilityData {
  waterTemperature: number[];
  waterPH: number[];
  dissolvedOxygen: number;
  waterDepth: number;
  location: string;
  budget: string;
  experience: string;
  marketPreference: string;
  growthRate: string;
  diseaseResistance: string;
}

const initialFormData: SuitabilityData = {
  waterTemperature: [20, 30],
  waterPH: [6.5, 8.5],
  dissolvedOxygen: 5,
  waterDepth: 2,
  location: '',
  budget: '',
  experience: '',
  marketPreference: '',
  growthRate: '',
  diseaseResistance: '',
};

interface Species {
  name: string;
  scientificName: string;
  image: string;
  temperatureRange: number[];
  phRange: number[];
  minOxygen: number;
  minDepth: number;
  growthRate: number;
  diseaseResistance: number;
  marketValue: number;
  difficulty: number;
  regulations: string[];
  characteristics: string[];
  care: string[];
  marketTrends: {
    demand: 'High' | 'Medium' | 'Low';
    priceRange: string;
    seasonality: string;
  };
}

const speciesData: Species[] = [
  {
    name: 'Tilapia',
    scientificName: 'Oreochromis niloticus',
    image: '/species/tilapia.jpg',
    temperatureRange: [24, 32],
    phRange: [6.0, 8.5],
    minOxygen: 4,
    minDepth: 1,
    growthRate: 4.5,
    diseaseResistance: 4,
    marketValue: 3,
    difficulty: 2,
    regulations: [
      'Common aquaculture species in most regions',
      'May require permits for commercial farming',
      'Some restrictions on non-native species',
    ],
    characteristics: [
      'Hardy and adaptable',
      'Fast growth rate',
      'Efficient feed conversion',
      'Tolerant of poor water quality',
    ],
    care: [
      'Regular water quality monitoring',
      'Maintain water temperature above 24°C',
      'Feed 2-3 times daily',
      'Stock at appropriate density',
    ],
    marketTrends: {
      demand: 'High',
      priceRange: '$2-4/kg',
      seasonality: 'Year-round demand',
    },
  },
  {
    name: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    image: '/species/trout.jpg',
    temperatureRange: [10, 18],
    phRange: [6.5, 8.0],
    minOxygen: 6,
    minDepth: 1.5,
    growthRate: 3.5,
    diseaseResistance: 3,
    marketValue: 4,
    difficulty: 4,
    regulations: [
      'Strict environmental regulations',
      'Water discharge permits required',
      'Regular health inspections mandatory',
    ],
    characteristics: [
      'Cold water species',
      'High protein requirement',
      'Sensitive to water quality',
      'Premium market value',
    ],
    care: [
      'Maintain high oxygen levels',
      'Regular water quality testing',
      'Temperature control essential',
      'High-quality feed required',
    ],
    marketTrends: {
      demand: 'High',
      priceRange: '$6-10/kg',
      seasonality: 'Peak demand in winter',
    },
  },
  // Add more species as needed
];

const steps = ['Environmental Parameters', 'Operational Factors', 'Market Preferences'];

export default function SpeciesSuitability() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<SuitabilityData>(initialFormData);
  const [recommendations, setRecommendations] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      calculateRecommendations();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field: keyof SuitabilityData) => (
    value: string | number | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateSuitabilityScore = (species: Species): number => {
    let score = 0;

    // Temperature suitability
    const tempMatch =
      formData.waterTemperature[0] >= species.temperatureRange[0] &&
      formData.waterTemperature[1] <= species.temperatureRange[1];
    score += tempMatch ? 20 : 0;

    // pH suitability
    const phMatch =
      formData.waterPH[0] >= species.phRange[0] &&
      formData.waterPH[1] <= species.phRange[1];
    score += phMatch ? 15 : 0;

    // Oxygen requirements
    score += formData.dissolvedOxygen >= species.minOxygen ? 15 : 0;

    // Depth requirements
    score += formData.waterDepth >= species.minDepth ? 10 : 0;

    // Experience level match
    const experienceFactor = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    }[formData.experience] || 2;
    score += Math.max(0, 10 - Math.abs(experienceFactor - species.difficulty) * 3);

    // Growth rate preference match
    if (formData.growthRate === 'fast' && species.growthRate >= 4) score += 10;
    if (formData.growthRate === 'medium' && species.growthRate >= 3) score += 8;
    if (formData.growthRate === 'slow') score += 6;

    // Disease resistance preference match
    if (formData.diseaseResistance === 'high' && species.diseaseResistance >= 4) score += 10;
    if (formData.diseaseResistance === 'medium' && species.diseaseResistance >= 3) score += 8;
    if (formData.diseaseResistance === 'low') score += 6;

    // Market value match
    if (formData.marketPreference === 'high' && species.marketValue >= 4) score += 10;
    if (formData.marketPreference === 'medium' && species.marketValue >= 3) score += 8;
    if (formData.marketPreference === 'low') score += 6;

    return score;
  };

  const calculateRecommendations = () => {
    const scoredSpecies = speciesData.map((species) => ({
      species,
      score: calculateSuitabilityScore(species),
    }));

    const sortedSpecies = scoredSpecies
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score >= 60)
      .map((item) => item.species);

    setRecommendations(sortedSpecies);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Water Temperature Range (°C)
              </Typography>
              <Slider
                value={formData.waterTemperature}
                onChange={(_, value) => handleChange('waterTemperature')(value)}
                valueLabelDisplay="auto"
                min={0}
                max={40}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                pH Range
              </Typography>
              <Slider
                value={formData.waterPH}
                onChange={(_, value) => handleChange('waterPH')(value)}
                valueLabelDisplay="auto"
                min={4}
                max={10}
                step={0.1}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Dissolved Oxygen (mg/L)"
                value={formData.dissolvedOxygen.toString()}
                onChange={(value) => handleChange('dissolvedOxygen')(parseFloat(value))}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Water Depth (m)"
                value={formData.waterDepth.toString()}
                onChange={(value) => handleChange('waterDepth')(parseFloat(value))}
                type="number"
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={formData.experience}
                  onChange={(e) => handleChange('experience')(e.target.value)}
                  label="Experience Level"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Budget Level</InputLabel>
                <Select
                  value={formData.budget}
                  onChange={(e) => handleChange('budget')(e.target.value)}
                  label="Budget Level"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Desired Growth Rate</InputLabel>
                <Select
                  value={formData.growthRate}
                  onChange={(e) => handleChange('growthRate')(e.target.value)}
                  label="Desired Growth Rate"
                >
                  <MenuItem value="slow">Slow</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="fast">Fast</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Disease Resistance Priority</InputLabel>
                <Select
                  value={formData.diseaseResistance}
                  onChange={(e) => handleChange('diseaseResistance')(e.target.value)}
                  label="Disease Resistance Priority"
                >
                  <MenuItem value="low">Low Priority</MenuItem>
                  <MenuItem value="medium">Medium Priority</MenuItem>
                  <MenuItem value="high">High Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Market Value Preference</InputLabel>
                <Select
                  value={formData.marketPreference}
                  onChange={(e) => handleChange('marketPreference')(e.target.value)}
                  label="Market Value Preference"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location}
                  onChange={(e) => handleChange('location')(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="tropical">Tropical</MenuItem>
                  <MenuItem value="subtropical">Subtropical</MenuItem>
                  <MenuItem value="temperate">Temperate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Species Suitability Analyzer
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find the most suitable fish species for your aquaculture operation based on environmental
        conditions and operational preferences.
      </Typography>

      {!recommendations.length ? (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Get Recommendations' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Box>
          <Button
            variant="outlined"
            onClick={() => {
              setRecommendations([]);
              setSelectedSpecies(null);
              setActiveStep(0);
            }}
            sx={{ mb: 3 }}
          >
            Start New Analysis
          </Button>

          <Grid container spacing={3}>
            <Grid item xs={12} md={selectedSpecies ? 4 : 12}>
              <Typography variant="h6" gutterBottom>
                Recommended Species
              </Typography>
              <Grid container spacing={2}>
                {recommendations.map((species) => (
                  <Grid item xs={12} key={species.name}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedSpecies?.name === species.name ? 'primary.light' : 'inherit',
                      }}
                      onClick={() => setSelectedSpecies(species)}
                    >
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <CardMedia
                              component="img"
                              height="140"
                              image={species.image}
                              alt={species.name}
                              sx={{ borderRadius: 1 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                              {species.name}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              {species.scientificName}
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Typography component="span" variant="body2" color="text.secondary">
                                Growth Rate:
                              </Typography>
                              <Rating
                                value={species.growthRate}
                                readOnly
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            <Box sx={{ mb: 1 }}>
                              <Typography component="span" variant="body2" color="text.secondary">
                                Disease Resistance:
                              </Typography>
                              <Rating
                                value={species.diseaseResistance}
                                readOnly
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={`Market Value: ${species.marketTrends.demand}`}
                                size="small"
                                color="primary"
                                sx={{ mr: 1 }}
                              />
                              <Chip
                                label={species.marketTrends.priceRange}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {selectedSpecies && (
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Detailed Species Profile
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    {selectedSpecies.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {selectedSpecies.scientificName}
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Temperature Range</TableCell>
                              <TableCell>
                                {selectedSpecies.temperatureRange[0]}-
                                {selectedSpecies.temperatureRange[1]}°C
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>pH Range</TableCell>
                              <TableCell>
                                {selectedSpecies.phRange[0]}-{selectedSpecies.phRange[1]}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Min. Oxygen</TableCell>
                              <TableCell>{selectedSpecies.minOxygen} mg/L</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Min. Depth</TableCell>
                              <TableCell>{selectedSpecies.minDepth} m</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Growth Rate
                        </Typography>
                        <Rating value={selectedSpecies.growthRate} readOnly />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Disease Resistance
                        </Typography>
                        <Rating value={selectedSpecies.diseaseResistance} readOnly />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Market Value
                        </Typography>
                        <Rating value={selectedSpecies.marketValue} readOnly />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Farming Difficulty
                        </Typography>
                        <Rating value={selectedSpecies.difficulty} readOnly />
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1">Characteristics</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul>
                          {selectedSpecies.characteristics.map((char, index) => (
                            <li key={index}>
                              <Typography variant="body2">{char}</Typography>
                            </li>
                          ))}
                        </ul>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1">Care Requirements</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul>
                          {selectedSpecies.care.map((item, index) => (
                            <li key={index}>
                              <Typography variant="body2">{item}</Typography>
                            </li>
                          ))}
                        </ul>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1">Regulations</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul>
                          {selectedSpecies.regulations.map((reg, index) => (
                            <li key={index}>
                              <Typography variant="body2">{reg}</Typography>
                            </li>
                          ))}
                        </ul>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1">Market Trends</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" gutterBottom>
                              Market Demand
                            </Typography>
                            <Chip
                              label={selectedSpecies.marketTrends.demand}
                              color="primary"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" gutterBottom>
                              Price Range
                            </Typography>
                            <Chip
                              label={selectedSpecies.marketTrends.priceRange}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" gutterBottom>
                              Seasonality
                            </Typography>
                            <Typography variant="body2">
                              {selectedSpecies.marketTrends.seasonality}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🐟 Species Selection: Complete Guide to Aquaculture Success
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on species selection in aquaculture! Choosing the right species is fundamental to farming success. In this detailed guide, we'll explore everything you need to know about selecting and managing suitable species for your farm. 🎯
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Species Selection Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Species selection determines production success, profitability, and sustainability. It's the foundation of your aquaculture business.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Selection
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better growth</li>
            <li>Higher survival</li>
            <li>Market demand</li>
            <li>Cost efficiency</li>
            <li>Easy management</li>
            <li>Resource fit</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Selection Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Climate:</strong> Temperature range</li>
            <li><strong>Water:</strong> Quality needs</li>
            <li><strong>Space:</strong> Area required</li>
            <li><strong>Market:</strong> Demand trends</li>
            <li><strong>Skills:</strong> Management needs</li>
            <li><strong>Cost:</strong> Investment level</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Assess Suitability
        </Typography>
        <Typography variant="body1" paragraph>
          Key assessment times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Farm planning</li>
            <li>System changes</li>
            <li>Market shifts</li>
            <li>Climate changes</li>
            <li>Resource updates</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Selection
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Analysis:</strong> Use our tool</li>
            <li><strong>Research:</strong> Study species</li>
            <li><strong>Assessment:</strong> Check fit</li>
            <li><strong>Planning:</strong> Set strategy</li>
            <li><strong>Testing:</strong> Start small</li>
            <li><strong>Scaling:</strong> Grow smart</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Selection Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Climate mismatch</li>
            <li>Market problems</li>
            <li>Resource gaps</li>
            <li>Skill shortages</li>
            <li>Cost overruns</li>
            <li>Management issues</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Selection Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Research Well:</strong> Study thoroughly
          2. <strong>Start Small:</strong> Test first
          3. <strong>Market Focus:</strong> Check demand
          4. <strong>Resource Match:</strong> Ensure fit
          5. <strong>Future View:</strong> Plan ahead
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Selection
        </Typography>
        <Typography variant="body1" paragraph>
          Proper selection leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>30-40% better success</li>
            <li>Higher profits</li>
            <li>Easier management</li>
            <li>Better scaling</li>
            <li>Long-term success</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How to choose species?</strong>
          <Typography paragraph>
            A: Consider multiple factors. Our tool helps analyze options.
          </Typography>

          <strong>Q: Best starter species?</strong>
          <Typography paragraph>
            A: Depends on conditions. Our tool suggests matches.
          </Typography>

          <strong>Q: Market considerations?</strong>
          <Typography paragraph>
            A: Check local demand. Our tool includes market data.
          </Typography>

          <strong>Q: Resource needs?</strong>
          <Typography paragraph>
            A: Varies by species. Our tool calculates requirements.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper species selection is crucial for successful aquaculture operations. Use our species suitability analyzer above to find your best match. Follow the guidelines in this guide to make informed selection decisions.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Species Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};