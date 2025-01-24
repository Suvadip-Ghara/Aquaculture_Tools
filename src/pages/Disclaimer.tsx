import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function Disclaimer() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          ⚖️ Website Disclaimer
        </Typography>
        
        <Typography variant="body1" paragraph>
          Last updated: January 24, 2025
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          1. 📝 General Information
        </Typography>
        <Typography variant="body1" paragraph>
          The information provided by Aquaculture Tools is for general informational purposes only. All information is provided in good faith, however, we make no representation or warranty regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          2. 🎯 No Professional Advice
        </Typography>
        <Typography variant="body1" paragraph>
          The information provided should not be considered as professional advice. Always seek the advice of qualified professionals before making any aquaculture-related decisions. Any reliance you place on such information is strictly at your own risk.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          3. 📊 Calculation Tools
        </Typography>
        <Typography variant="body1" paragraph>
          Our calculation tools and predictive models are based on general principles and may not account for all variables in your specific situation. Results should be verified with actual measurements and professional consultation.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          4. 🔄 External Links
        </Typography>
        <Typography variant="body1" paragraph>
          Our website may contain links to external websites. We have no control over the content and practices of these sites and cannot accept responsibility for their respective privacy policies.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          5. 📱 Advertisements
        </Typography>
        <Typography variant="body1" paragraph>
          This website contains advertisements, including Google AdSense. We are not responsible for advertisers' claims or products. Any interaction with advertisers is solely between you and the advertiser.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          6. ⚠️ Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          In no event shall Aquaculture Tools be liable for any special, direct, indirect, consequential, or incidental damages arising from the use or inability to use our website and tools.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          7. 🔄 Updates
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to make changes to this disclaimer at any time. By continuing to use our website, you accept the updated disclaimer.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          For questions about this Disclaimer, please contact us through our Contact page.
        </Typography>
      </Paper>
    </Container>
  );
}
