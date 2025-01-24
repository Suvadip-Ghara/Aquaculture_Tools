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
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Equipment {
  name: string;
  power: number;
  hours: number;
  quantity: number;
  efficiency: number;
}

interface EnergyData {
  equipment: Equipment[];
  electricityRate: number;
  peakHours: number[];
  offPeakHours: number[];
  solarPotential: boolean;
  backupRequired: boolean;
}

interface EnergyAnalysis {
  dailyConsumption: number;
  monthlyConsumption: number;
  annualConsumption: number;
  peakCost: number;
  offPeakCost: number;
  totalCost: number;
  co2Emissions: number;
  recommendations: string[];
  savingsPotential: {
    measure: string;
    savings: number;
    cost: number;
    payback: number;
  }[];
  equipmentEfficiency: {
    name: string;
    efficiency: number;
    recommendation: string;
  }[];
}

const equipmentTypes = {
  aerator: { baseEfficiency: 0.75, optimalEfficiency: 0.85 },
  pump: { baseEfficiency: 0.70, optimalEfficiency: 0.80 },
  feeder: { baseEfficiency: 0.80, optimalEfficiency: 0.90 },
  lighting: { baseEfficiency: 0.85, optimalEfficiency: 0.95 },
  heater: { baseEfficiency: 0.75, optimalEfficiency: 0.85 },
  filter: { baseEfficiency: 0.70, optimalEfficiency: 0.80 },
};

const initialEquipment: Equipment = {
  name: '',
  power: 0,
  hours: 0,
  quantity: 1,
  efficiency: 0.75,
};

const initialFormData: EnergyData = {
  equipment: [],
  electricityRate: 0,
  peakHours: [],
  offPeakHours: [],
  solarPotential: false,
  backupRequired: false,
};

const EnergyEfficiencyCalculator: React.FC = () => {
  const [formData, setFormData] = useState<EnergyData>(initialFormData);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(initialEquipment);
  const [analysis, setAnalysis] = useState<EnergyAnalysis | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<{ month: string; consumption: number }>>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentEquipment(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value),
    }));
  };

  const handleEquipmentTypeChange = (event: SelectChangeEvent) => {
    const type = event.target.value as keyof typeof equipmentTypes;
    setCurrentEquipment(prev => ({
      ...prev,
      name: type,
      efficiency: equipmentTypes[type].baseEfficiency,
    }));
  };

  const addEquipment = () => {
    if (currentEquipment.name && currentEquipment.power > 0 && currentEquipment.hours > 0) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, currentEquipment],
      }));
      setCurrentEquipment(initialEquipment);
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }));
  };

  const calculateEnergyEfficiency = () => {
    const { equipment, electricityRate } = formData;

    // Calculate daily consumption for each equipment
    const dailyConsumption = equipment.reduce((total, item) => {
      return total + (item.power * item.hours * item.quantity * (1 / item.efficiency));
    }, 0);

    // Calculate monthly and annual consumption
    const monthlyConsumption = dailyConsumption * 30;
    const annualConsumption = monthlyConsumption * 12;

    // Calculate costs
    const peakHoursCost = dailyConsumption * electricityRate * 1.2; // 20% higher during peak hours
    const offPeakCost = dailyConsumption * electricityRate * 0.8; // 20% lower during off-peak hours
    const totalCost = (peakHoursCost + offPeakCost) * 30; // Monthly cost

    // Calculate CO2 emissions (assuming 0.5 kg CO2 per kWh)
    const co2Emissions = annualConsumption * 0.5;

    // Analyze equipment efficiency
    const equipmentEfficiency = equipment.map(item => {
      const type = item.name as keyof typeof equipmentTypes;
      const optimal = equipmentTypes[type].optimalEfficiency;
      const current = item.efficiency;
      const recommendation = current < optimal
        ? `Upgrade or maintain ${item.name} to achieve optimal efficiency of ${optimal * 100}%`
        : `${item.name} is operating at optimal efficiency`;
      
      return {
        name: item.name,
        efficiency: current,
        recommendation,
      };
    });

    // Calculate potential savings
    const savingsPotential = [];
    
    // Equipment upgrade savings
    const equipmentSavings = equipment.reduce((total, item) => {
      const type = item.name as keyof typeof equipmentTypes;
      const potential = (1 / item.efficiency - 1 / equipmentTypes[type].optimalEfficiency) * 
                       item.power * item.hours * item.quantity * electricityRate * 30;
      return total + potential;
    }, 0);

    if (equipmentSavings > 0) {
      savingsPotential.push({
        measure: 'Equipment Upgrades',
        savings: equipmentSavings * 12, // Annual savings
        cost: equipment.length * 1000, // Estimated upgrade cost
        payback: (equipment.length * 1000) / (equipmentSavings * 12),
      });
    }

    // Solar potential savings
    if (formData.solarPotential) {
      const solarSavings = totalCost * 0.4; // 40% reduction in energy costs
      savingsPotential.push({
        measure: 'Solar Installation',
        savings: solarSavings * 12,
        cost: 15000,
        payback: 15000 / (solarSavings * 12),
      });
    }

    // Off-peak usage savings
    const peakShiftSavings = totalCost * 0.2; // 20% savings from shifting to off-peak
    savingsPotential.push({
      measure: 'Peak Hour Shifting',
      savings: peakShiftSavings * 12,
      cost: 0,
      payback: 0,
    });

    // Generate recommendations
    const recommendations = [
      `Total energy consumption can be reduced by ${(equipmentSavings / totalCost * 100).toFixed(1)}% through equipment upgrades`,
      'Implement regular maintenance schedule for all equipment',
      'Monitor and record energy consumption patterns',
    ];

    if (formData.solarPotential) {
      recommendations.push('Consider solar installation for long-term cost savings');
    }

    if (peakHoursCost > offPeakCost * 1.5) {
      recommendations.push('Shift non-essential operations to off-peak hours');
    }

    if (formData.backupRequired) {
      recommendations.push('Install energy storage system for backup power');
    }

    // Add to historical data
    const newDataPoint = {
      month: new Date().toLocaleString('default', { month: 'long' }),
      consumption: monthlyConsumption,
    };
    setHistoricalData(prev => [...prev, newDataPoint]);

    setAnalysis({
      dailyConsumption,
      monthlyConsumption,
      annualConsumption,
      peakCost: peakHoursCost * 30,
      offPeakCost: offPeakCost * 30,
      totalCost,
      co2Emissions,
      recommendations,
      savingsPotential,
      equipmentEfficiency,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Energy Efficiency Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          Analyze and optimize energy consumption in your aquaculture operation
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Equipment
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Equipment Type</InputLabel>
                      <Select
                        value={currentEquipment.name}
                        label="Equipment Type"
                        onChange={handleEquipmentTypeChange}
                      >
                        {Object.keys(equipmentTypes).map(type => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Power Rating (kW)"
                      name="power"
                      type="number"
                      value={currentEquipment.power || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Operating Hours/Day"
                      name="hours"
                      type="number"
                      value={currentEquipment.hours || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={currentEquipment.quantity || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current Efficiency (%)"
                      name="efficiency"
                      type="number"
                      value={currentEquipment.efficiency * 100 || ''}
                      onChange={(e) => handleInputChange({
                        ...e,
                        target: { ...e.target, value: String(Number(e.target.value) / 100) }
                      } as React.ChangeEvent<HTMLInputElement>)}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  onClick={addEquipment}
                  disabled={!currentEquipment.name || !currentEquipment.power || !currentEquipment.hours}
                  sx={{ mt: 2 }}
                >
                  Add Equipment
                </Button>
              </CardContent>
            </Card>

            {formData.equipment.length > 0 && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Equipment List
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Power (kW)</TableCell>
                          <TableCell>Hours</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.equipment.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.power}</TableCell>
                            <TableCell>{item.hours}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => removeEquipment(index)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Energy Rates & Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Electricity Rate ($/kWh)"
                      type="number"
                      value={formData.electricityRate || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        electricityRate: Number(e.target.value),
                      }))}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  onClick={calculateEnergyEfficiency}
                  disabled={formData.equipment.length === 0 || !formData.electricityRate}
                  sx={{ mt: 2 }}
                >
                  Calculate Efficiency
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {analysis && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Energy Consumption Analysis
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Daily Consumption</TableCell>
                          <TableCell>{analysis.dailyConsumption.toFixed(2)} kWh</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Monthly Consumption</TableCell>
                          <TableCell>{analysis.monthlyConsumption.toFixed(2)} kWh</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Annual Consumption</TableCell>
                          <TableCell>{analysis.annualConsumption.toFixed(2)} kWh</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Monthly Cost</TableCell>
                          <TableCell>${analysis.totalCost.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Annual CO2 Emissions</TableCell>
                          <TableCell>{analysis.co2Emissions.toFixed(2)} kg</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Potential Savings
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Measure</TableCell>
                          <TableCell>Annual Savings</TableCell>
                          <TableCell>Cost</TableCell>
                          <TableCell>Payback (Years)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analysis.savingsPotential.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.measure}</TableCell>
                            <TableCell>${item.savings.toFixed(2)}</TableCell>
                            <TableCell>${item.cost.toFixed(2)}</TableCell>
                            <TableCell>{item.payback.toFixed(1)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Equipment Efficiency
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Equipment</TableCell>
                          <TableCell>Current Efficiency</TableCell>
                          <TableCell>Recommendation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analysis.equipmentEfficiency.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{(item.efficiency * 100).toFixed(1)}%</TableCell>
                            <TableCell>{item.recommendation}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Recommendations:
                    </Typography>
                    <ul>
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          )}

          {historicalData.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Energy Consumption History
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Energy Consumption" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          ⚡ Energy Efficiency: Complete Guide to Power Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on energy efficiency in aquaculture! Managing power consumption is crucial for profitable farming. In this detailed guide, we'll explore everything you need to know about optimizing energy use in your operations. 💡
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Energy Efficiency Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Energy efficiency reduces costs, improves sustainability, and increases profitability. It's essential for modern aquaculture.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Efficiency
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Lower costs</li>
            <li>Better margins</li>
            <li>Sustainability</li>
            <li>Less impact</li>
            <li>System reliability</li>
            <li>Modern practices</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Efficiency Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Equipment:</strong> System types</li>
            <li><strong>Operation:</strong> Usage patterns</li>
            <li><strong>Maintenance:</strong> System care</li>
            <li><strong>Timing:</strong> Peak management</li>
            <li><strong>Alternatives:</strong> Green options</li>
            <li><strong>Monitoring:</strong> Usage tracking</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Optimize Energy
        </Typography>
        <Typography variant="body1" paragraph>
          Key optimization times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>System planning</li>
            <li>Cost reviews</li>
            <li>Equipment updates</li>
            <li>Usage spikes</li>
            <li>Season changes</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Optimization
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Assessment:</strong> Use our tool</li>
            <li><strong>Analysis:</strong> Check usage</li>
            <li><strong>Planning:</strong> Set targets</li>
            <li><strong>Implementation:</strong> Make changes</li>
            <li><strong>Monitoring:</strong> Track results</li>
            <li><strong>Adjustment:</strong> Fine-tune</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Energy Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>High consumption</li>
            <li>Peak charges</li>
            <li>Old equipment</li>
            <li>Poor timing</li>
            <li>System waste</li>
            <li>Maintenance gaps</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Efficiency Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Audits:</strong> Check usage
          2. <strong>Smart Timing:</strong> Avoid peaks
          3. <strong>Good Maintenance:</strong> Keep efficient
          4. <strong>New Technology:</strong> Stay updated
          5. <strong>Green Options:</strong> Consider solar
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Management
        </Typography>
        <Typography variant="body1" paragraph>
          Effective efficiency leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>20-30% cost savings</li>
            <li>Better reliability</li>
            <li>Lower impact</li>
            <li>Modern systems</li>
            <li>Higher profits</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How to reduce costs?</strong>
          <Typography paragraph>
            A: Multiple strategies exist. Our calculator guides optimization.
          </Typography>

          <strong>Q: Best equipment?</strong>
          <Typography paragraph>
            A: Depends on needs. Our calculator compares options.
          </Typography>

          <strong>Q: Green alternatives?</strong>
          <Typography paragraph>
            A: Several choices available. Our calculator analyzes ROI.
          </Typography>

          <strong>Q: Payback period?</strong>
          <Typography paragraph>
            A: Varies by investment. Our calculator shows estimates.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper energy efficiency is crucial for profitable aquaculture operations. Use our energy efficiency calculator above to optimize your power usage. Follow the guidelines in this guide to implement effective efficiency strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Energy Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default EnergyEfficiencyCalculator; 