import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FormField from '../components/FormField';
import type { SelectChangeEvent } from '@mui/material/Select';

interface PondData {
  length: number;
  width: number;
  depth: number;
  slopeRatio: number;
  materialType: string;
  laborCostPerDay: number;
  estimatedDays: number;
  additionalCosts: number;
}

interface Material {
  name: string;
  costPerSqm: number;
  lifespan: number;
  durability: string;
  maintenance: string;
  installation: string;
  description: string;
}

interface CostAnalysis {
  totalArea: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  costPerSqm: number;
  annualCost: number;
  recommendations: string[];
  maintenancePlan: string[];
  installationSteps: string[];
}

const materials: Record<string, Material> = {
  hdpe: {
    name: 'HDPE (High-Density Polyethylene)',
    costPerSqm: 8,
    lifespan: 15,
    durability: 'High',
    maintenance: 'Low',
    installation: 'Moderate',
    description: 'Excellent chemical resistance and durability',
  },
  pvc: {
    name: 'PVC (Polyvinyl Chloride)',
    costPerSqm: 5,
    lifespan: 10,
    durability: 'Moderate',
    maintenance: 'Moderate',
    installation: 'Easy',
    description: 'Cost-effective and widely available',
  },
  epdm: {
    name: 'EPDM (Rubber)',
    costPerSqm: 12,
    lifespan: 20,
    durability: 'Very High',
    maintenance: 'Low',
    installation: 'Easy',
    description: 'Highly flexible and excellent UV resistance',
  },
  butyl: {
    name: 'Butyl Rubber',
    costPerSqm: 15,
    lifespan: 25,
    durability: 'Very High',
    maintenance: 'Low',
    installation: 'Moderate',
    description: 'Superior durability and puncture resistance',
  },
  geomembrane: {
    name: 'Reinforced Geomembrane',
    costPerSqm: 10,
    lifespan: 18,
    durability: 'High',
    maintenance: 'Low',
    installation: 'Complex',
    description: 'High strength and good chemical resistance',
  },
};

const initialFormData: PondData = {
  length: 0,
  width: 0,
  depth: 0,
  slopeRatio: 0,
  materialType: '',
  laborCostPerDay: 0,
  estimatedDays: 0,
  additionalCosts: 0,
};

const PondLiningCalculator: React.FC = () => {
  const [formData, setFormData] = useState<PondData>(initialFormData);
  const [analysis, setAnalysis] = useState<CostAnalysis | null>(null);

  const handleInputChange = (field: keyof PondData) => (value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : String(value)
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateLiningCosts = () => {
    const {
      length,
      width,
      depth,
      slopeRatio,
      materialType,
      laborCostPerDay,
      estimatedDays,
      additionalCosts,
    } = formData;

    // Calculate total surface area including slopes
    const slopeLength = depth * slopeRatio;
    const bottomArea = length * width;
    const sideArea1 = (length + (2 * slopeLength)) * depth;
    const sideArea2 = (width + (2 * slopeLength)) * depth;
    const totalArea = bottomArea + (2 * sideArea1) + (2 * sideArea2);

    // Add 10% for overlaps and wastage
    const totalAreaWithOverlap = totalArea * 1.1;

    const material = materials[materialType];
    const materialCost = totalAreaWithOverlap * material.costPerSqm;
    const laborCost = laborCostPerDay * estimatedDays;
    const totalCost = materialCost + laborCost + additionalCosts;
    const costPerSqm = totalCost / totalArea;
    const annualCost = totalCost / material.lifespan;

    // Generate recommendations based on pond size and material
    const recommendations = [];
    if (totalArea > 1000) {
      recommendations.push('Consider hiring professional installation team');
      recommendations.push('Implement quality control measures during installation');
    }
    if (material.installation === 'Complex') {
      recommendations.push('Ensure installers are certified for this material');
    }
    if (depth > 3) {
      recommendations.push('Use reinforced material at deeper sections');
    }
    recommendations.push(`Expected lifespan: ${material.lifespan} years with proper maintenance`);

    // Generate maintenance plan
    const maintenancePlan = [
      'Regular inspection for tears and punctures',
      'Clean liner surface periodically',
      'Maintain proper water chemistry',
      'Monitor for UV degradation',
    ];
    if (material.maintenance === 'Moderate') {
      maintenancePlan.push('Schedule bi-annual professional inspection');
    }

    // Generate installation steps
    const installationSteps = [
      'Site preparation and excavation',
      'Subgrade preparation and compaction',
      'Installation of underlayment or geotextile',
      `Installation of ${material.name} liner`,
      'Seaming and joining sections',
      'Anchor trench construction',
      'Quality control inspection',
    ];
    if (material.installation === 'Complex') {
      installationSteps.push('Professional certification inspection');
    }

    setAnalysis({
      totalArea: totalAreaWithOverlap,
      materialCost,
      laborCost,
      totalCost,
      costPerSqm,
      annualCost,
      recommendations,
      maintenancePlan,
      installationSteps,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pond Lining Cost Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          Calculate costs for different pond lining materials and get installation recommendations
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormField
              type="number"
              label="Length (m)"
              value={formData.length}
              onChange={handleInputChange('length')}
              required
            />
            <FormField
              type="number"
              label="Width (m)"
              value={formData.width}
              onChange={handleInputChange('width')}
              required
            />
            <FormField
              type="number"
              label="Depth (m)"
              value={formData.depth}
              onChange={handleInputChange('depth')}
              required
            />
            <FormField
              type="number"
              label="Slope Ratio"
              value={formData.slopeRatio}
              onChange={handleInputChange('slopeRatio')}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Lining Material</InputLabel>
              <Select
                value={formData.materialType}
                onChange={handleSelectChange}
                name="materialType"
              >
                {Object.entries(materials).map(([key, material]) => (
                  <MenuItem key={key} value={key}>
                    {material.name} - {material.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.materialType && (
              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Durability</TableCell>
                      <TableCell>{materials[formData.materialType].durability}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Maintenance</TableCell>
                      <TableCell>{materials[formData.materialType].maintenance}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Installation</TableCell>
                      <TableCell>{materials[formData.materialType].installation}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lifespan</TableCell>
                      <TableCell>{materials[formData.materialType].lifespan} years</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Labor Cost per Day ($)"
              value={formData.laborCostPerDay}
              onChange={handleInputChange('laborCostPerDay')}
              type="number"
            />
            <FormField
              label="Estimated Days"
              value={formData.estimatedDays}
              onChange={handleInputChange('estimatedDays')}
              type="number"
            />
            <FormField
              label="Additional Costs ($)"
              value={formData.additionalCosts}
              onChange={handleInputChange('additionalCosts')}
              type="number"
              helperText="Equipment rental, site preparation, etc."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              onClick={calculateLiningCosts}
              disabled={!formData.length || !formData.width || !formData.depth || !formData.materialType}
              sx={{ mt: 2 }}
            >
              Calculate Costs
            </Button>
          </Grid>

          {analysis && (
            <Grid item xs={12} md={6}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Area (with overlap)</TableCell>
                      <TableCell>{analysis.totalArea.toFixed(2)} m²</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Material Cost</TableCell>
                      <TableCell>${analysis.materialCost.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Labor Cost</TableCell>
                      <TableCell>${analysis.laborCost.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Cost</TableCell>
                      <TableCell>${analysis.totalCost.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cost per Square Meter</TableCell>
                      <TableCell>${analysis.costPerSqm.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Annual Cost (over lifespan)</TableCell>
                      <TableCell>${analysis.annualCost.toFixed(2)}</TableCell>
                    </TableRow>
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

              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Maintenance Plan:
                </Typography>
                <ul>
                  {analysis.maintenancePlan.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </Alert>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Installation Steps:
                </Typography>
                <ol>
                  {analysis.installationSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🏊‍♂️ Pond Lining: Complete Guide to Water Retention
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on pond lining in aquaculture! Proper pond lining is crucial for water retention and pond stability. In this detailed guide, we'll explore everything you need to know about calculating and installing pond liners. 🌊
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Pond Lining Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Pond lining prevents water seepage, maintains water quality, and reduces maintenance costs. It's essential for efficient pond management.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Proper Lining
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Water retention</li>
            <li>Cost savings</li>
            <li>Better control</li>
            <li>Easy cleaning</li>
            <li>Erosion prevention</li>
            <li>Quality maintenance</li>
            <li>Long-term durability</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Lining Factors
        </Typography>
        <Typography variant="body1" paragraph>
          Essential considerations:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Size:</strong> Pond dimensions</li>
            <li><strong>Material:</strong> Liner type</li>
            <li><strong>Soil:</strong> Ground conditions</li>
            <li><strong>Climate:</strong> Weather impact</li>
            <li><strong>Usage:</strong> Purpose</li>
            <li><strong>Budget:</strong> Cost factors</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Install Lining
        </Typography>
        <Typography variant="body1" paragraph>
          Key times for installation:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>New construction</li>
            <li>Renovation</li>
            <li>Seepage issues</li>
            <li>Upgrades</li>
            <li>Maintenance</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Lining Process
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Planning:</strong> Use our calculator</li>
            <li><strong>Preparation:</strong> Site readiness</li>
            <li><strong>Selection:</strong> Choose material</li>
            <li><strong>Installation:</strong> Proper method</li>
            <li><strong>Testing:</strong> Check integrity</li>
            <li><strong>Maintenance:</strong> Regular care</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Lining Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Wrong size</li>
            <li>Poor installation</li>
            <li>Material damage</li>
            <li>Seam failure</li>
            <li>UV damage</li>
            <li>Ground movement</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Lining Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Proper Planning:</strong> Measure well
          2. <strong>Quality Material:</strong> Choose right
          3. <strong>Professional Install:</strong> Expert help
          4. <strong>Regular Checks:</strong> Maintain well
          5. <strong>Documentation:</strong> Keep records
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Lining
        </Typography>
        <Typography variant="body1" paragraph>
          Effective management leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>90% water retention</li>
            <li>Lower costs</li>
            <li>Better control</li>
            <li>Less maintenance</li>
            <li>Longer life</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: What liner should I use?</strong>
          <Typography paragraph>
            A: Depends on use and budget. Our calculator helps compare options.
          </Typography>

          <strong>Q: How much liner needed?</strong>
          <Typography paragraph>
            A: Based on pond size plus overlap. Our calculator provides exact amounts.
          </Typography>

          <strong>Q: How long does lining last?</strong>
          <Typography paragraph>
            A: 10-20 years with proper care. Our calculator helps plan replacement.
          </Typography>

          <strong>Q: Is lining worth the cost?</strong>
          <Typography paragraph>
            A: Yes, saves water and maintenance. Our calculator shows cost benefits.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper pond lining is crucial for successful aquaculture operations. Use our lining calculator above to plan your installation. Follow the guidelines in this guide to implement effective lining strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Construction Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};

export default PondLiningCalculator; 