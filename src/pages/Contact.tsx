import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  Stack,
  Link,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  School,
  Facebook,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';

export default function Contact() {
  const contactInfo = [
    {
      icon: <Email fontSize="large" color="primary" />,
      title: 'Email',
      details: [
        'mashraf38@skuastkashmir.ac.in',
        'biotechashraf786@gmail.com'
      ],
    },
    {
      icon: <Phone fontSize="large" color="primary" />,
      title: 'Phone',
      details: ['+91 8825069472'],
    },
    {
      icon: <LocationOn fontSize="large" color="primary" />,
      title: 'Address',
      details: [
        'Faculty of Fisheries Rangil- Ganderbal',
        'SKUAST-Kashmir, Ganderbal campus',
        'J&K- 190006'
      ],
    },
    {
      icon: <School fontSize="large" color="primary" />,
      title: 'Institution',
      details: ['Sher-e-Kashmir University of Agricultural Sciences and Technology of Kashmir'],
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, name: 'Facebook', url: 'https://facebook.com/skuastkashmir' },
    { icon: <Twitter />, name: 'Twitter', url: 'https://twitter.com/skuastkashmir' },
    { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://linkedin.com/company/skuast-kashmir' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          📞 Contact Us
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph align="center" sx={{ mb: 6 }}>
          Get in touch with our team
        </Typography>

        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom align="center">
                    {info.title}
                  </Typography>
                  {info.details.map((detail, idx) => (
                    <Typography 
                      key={idx}
                      variant="body2" 
                      color="text.secondary" 
                      align="center"
                      sx={{ mb: 0.5 }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom align="center">
            🌐 Connect With Us
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            sx={{ mt: 4 }}
          >
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {social.icon}
              </Link>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            📍 Visit Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We're located in the beautiful campus of SKUAST-Kashmir.
            <br />
            Feel free to visit us during working hours:
            <br />
            Monday to Friday: 9:00 AM - 5:00 PM
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
