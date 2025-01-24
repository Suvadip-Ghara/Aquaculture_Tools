import React from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, useTheme } from '@mui/material';

export default function About() {
  const theme = useTheme();

  const features = [
    {
      title: '💧 Water Management',
      description: 'Comprehensive water quality monitoring, prediction, and management tools for optimal aquaculture conditions.'
    },
    {
      title: '🐟 Fish Management',
      description: 'Advanced tools for tracking growth, monitoring health, and optimizing fish production cycles.'
    },
    {
      title: '🍽️ Feed Management',
      description: 'Smart feeding calculators and FCR optimization tools to maximize feed efficiency and reduce costs.'
    },
    {
      title: '🏥 Health Management',
      description: 'Disease prevention and risk assessment tools to maintain healthy aquaculture populations.'
    },
    {
      title: '🌡️ Environmental Monitoring',
      description: 'Environmental parameter tracking and analysis for sustainable aquaculture practices.'
    },
    {
      title: '📊 Business Analytics',
      description: 'Comprehensive business tools for market analysis, profitability calculation, and production planning.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          🌊 About Aquaculture Tools
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph align="center">
          Your Complete Aquaculture Management Solution
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 4 }}>
          Welcome to Aquaculture Tools, the most comprehensive suite of digital tools designed specifically for modern aquaculture management. Our platform combines cutting-edge technology with practical aquaculture expertise to help farmers, researchers, and industry professionals optimize their operations.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          🎯 Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          To empower aquaculture professionals with state-of-the-art digital tools that enhance productivity, sustainability, and profitability in aquaculture operations. We strive to make advanced aquaculture management accessible to everyone, from small-scale farmers to large commercial operations.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          ✨ Key Features
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature) => (
            <Grid item xs={12} md={6} key={feature.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          💪 Why Choose Us
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Comprehensive suite of 30+ specialized aquaculture tools</li>
            <li>User-friendly interface designed for all experience levels</li>
            <li>Real-time monitoring and predictive analytics</li>
            <li>Research-based calculations and recommendations</li>
            <li>Regular updates with new features and improvements</li>
            <li>Dedicated support team for technical assistance</li>
          </ul>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          🎯 Target Users
        </Typography>
        <Typography variant="body1" component="div">
          Our tools are perfect for:
          <ul>
            <li>Commercial aquaculture farms</li>
            <li>Research institutions</li>
            <li>Aquaculture consultants</li>
            <li>Small-scale farmers</li>
            <li>Educational institutions</li>
            <li>Government agencies</li>
          </ul>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          🌟 Benefits
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Increased productivity and efficiency</li>
            <li>Reduced operational costs</li>
            <li>Improved water quality management</li>
            <li>Better disease prevention</li>
            <li>Enhanced feed optimization</li>
            <li>Data-driven decision making</li>
            <li>Sustainable practices implementation</li>
          </ul>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          🔒 Our Commitment
        </Typography>
        <Typography variant="body1" paragraph>
          We are committed to providing reliable, accurate, and user-friendly tools that make a real difference in aquaculture operations. Our team continuously works to improve and expand our offerings based on user feedback and industry developments.
        </Typography>

        <Box sx={{ mt: 6, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom color="primary.contrastText">
            🚀 Get Started Today
          </Typography>
          <Typography variant="body1" color="primary.contrastText">
            Join thousands of aquaculture professionals who are already using our tools to improve their operations. Explore our comprehensive suite of tools and take your aquaculture management to the next level.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Last updated: January 24, 2025
        </Typography>
      </Paper>
    </Container>
  );
}