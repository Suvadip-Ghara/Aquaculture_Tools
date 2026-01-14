import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import { Science, Psychology, Biotech } from '@mui/icons-material';

export default function Team() {
  const teamMembers = [
    {
      name: 'Dr. Mohd Ashraf Rather',
      title: 'Assistant Professor',
      department: 'Division of Fish Genetics and Biotechnology',
      affiliation: 'College of Fisheries, SKUAST-Kashmir',
      expertise: ['Molecular Biology', 'Genetics', 'Biotechnology'],
      email: 'mashraf38@skuastkashmir.ac.in',
      image: '/ashraf.png',
      icon: <Science fontSize="large" color="primary" />,
    },
    {
      name: 'Suvadip Ghara',
      title: 'M.F.Sc Student',
      department: 'Division of Fish Genetics and Biotechnology',
      affiliation: 'College of Fisheries, SKUAST-Kashmir',
      expertise: ['Aquaculture', 'Digital Tools', 'Research'],
      email: 'suvadip.ghara@skuastkashmir.ac.in',
      image: '/suvadip.png',
      icon: <Biotech fontSize="large" color="primary" />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          👥 Our Team
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph align="center" sx={{ mb: 6 }}>
          Meet the experts behind Aquaculture Tools
        </Typography>

        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
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
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar 
                      src={member.image}
                      alt={member.name}
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        margin: 'auto',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {!member.image && member.icon}
                    </Avatar>
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom align="center">
                    {member.name}
                  </Typography>
                  <Typography color="text.secondary" align="center" gutterBottom>
                    {member.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {member.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                    {member.affiliation}
                  </Typography>
                  <Typography variant="body2" color="primary" align="center" sx={{ mt: 1 }}>
                    {member.email}
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ 
                      mt: 2, 
                      flexWrap: 'wrap', 
                      gap: 1,
                      justifyContent: 'center'
                    }}
                  >
                    {member.expertise.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            🏛️ Our Institution
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sher-e-Kashmir University of Agricultural Sciences and Technology of Kashmir
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Faculty of Fisheries Rangil- Ganderbal, SKUAST-Kashmir
            <br />
            Ganderbal campus, J&K- 190006
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
