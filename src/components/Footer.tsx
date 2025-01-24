import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  useTheme,
} from '@mui/material';

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: '🔍 Quick Links',
      items: [
        { name: '🏠 Home', path: '/' },
        { name: 'ℹ️ About', path: '/about' },
      ],
    },
    {
      title: '👥 Company',
      items: [
        { name: '👥 Our Team', path: '/team' },
        { name: '📞 Contact Us', path: '/contact' },
      ],
    },
    {
      title: '📜 Legal',
      items: [
        { name: '🔒 Privacy Policy', path: '/privacy' },
        { name: '⚖️ Disclaimer', path: '/disclaimer' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-evenly">
          {footerSections.map((section) => (
            <Grid item xs={12} sm={4} key={section.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {section.title}
              </Typography>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      component={RouterLink}
                      to={item.path}
                      color="text.secondary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {currentYear}
          {' 🌊 Aquaculture Tools. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
}
