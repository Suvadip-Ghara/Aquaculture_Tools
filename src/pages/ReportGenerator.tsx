import React, { useState } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  ExpandMore,
  PictureAsPdf,
  Description,
  TableChart,
} from '@mui/icons-material';

interface ReportConfig {
  type: string;
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  sections: string[];
  format: string;
}

const reportTypes = [
  'Production Performance',
  'Financial Statement',
  'Environmental Compliance',
  'Health Inspection',
  'Inventory Status',
  'Custom Report',
];

const reportSections = {
  'Production Performance': [
    'Growth Rate Analysis',
    'Feed Conversion Ratio',
    'Survival Rate',
    'Biomass Production',
    'Water Quality Trends',
    'Disease Incidents',
  ],
  'Financial Statement': [
    'Revenue Analysis',
    'Cost Breakdown',
    'Profit Margins',
    'ROI Analysis',
    'Cash Flow Statement',
    'Budget Variance',
  ],
  'Environmental Compliance': [
    'Water Quality Parameters',
    'Waste Management',
    'Energy Usage',
    'Chemical Usage',
    'Environmental Impact',
    'Sustainability Metrics',
  ],
  'Health Inspection': [
    'Disease Incidents',
    'Treatment Records',
    'Mortality Rates',
    'Quarantine Records',
    'Medication Usage',
    'Health Certifications',
  ],
  'Inventory Status': [
    'Feed Stock',
    'Equipment Status',
    'Medication Inventory',
    'Supply Usage',
    'Reorder Analysis',
    'Stock Valuation',
  ],
  'Custom Report': [
    'Custom Section 1',
    'Custom Section 2',
    'Custom Section 3',
    'Custom Section 4',
    'Custom Section 5',
  ],
};

const reportFormats = ['PDF', 'Excel', 'Word'];

const initialConfig: ReportConfig = {
  type: '',
  title: '',
  dateRange: {
    start: '',
    end: '',
  },
  sections: [],
  format: 'PDF',
};

// Sample data for demonstration
const sampleData = {
  productionMetrics: {
    growthRate: 2.5,
    fcr: 1.8,
    survivalRate: 85,
    biomass: 1200,
  },
  financialMetrics: {
    revenue: 50000,
    costs: 35000,
    profit: 15000,
    roi: 42.8,
  },
  environmentalMetrics: {
    waterQuality: 'Good',
    wasteManagement: 'Compliant',
    energyUsage: 'Optimal',
    chemicalUsage: 'Within Limits',
  },
};

export default function ReportGenerator() {
  const [config, setConfig] = useState<ReportConfig>(initialConfig);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const type = event.target.value as string;
    setConfig({
      ...config,
      type,
      sections: [],
      title: `${type} Report`,
    });
  };

  const handleSectionToggle = (section: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter((s) => s !== section)
        : [...prev.sections, section],
    }));
  };

  const generatePreview = () => {
    // In a real application, this would fetch actual data
    // Here we're using sample data for demonstration
    setPreviewData({
      title: config.title,
      dateRange: config.dateRange,
      sections: config.sections.map((section) => ({
        name: section,
        data: generateSectionData(section),
      })),
    });
  };

  const generateSectionData = (section: string) => {
    // Simulate data generation based on section type
    switch (section) {
      case 'Growth Rate Analysis':
        return {
          dailyGrowth: sampleData.productionMetrics.growthRate,
          trendData: [2.3, 2.4, 2.5, 2.6, 2.5],
        };
      case 'Feed Conversion Ratio':
        return {
          currentFCR: sampleData.productionMetrics.fcr,
          targetFCR: 1.6,
          trend: 'Improving',
        };
      case 'Revenue Analysis':
        return {
          totalRevenue: sampleData.financialMetrics.revenue,
          growth: 15,
          sources: ['Market Sales', 'Direct Sales'],
        };
      // Add more cases as needed
      default:
        return {
          status: 'Data available',
          lastUpdated: new Date().toISOString(),
        };
    }
  };

  const handleDownload = () => {
    // In a real application, this would generate and download the report
    alert(`Downloading ${config.title} in ${config.format} format`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Report Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate comprehensive reports for your aquaculture operations.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={config.type}
                    onChange={handleTypeChange}
                    label="Report Type"
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Title"
                  value={config.title}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={config.dateRange.start}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value },
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={config.dateRange.end}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value },
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Report Format</InputLabel>
                  <Select
                    value={config.format}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        format: e.target.value as string,
                      }))
                    }
                    label="Report Format"
                  >
                    {reportFormats.map((format) => (
                      <MenuItem key={format} value={format}>
                        {format}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {config.type && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Sections
                </Typography>
                <FormGroup>
                  {reportSections[config.type as keyof typeof reportSections].map(
                    (section) => (
                      <FormControlLabel
                        key={section}
                        control={
                          <Checkbox
                            checked={config.sections.includes(section)}
                            onChange={() => handleSectionToggle(section)}
                          />
                        }
                        label={section}
                      />
                    )
                  )}
                </FormGroup>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={generatePreview}
                disabled={!config.type || config.sections.length === 0}
              >
                Preview Report
              </Button>
              <Button
                variant="contained"
                onClick={handleDownload}
                disabled={!previewData}
                startIcon={
                  config.format === 'PDF' ? (
                    <PictureAsPdf />
                  ) : config.format === 'Excel' ? (
                    <TableChart />
                  ) : (
                    <Description />
                  )
                }
              >
                Download {config.format}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {previewData && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Report Preview
              </Typography>
              <Typography variant="subtitle1" color="primary">
                {previewData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Period: {previewData.dateRange.start} to {previewData.dateRange.end}
              </Typography>

              {previewData.sections.map((section: any, index: number) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{section.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {Object.entries(section.data).map(
                            ([key, value]: [string, any]) => (
                              <TableRow key={key}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </TableCell>
                                <TableCell>
                                  {Array.isArray(value) ? (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      {value.map((v, i) => (
                                        <Chip
                                          key={i}
                                          label={v}
                                          size="small"
                                          variant="outlined"
                                        />
                                      ))}
                                    </Box>
                                  ) : (
                                    value.toString()
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* SEO-optimized Blog Content */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          📊 Report Generation: Complete Guide to Farm Documentation
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your comprehensive guide on report generation in aquaculture! Effective documentation is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about creating and managing farm reports. 📝
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🤔 Why is Report Generation Important?
        </Typography>
        <Typography variant="body1" paragraph>
          Proper reporting helps track progress, make decisions, and ensure compliance. It's essential for farm management and growth.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🎯 Benefits of Good Reports
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Better tracking</li>
            <li>Clear insights</li>
            <li>Data-driven decisions</li>
            <li>Compliance proof</li>
            <li>Progress monitoring</li>
            <li>Team communication</li>
            <li>Better management</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📊 Key Report Elements
        </Typography>
        <Typography variant="body1" paragraph>
          Essential components:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Data:</strong> Key metrics</li>
            <li><strong>Analysis:</strong> Insights</li>
            <li><strong>Trends:</strong> Patterns</li>
            <li><strong>Issues:</strong> Problems</li>
            <li><strong>Actions:</strong> Steps taken</li>
            <li><strong>Plans:</strong> Next steps</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⏰ When to Generate Reports
        </Typography>
        <Typography variant="body1" paragraph>
          Key reporting times:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Daily updates</li>
            <li>Weekly reviews</li>
            <li>Monthly analysis</li>
            <li>Quarterly checks</li>
            <li>Annual reviews</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📝 Step-by-Step Reporting
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li><strong>Data:</strong> Use our tool</li>
            <li><strong>Collect:</strong> Gather info</li>
            <li><strong>Analyze:</strong> Find insights</li>
            <li><strong>Format:</strong> Structure well</li>
            <li><strong>Review:</strong> Check accuracy</li>
            <li><strong>Share:</strong> Distribute</li>
          </ol>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ⚠️ Common Reporting Issues
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Missing data</li>
            <li>Poor organization</li>
            <li>Late submissions</li>
            <li>Unclear insights</li>
            <li>Format problems</li>
            <li>Access issues</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          💡 Expert Reporting Tips
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Regular Updates:</strong> Stay current
          2. <strong>Clear Format:</strong> Be organized
          3. <strong>Key Metrics:</strong> Focus important
          4. <strong>Visual Data:</strong> Use graphs
          5. <strong>Action Items:</strong> List next steps
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🌟 Impact of Good Reports
        </Typography>
        <Typography variant="body1" paragraph>
          Effective reporting leads to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>30-40% better decisions</li>
            <li>Clear tracking</li>
            <li>Better planning</li>
            <li>Team alignment</li>
            <li>Better results</li>
          </ul>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          🔍 Frequently Asked Questions
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Q: How to structure reports?</strong>
          <Typography paragraph>
            A: Multiple formats exist. Our tool guides organization.
          </Typography>

          <strong>Q: Best metrics?</strong>
          <Typography paragraph>
            A: Depends on goals. Our tool suggests key indicators.
          </Typography>

          <strong>Q: Report frequency?</strong>
          <Typography paragraph>
            A: Varies by need. Our tool helps schedule.
          </Typography>

          <strong>Q: Data analysis?</strong>
          <Typography paragraph>
            A: Multiple methods. Our tool assists analysis.
          </Typography>
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          📚 Conclusion
        </Typography>
        <Typography variant="body1" paragraph>
          Proper report generation is crucial for successful aquaculture operations. Use our report generator tool above to create professional reports. Follow the guidelines in this guide to implement effective reporting strategies.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last Updated: January 2025 | Written by Aquaculture Management Specialists | Based on Latest Research and Industry Best Practices
        </Typography>
      </Paper>
    </Container>
  );
};