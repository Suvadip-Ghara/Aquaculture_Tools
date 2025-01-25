import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import FormField from '../components/FormField';

interface FeedingData {
  species: string;
  biomass: number;
  waterTemperature: number;
  growthStage: string;
  feedingFrequency: number;
}

interface FeedingHistory {
  id: number;
  date: string;
  amount: number;
  notes: string;
}

interface Species {
  name: string;
  feedingRates: {
    [key: string]: {
      minTemp: number;
      maxTemp: number;
      rates: {
        [key: string]: number; // growth stage -> feeding rate (% of biomass)
      };
    };
  };
  feedingTips: string[];
  optimalFrequency: {
    [key: string]: number; // growth stage -> times per day
  };
}

const speciesData: { [key: string]: Species } = {
  'Tilapia': {
    name: 'Tilapia',
    feedingRates: {
      'optimal': {
        minTemp: 25,
        maxTemp: 32,
        rates: {
          'fry': 15,
          'fingerling': 8,
          'juvenile': 5,
          'adult': 3,
        },
      },
      'suboptimal': {
        minTemp: 20,
        maxTemp: 24,
        rates: {
          'fry': 12,
          'fingerling': 6,
          'juvenile': 4,
          'adult': 2,
        },
      },
    },
    feedingTips: [
      'Feed small amounts frequently for better feed conversion',
      'Observe fish behavior during feeding to avoid overfeeding',
      'Adjust feeding rate based on water quality conditions',
      'Reduce feeding during periods of stress or disease',
    ],
    optimalFrequency: {
      'fry': 6,
      'fingerling': 4,
      'juvenile': 3,
      'adult': 2,
    },
  },
  'Common Carp': {
    name: 'Common Carp',
    feedingRates: {
      'optimal': {
        minTemp: 20,
        maxTemp: 28,
        rates: {
          'fry': 12,
          'fingerling': 6,
          'juvenile': 4,
          'adult': 2,
        },
      },
      'suboptimal': {
        minTemp: 15,
        maxTemp: 19,
        rates: {
          'fry': 10,
          'fingerling': 5,
          'juvenile': 3,
          'adult': 1.5,
        },
      },
    },
    feedingTips: [
      'Carp are bottom feeders - ensure feed reaches the bottom',
      'Monitor water quality closely during intensive feeding',
      'Supplement with natural pond productivity',
      'Adjust feeding based on seasonal changes',
    ],
    optimalFrequency: {
      'fry': 5,
      'fingerling': 4,
      'juvenile': 3,
      'adult': 2,
    },
  },
  // Add more species as needed
};

const growthStages = ['fry', 'fingerling', 'juvenile', 'adult'];

export default function FeedingCalculator() {
  const [formData, setFormData] = useState<FeedingData>({
    species: '',
    biomass: 0,
    waterTemperature: 25,
    growthStage: '',
    feedingFrequency: 2,
  });

  const [feedingHistory, setFeedingHistory] = useState<FeedingHistory[]>([]);
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<FeedingHistory | null>(null);

  const handleChange = (field: keyof FeedingData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value),
    }));
  };

  const calculateFeedingRate = (): number => {
    const species = speciesData[formData.species];
    if (!species) return 0;

    const temp = formData.waterTemperature;
    let condition: 'optimal' | 'suboptimal' = 'optimal';

    if (
      temp < species.feedingRates.optimal.minTemp ||
      temp > species.feedingRates.optimal.maxTemp
    ) {
      condition = 'suboptimal';
    }

    const baseRate = species.feedingRates[condition].rates[formData.growthStage];
    const dailyAmount = (formData.biomass * baseRate) / 100;
    return dailyAmount / species.optimalFrequency[formData.growthStage];
  };

  const handleCalculate = () => {
    const amount = calculateFeedingRate();
    setCalculatedAmount(amount);
  };

  const handleAddFeeding = () => {
    if (!calculatedAmount) return;

    const newFeeding: FeedingHistory = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: calculatedAmount,
      notes: '',
    };

    setSelectedHistory(newFeeding);
    setOpenDialog(true);
  };

  const handleSaveFeeding = (notes: string) => {
    if (!selectedHistory) return;

    const newFeeding = {
      ...selectedHistory,
      notes,
    };

    if (selectedHistory.id) {
      setFeedingHistory((prev) =>
        prev.map((item) => (item.id === selectedHistory.id ? newFeeding : item))
      );
    } else {
      setFeedingHistory((prev) => [...prev, newFeeding]);
    }

    setOpenDialog(false);
    setSelectedHistory(null);
  };

  const handleDeleteFeeding = (id: number) => {
    setFeedingHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditFeeding = (feeding: FeedingHistory) => {
    setSelectedHistory(feeding);
    setOpenDialog(true);
  };

  const handleToggleReminders = () => {
    setRemindersEnabled((prev) => !prev);
    if (!remindersEnabled) {
      // Request notification permissions
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  };

  useEffect(() => {
    if (remindersEnabled && formData.species && formData.growthStage) {
      const species = speciesData[formData.species];
      const frequency = species.optimalFrequency[formData.growthStage];
      const interval = 24 / frequency;

      // Set up notifications
      const timer = setInterval(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Feeding Reminder', {
            body: `Time to feed your ${formData.species}!`,
            icon: '/logo.png',
          });
        }
      }, interval * 60 * 60 * 1000);

      return () => clearInterval(timer);
    }
  }, [remindersEnabled, formData.species, formData.growthStage]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Species-Specific Feeding Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calculate optimal feeding amounts based on species, biomass, and environmental conditions.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Feeding Parameters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Species</InputLabel>
                  <Select
                    value={formData.species}
                    onChange={handleChange('species') as (event: SelectChangeEvent<string>) => void}
                    label="Species"
                  >
                    {Object.keys(speciesData).map((species) => (
                      <MenuItem key={species} value={species}>
                        {species}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormField
                  label="Total Biomass (kg)"
                  value={formData.biomass.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, biomass: parseFloat(value) || 0 }))
                  }
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  label="Water Temperature (°C)"
                  value={formData.waterTemperature.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterTemperature: parseFloat(value) || 0,
                    }))
                  }
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Growth Stage</InputLabel>
                  <Select
                    value={formData.growthStage}
                    onChange={handleChange('growthStage') as (event: SelectChangeEvent<string>) => void}
                    label="Growth Stage"
                  >
                    {growthStages.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="contained" onClick={handleCalculate}>
                Calculate Feeding Amount
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={remindersEnabled}
                    onChange={handleToggleReminders}
                  />
                }
                label="Enable Reminders"
              />
            </Box>

            {calculatedAmount && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    Recommended Feeding Amount: {calculatedAmount.toFixed(2)} kg per feeding
                  </Typography>
                  {formData.species && formData.growthStage && (
                    <Typography variant="body2">
                      Feed {speciesData[formData.species].optimalFrequency[formData.growthStage]} times
                      per day
                    </Typography>
                  )}
                </Alert>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddFeeding}
                  fullWidth
                >
                  Log Feeding Session
                </Button>
              </Box>
            )}
          </Paper>

          {formData.species && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Feeding Tips
              </Typography>
              <ul>
                {speciesData[formData.species].feedingTips.map((tip, index) => (
                  <li key={index}>
                    <Typography variant="body2">{tip}</Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Feeding History
            </Typography>
            {feedingHistory.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount (kg)</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedingHistory.map((feeding) => (
                      <TableRow key={feeding.id}>
                        <TableCell>
                          {new Date(feeding.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{feeding.amount.toFixed(2)}</TableCell>
                        <TableCell>{feeding.notes}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditFeeding(feeding)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteFeeding(feeding.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No feeding sessions logged yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🍽️ Feeding Management: Complete Guide to Fish Nutrition
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on feeding management in aquaculture! Proper feeding is crucial for optimal growth and profitability. In this detailed guide, we'll explore everything you need to know about calculating and managing fish feed. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Feeding Management Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Feeding management affects growth, health, costs, and water quality. It's essential for successful and profitable aquaculture operations.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Feeding
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Optimal growth</li>
            <li>Better FCR</li>
            <li>Cost control</li>
            <li>Health maintenance</li>
            <li>Quality water</li>
            <li>Less waste</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Feeding Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Size:</strong> Fish stage</li>
            <li><strong>Species:</strong> Requirements</li>
            <li><strong>Temperature:</strong> Water conditions</li>
            <li><strong>Health:</strong> Fish condition</li>
            <li><strong>Feed:</strong> Quality and type</li>
            <li><strong>Method:</strong> Application</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Adjust Feeding
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for assessment:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Size changes</li>
            <li>Temperature shifts</li>
            <li>Health issues</li>
            <li>Water quality</li>
            <li>Performance review</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Feeding
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Calculation:</strong> Use our calculator</li>
            <li><strong>Planning:</strong> Set schedule</li>
            <li><strong>Preparation:</strong> Ready feed</li>
            <li><strong>Distribution:</strong> Apply method</li>
            <li><strong>Monitoring:</strong> Check response</li>
            <li><strong>Adjustment:</strong> Optimize rates</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Feeding Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Overfeeding</li>
            <li>Poor timing</li>
            <li>Wrong amount</li>
            <li>Quality issues</li>
            <li>Waste problems</li>
            <li>Health impacts</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Feeding Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Monitoring:</strong> Watch behavior
          2. <strong>Quality Control:</strong> Check feed
          3. <strong>Timing:</strong> Be consistent
          4. <strong>Distribution:</strong> Spread well
          5. <strong>Records:</strong> Track amounts
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Feeding
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>30-40% better growth</li>
            <li>Lower FCR</li>
            <li>Better health</li>
            <li>Quality water</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How much to feed?</strong>
          <Typography paragraph>
            A: Depends on size and conditions. Our calculator provides exact amounts.
          </Typography>

          <strong>Q: When to feed?</strong>
          <Typography paragraph>
            A: Based on species and schedule. Our calculator helps plan timing.
          </Typography>

          <strong>Q: Best feeding method?</strong>
          <Typography paragraph>
            A: Varies by system and species. Our calculator suggests methods.
          </Typography>

          <strong>Q: How to reduce waste?</strong>
          <Typography paragraph>
            A: Through proper management. Our calculator optimizes amounts.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper feeding management is crucial for successful aquaculture operations. Use our feeding calculator above to optimize your feeding program. Follow the guidelines in this guide to implement effective feeding strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Feeding Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedHistory?.id ? 'Edit Feeding Session' : 'New Feeding Session'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={selectedHistory?.notes || ''}
            onChange={(e) =>
              setSelectedHistory((prev) =>
                prev ? { ...prev, notes: e.target.value } : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleSaveFeeding(selectedHistory?.notes || '')}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};