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
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SelectChangeEvent } from '@mui/material/Select';

interface GrowthData {
  date: string;
  weight: number;
  length: number;
  sampleSize: number;
  notes: string;
}

interface GrowthRecord {
  id: string;
  species: string;
  batchId: string;
  data: GrowthData[];
}

const initialGrowthData: GrowthData = {
  date: new Date().toISOString().split('T')[0],
  weight: 0,
  length: 0,
  sampleSize: 0,
  notes: '',
};

const GrowthTracker: React.FC = () => {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<GrowthRecord | null>(null);
  const [newData, setNewData] = useState<GrowthData>(initialGrowthData);
  const [species, setSpecies] = useState('');
  const [batchId, setBatchId] = useState('');

  const handleSpeciesChange = (event: SelectChangeEvent) => {
    setSpecies(event.target.value);
  };

  const handleBatchIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBatchId(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewData(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value),
    }));
  };

  const createNewRecord = () => {
    if (!species || !batchId) return;

    const newRecord: GrowthRecord = {
      id: Date.now().toString(),
      species,
      batchId,
      data: [],
    };

    setRecords(prev => [...prev, newRecord]);
    setCurrentRecord(newRecord);
    setNewData(initialGrowthData);
  };

  const addGrowthData = () => {
    if (!currentRecord) return;

    const updatedRecord = {
      ...currentRecord,
      data: [...currentRecord.data, { ...newData }],
    };

    setRecords(prev =>
      prev.map(record =>
        record.id === currentRecord.id ? updatedRecord : record
      )
    );
    setCurrentRecord(updatedRecord);
    setNewData(initialGrowthData);
  };

  const calculateGrowthRate = (data: GrowthData[]) => {
    if (data.length < 2) return null;

    const firstRecord = data[0];
    const lastRecord = data[data.length - 1];
    const daysDiff = (new Date(lastRecord.date).getTime() - new Date(firstRecord.date).getTime()) / (1000 * 60 * 60 * 24);
    const weightDiff = lastRecord.weight - firstRecord.weight;

    return (weightDiff / daysDiff).toFixed(2);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Growth Tracker
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Batch Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Species</InputLabel>
                      <Select
                        value={species}
                        label="Species"
                        onChange={handleSpeciesChange}
                      >
                        <MenuItem value="tilapia">Tilapia</MenuItem>
                        <MenuItem value="carp">Carp</MenuItem>
                        <MenuItem value="catfish">Catfish</MenuItem>
                        <MenuItem value="trout">Trout</MenuItem>
                        <MenuItem value="salmon">Salmon</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Batch ID"
                      value={batchId}
                      onChange={handleBatchIdChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={createNewRecord}
                      disabled={!species || !batchId}
                    >
                      Create New Batch
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {currentRecord && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Add Growth Data
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="date"
                        name="date"
                        label="Date"
                        value={newData.date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        name="weight"
                        label="Average Weight (g)"
                        value={newData.weight}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        name="length"
                        label="Average Length (cm)"
                        value={newData.length}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        name="sampleSize"
                        label="Sample Size"
                        value={newData.sampleSize}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="notes"
                        label="Notes"
                        multiline
                        rows={2}
                        value={newData.notes}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={addGrowthData}
                        disabled={!newData.weight || !newData.length}
                      >
                        Add Data
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {currentRecord && currentRecord.data.length > 0 && (
            <>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Growth Chart
                    </Typography>
                    <Box sx={{ width: '100%', height: 400 }}>
                      <ResponsiveContainer>
                        <LineChart
                          data={currentRecord.data}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: 'Length (cm)', angle: 90, position: 'insideRight' }} />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight" />
                          <Line yAxisId="right" type="monotone" dataKey="length" stroke="#82ca9d" name="Length" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Growth Data
                    </Typography>
                    {calculateGrowthRate(currentRecord.data) && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Average Growth Rate: {calculateGrowthRate(currentRecord.data)} g/day
                      </Alert>
                    )}
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Weight (g)</TableCell>
                            <TableCell>Length (cm)</TableCell>
                            <TableCell>Sample Size</TableCell>
                            <TableCell>Notes</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentRecord.data.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.date}</TableCell>
                              <TableCell>{row.weight}</TableCell>
                              <TableCell>{row.length}</TableCell>
                              <TableCell>{row.sampleSize}</TableCell>
                              <TableCell>{row.notes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          📈 Growth Tracking: Complete Guide to Fish Development
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on growth tracking in aquaculture! Monitoring fish development is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about tracking and optimizing growth. 🐟
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Growth Tracking Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Growth tracking helps optimize feed, predict harvest, and ensure profitability. It's essential for farm success.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Tracking
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better feed management</li>
            <li>Early problem detection</li>
            <li>Accurate predictions</li>
            <li>Cost control</li>
            <li>Performance insights</li>
            <li>Production planning</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Growth Metrics
        </Typography>
        <Typography variant="body1" paragraph>
          Essential measurements:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Weight:</strong> Average size</li>
            <li><strong>Length:</strong> Fish size</li>
            <li><strong>FCR:</strong> Feed efficiency</li>
            <li><strong>SGR:</strong> Growth rate</li>
            <li><strong>Biomass:</strong> Total weight</li>
            <li><strong>Uniformity:</strong> Size variation</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Track Growth
        </Typography>
        <Typography variant="body1" paragraph>
          Key monitoring times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Weekly sampling</li>
            <li>Feed adjustments</li>
            <li>Health checks</li>
            <li>Grade planning</li>
            <li>Harvest timing</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Tracking
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Sample:</strong> Use our tool</li>
            <li><strong>Measure:</strong> Record data</li>
            <li><strong>Calculate:</strong> Find metrics</li>
            <li><strong>Compare:</strong> Check targets</li>
            <li><strong>Adjust:</strong> Make changes</li>
            <li><strong>Record:</strong> Keep history</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Growth Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Slow growth</li>
            <li>Size variation</li>
            <li>Poor FCR</li>
            <li>Health impacts</li>
            <li>Feed waste</li>
            <li>Data gaps</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Growth Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Checks:</strong> Stay current
          2. <strong>Good Records:</strong> Track details
          3. <strong>Sample Size:</strong> Be thorough
          4. <strong>Data Analysis:</strong> Find trends
          5. <strong>Quick Action:</strong> Address issues
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Tracking
        </Typography>
        <Typography variant="body1" paragraph>
          Effective tracking leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>20-30% better growth</li>
            <li>Feed savings</li>
            <li>Better planning</li>
            <li>Quality control</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How often to sample?</strong>
          <Typography paragraph>
            A: Depends on stage. Our tool guides timing.
          </Typography>

          <strong>Q: Sample size needed?</strong>
          <Typography paragraph>
            A: Varies by population. Our tool calculates.
          </Typography>

          <strong>Q: Best metrics?</strong>
          <Typography paragraph>
            A: Multiple options. Our tool suggests key ones.
          </Typography>

          <strong>Q: Growth problems?</strong>
          <Typography paragraph>
            A: Various causes. Our tool helps diagnose.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper growth tracking is crucial for successful aquaculture operations. Use our growth tracker tool above to monitor and optimize fish development. Follow the guidelines in this guide to implement effective tracking strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Growth Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default GrowthTracker; 