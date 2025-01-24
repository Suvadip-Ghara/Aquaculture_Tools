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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';
import FormField from '../components/FormField';

interface FeedingSchedule {
  id: string;
  time: string;
  amount: number;
  type: string;
  notes: string;
}

interface FeedStock {
  type: string;
  amount: number;
  unit: string;
  lastUpdated: string;
}

const initialSchedules: FeedingSchedule[] = [
  {
    id: '1',
    time: '08:00',
    amount: 2.5,
    type: 'Starter Feed',
    notes: 'Morning feeding',
  },
  {
    id: '2',
    time: '14:00',
    amount: 2.0,
    type: 'Grower Feed',
    notes: 'Afternoon feeding',
  },
  {
    id: '3',
    time: '18:00',
    amount: 1.5,
    type: 'Finisher Feed',
    notes: 'Evening feeding',
  },
];

const initialStock: FeedStock[] = [
  {
    type: 'Starter Feed',
    amount: 50,
    unit: 'kg',
    lastUpdated: new Date().toISOString(),
  },
  {
    type: 'Grower Feed',
    amount: 75,
    unit: 'kg',
    lastUpdated: new Date().toISOString(),
  },
  {
    type: 'Finisher Feed',
    amount: 100,
    unit: 'kg',
    lastUpdated: new Date().toISOString(),
  },
];

const FeedManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<FeedingSchedule[]>(initialSchedules);
  const [stock, setStock] = useState<FeedStock[]>(initialStock);
  const [editingSchedule, setEditingSchedule] = useState<FeedingSchedule | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<FeedingSchedule>>({});
  const [stockUpdate, setStockUpdate] = useState<{ type: string; amount: string }>({
    type: '',
    amount: '',
  });

  const handleScheduleChange = (field: keyof FeedingSchedule) => (value: string) => {
    setNewSchedule((prev) => ({ ...prev, [field]: value }));
  };

  const handleStockChange = (field: keyof typeof stockUpdate) => (value: string) => {
    setStockUpdate((prev) => ({ ...prev, [field]: value }));
  };

  const addSchedule = () => {
    if (newSchedule.time && newSchedule.amount && newSchedule.type) {
      const schedule: FeedingSchedule = {
        id: Date.now().toString(),
        time: newSchedule.time as string,
        amount: parseFloat(newSchedule.amount as string),
        type: newSchedule.type as string,
        notes: newSchedule.notes || '',
      };
      setSchedules([...schedules, schedule]);
      setNewSchedule({});
      setShowDialog(false);
    }
  };

  const editSchedule = (schedule: FeedingSchedule) => {
    setEditingSchedule(schedule);
    setNewSchedule(schedule);
    setShowDialog(true);
  };

  const updateSchedule = () => {
    if (editingSchedule && newSchedule.time && newSchedule.amount && newSchedule.type) {
      const updatedSchedules = schedules.map((s) =>
        s.id === editingSchedule.id
          ? {
              ...s,
              time: newSchedule.time as string,
              amount: parseFloat(newSchedule.amount as string),
              type: newSchedule.type as string,
              notes: newSchedule.notes || '',
            }
          : s
      );
      setSchedules(updatedSchedules);
      setEditingSchedule(null);
      setNewSchedule({});
      setShowDialog(false);
    }
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const updateStock = () => {
    if (stockUpdate.type && stockUpdate.amount) {
      const updatedStock = stock.map((s) =>
        s.type === stockUpdate.type
          ? {
              ...s,
              amount: parseFloat(stockUpdate.amount),
              lastUpdated: new Date().toISOString(),
            }
          : s
      );
      setStock(updatedStock);
      setStockUpdate({ type: '', amount: '' });
    }
  };

  const calculateDailyUsage = (feedType: string): number => {
    return schedules
      .filter((s) => s.type === feedType)
      .reduce((sum, schedule) => sum + schedule.amount, 0);
  };

  const calculateDaysRemaining = (feedType: string): number => {
    const stockItem = stock.find((s) => s.type === feedType);
    const dailyUsage = calculateDailyUsage(feedType);
    if (stockItem && dailyUsage > 0) {
      return Math.floor(stockItem.amount / dailyUsage);
    }
    return 0;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Feed Management
        </Typography>

        <Grid container spacing={3}>
          {/* Feed Stock Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Feed Stock
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Feed Type</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Daily Usage</TableCell>
                            <TableCell>Days Remaining</TableCell>
                            <TableCell>Last Updated</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stock.map((item) => (
                            <TableRow key={item.type}>
                              <TableCell>{item.type}</TableCell>
                              <TableCell>{item.amount} {item.unit}</TableCell>
                              <TableCell>{calculateDailyUsage(item.type)} {item.unit}</TableCell>
                              <TableCell>{calculateDaysRemaining(item.type)} days</TableCell>
                              <TableCell>{item.lastUpdated}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Feed Type</InputLabel>
                      <Select
                        value={stockUpdate.type}
                        label="Feed Type"
                        onChange={(e) => setStockUpdate({ ...stockUpdate, type: e.target.value })}
                      >
                        {stock.map((type) => (
                          <MenuItem key={type.type} value={type.type}>
                            {type.type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Update Amount (kg)"
                      value={stockUpdate.amount}
                      onChange={(e) => setStockUpdate({ ...stockUpdate, amount: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      onClick={updateStock}
                      disabled={!stockUpdate.type || !stockUpdate.amount}
                      sx={{ mt: 1 }}
                    >
                      Update Stock
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Feeding Schedule Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Feeding Schedule
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Time"
                      name="time"
                      value={newSchedule.time || ''}
                      onChange={handleScheduleChange('time')}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity (kg)"
                      name="amount"
                      value={newSchedule.amount?.toString() || ''}
                      onChange={handleScheduleChange('amount')}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Feed Type</InputLabel>
                      <Select
                        name="type"
                        value={newSchedule.type || ''}
                        label="Feed Type"
                        onChange={handleScheduleChange('type')}
                      >
                        {stock.map((type) => (
                          <MenuItem key={type.type} value={type.type}>
                            {type.type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={newSchedule.notes || ''}
                      onChange={handleScheduleChange('notes')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={editingSchedule ? updateSchedule : addSchedule}
                      startIcon={editingSchedule ? <SaveIcon /> : <AddIcon />}
                    >
                      {editingSchedule ? 'Save Changes' : 'Add Schedule'}
                    </Button>
                    {editingSchedule && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditingSchedule(null);
                          setNewSchedule({});
                        }}
                        startIcon={<CancelIcon />}
                        sx={{ ml: 1 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Grid>
                </Grid>

                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Feed Type</TableCell>
                        <TableCell>Quantity (kg)</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.time}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.notes}</TableCell>
                            <TableCell>
                              <Tooltip title="Edit">
                                <IconButton onClick={() => editSchedule(item)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton onClick={() => deleteSchedule(item.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🍽️ Feed Management: Complete Guide to Aquaculture Nutrition
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on feed management in aquaculture! Proper feeding is crucial for optimal growth and profitability. In this detailed guide, we'll explore everything you need to know about managing feed in your aquaculture facility. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Feed Management Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Feed typically represents 50-70% of production costs. Effective management optimizes growth, reduces waste, and maximizes profitability while maintaining water quality.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Feed Management
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Cost reduction</li>
            <li>Better growth rates</li>
            <li>Improved FCR</li>
            <li>Water quality maintenance</li>
            <li>Reduced waste</li>
            <li>Higher profits</li>
            <li>Environmental sustainability</li>
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
            <li><strong>Feed Type:</strong> Nutritional needs</li>
            <li><strong>Feeding Rate:</strong> Daily amount</li>
            <li><strong>Frequency:</strong> Timing</li>
            <li><strong>Size:</strong> Pellet dimensions</li>
            <li><strong>Quality:</strong> Nutrient content</li>
            <li><strong>Storage:</strong> Conditions</li>
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
            <li>Weather shifts</li>
            <li>Water quality issues</li>
            <li>Health problems</li>
            <li>Growth plateaus</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Feed Management
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Assessment:</strong> Use our calculator above</li>
            <li><strong>Planning:</strong> Set schedules</li>
            <li><strong>Implementation:</strong> Follow plans</li>
            <li><strong>Monitoring:</strong> Track response</li>
            <li><strong>Adjustment:</strong> Optimize rates</li>
            <li><strong>Documentation:</strong> Record data</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Feeding Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Overfeeding</li>
            <li>Poor timing</li>
            <li>Wrong size</li>
            <li>Storage problems</li>
            <li>Quality issues</li>
            <li>Waste accumulation</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Feeding Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Observation:</strong> Watch feeding behavior
          2. <strong>Consistency:</strong> Regular times
          3. <strong>Quality Check:</strong> Inspect feed
          4. <strong>Storage:</strong> Proper conditions
          5. <strong>Records:</strong> Track consumption
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Feed Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>15-30% cost reduction</li>
            <li>Better FCR</li>
            <li>Faster growth</li>
            <li>Less waste</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How much should I feed?</strong>
          <Typography paragraph>
            A: It varies by species and size. Use our calculator for precise amounts.
          </Typography>

          <strong>Q: How often should I feed?</strong>
          <Typography paragraph>
            A: Multiple small meals are often better than fewer large ones. Our tool helps optimize frequency.
          </Typography>

          <strong>Q: What affects feed intake?</strong>
          <Typography paragraph>
            A: Temperature, water quality, health, and stress. Our calculator considers these factors.
          </Typography>

          <strong>Q: How do I prevent waste?</strong>
          <Typography paragraph>
            A: Monitor feeding behavior and adjust amounts. Our tool helps calculate optimal quantities.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Effective feed management is crucial for successful aquaculture operations. Use our feed management calculator above to optimize your feeding strategy. Follow the guidelines in this guide to implement effective feeding practices.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Nutrition Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default FeedManagement;